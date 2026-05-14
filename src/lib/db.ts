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
 * Run this once to create all tables.
 * Call from /api/setup (protect with a secret).
 */
export async function createTables() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      brand         TEXT NOT NULL,
      price         NUMERIC(10,2) NOT NULL,
      original_price NUMERIC(10,2),
      rating        NUMERIC(3,2) DEFAULT 0,
      reviews       INTEGER DEFAULT 0,
      category      TEXT NOT NULL,
      image         TEXT,
      badge         TEXT,
      stock         INTEGER DEFAULT 0,
      description   TEXT,
      active        BOOLEAN DEFAULT TRUE,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT UNIQUE NOT NULL,
      phone      TEXT,
      address    TEXT,
      role       TEXT DEFAULT 'customer',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id             SERIAL PRIMARY KEY,
      reference      TEXT UNIQUE NOT NULL,
      customer_id    INTEGER REFERENCES customers(id),
      customer_name  TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      items          JSONB NOT NULL,
      subtotal       NUMERIC(10,2) NOT NULL,
      total          NUMERIC(10,2) NOT NULL,
      status         TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'unpaid',
      paystack_ref   TEXT,
      created_at     TIMESTAMPTZ DEFAULT NOW(),
      updated_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id         SERIAL PRIMARY KEY,
      order_id   INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id),
      name       TEXT NOT NULL,
      price      NUMERIC(10,2) NOT NULL,
      quantity   INTEGER NOT NULL
    )
  `;

  console.log("✅ All tables created successfully");
}
