/**
 * lib/db.ts
 * Neon PostgreSQL client — lazily initialised so Next.js can run
 * `next build` without a DATABASE_URL environment variable.
 *
 * Usage in every API route:
 *   import { getDb } from "@/lib/db";
 *   const sql = getDb();
 *   const rows = await sql`SELECT ...`;
 */

import { neon, neonConfig } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";

// Enable connection pooling (recommended for serverless)
neonConfig.fetchConnectionCache = true;

// Module-level cached instance — created once per cold-start, never at import time
let _client: NeonQueryFunction<false, false> | null = null;

/**
 * Returns a Neon sql tagged-template client.
 * Throws at *call time* (not import time) if DATABASE_URL is missing,
 * which means the build succeeds even without the env var.
 */
export function getDb(): NeonQueryFunction<false, false> {
  if (_client) return _client;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  _client = neon(url);
  return _client;
}

/**
 * Run this once to create all tables with best practices:
 * - Check constraints for data integrity
 * - Indexes on frequently queried columns
 * - Soft-delete support
 * - Cascade deletes where appropriate
 * - Auto-update updated_at triggers
 */
export async function createTables() {
  const sql = getDb();

  // ── Products ──────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      brand         TEXT NOT NULL,
      price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
      original_price NUMERIC(10,2) CHECK (original_price IS NULL OR original_price >= 0),
      rating        NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
      reviews       INTEGER DEFAULT 0 CHECK (reviews >= 0),
      category      TEXT NOT NULL,
      image         TEXT,
      badge         TEXT,
      stock         INTEGER DEFAULT 0 CHECK (stock >= 0),
      description   TEXT,
      active        BOOLEAN DEFAULT TRUE,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW(),
      deleted_at    TIMESTAMPTZ DEFAULT NULL
    )
  `;

  // ── Customers ─────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT UNIQUE NOT NULL,
      phone      TEXT,
      address    TEXT,
      role       TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'vip')),
      password_hash TEXT,
      avatar     TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ DEFAULT NULL
    )
  `;

  // Migration guard: add columns if upgrading an existing DB
  await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT`;
  await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS avatar TEXT`;
  await sql`ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`;

  // ── Orders ────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id             SERIAL PRIMARY KEY,
      reference      TEXT UNIQUE NOT NULL,
      customer_id    INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      customer_name  TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      items          JSONB NOT NULL,
      subtotal       NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
      total          NUMERIC(10,2) NOT NULL CHECK (total >= 0),
      status         TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled','returned')),
      payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','failed','refunded')),
      paystack_ref   TEXT,
      notes          TEXT,
      created_at     TIMESTAMPTZ DEFAULT NOW(),
      updated_at     TIMESTAMPTZ DEFAULT NOW(),
      deleted_at     TIMESTAMPTZ DEFAULT NULL
    )
  `;

  // Migration guard
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT`;

  // ── Order Items ───────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id         SERIAL PRIMARY KEY,
      order_id   INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      name       TEXT NOT NULL,
      price      NUMERIC(10,2) NOT NULL CHECK (price >= 0),
      quantity   INTEGER NOT NULL CHECK (quantity > 0)
    )
  `;

  // ── Audit Log ─────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS audit_log (
      id          SERIAL PRIMARY KEY,
      table_name  TEXT NOT NULL,
      record_id   INTEGER,
      action      TEXT NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
      old_data    JSONB,
      new_data    JSONB,
      changed_by  TEXT DEFAULT 'system',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // ── INDEXES ───────────────────────────────────────────────
  // Products
  await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category) WHERE deleted_at IS NULL`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_active ON products(active) WHERE deleted_at IS NULL`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(name gin_trgm_ops)`;

  // Customers
  await sql`CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email) WHERE deleted_at IS NULL`;
  await sql`CREATE INDEX IF NOT EXISTS idx_customers_name ON customers USING gin(name gin_trgm_ops)`;

  // Orders
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id) WHERE deleted_at IS NULL`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status) WHERE deleted_at IS NULL`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(reference)`;

  // Order items
  await sql`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id)`;

  // Audit log
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name, record_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC)`;

  // ── AUTO-UPDATE updated_at TRIGGERS ──────────────────────
  // Products
  await sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `;

  for (const table of ['products', 'customers', 'orders']) {
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'update_${table}_updated_at'
        ) THEN
          EXECUTE format(
            'CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
            '${table}', '${table}'
          );
        END IF;
      END
      $$;
    `;
  }

  // ── TRIGRAM EXTENSION ─────────────────────────────────────
  await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;

  console.log("✅ All tables, indexes, and triggers created successfully");
}
