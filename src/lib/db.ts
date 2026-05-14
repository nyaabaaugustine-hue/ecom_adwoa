/**
 * lib/db.ts
 * Neon PostgreSQL client — single shared instance for the whole app.
 * Uses the @neondatabase/serverless driver which works in Next.js
 * edge runtime, serverless functions, and Node.js.
 */

import { neon, neonConfig } from "@neondatabase/serverless";

// Enable connection pooling (recommended for serverless)
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const sql = neon(process.env.DATABASE_URL);

/**
 * Run this once to create all tables (call from a setup script or
 * from an API route at /api/setup — protect it with a secret).
 */
export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      brand       TEXT NOT NULL,
      price       NUMERIC(10,2) NOT NULL,
      original_price NUMERIC(10,2),
      rating      NUMERIC(3,2) DEFAULT 0,
      reviews     INTEGER DEFAULT 0,
      category    TEXT NOT NULL,
      image       TEXT,
      badge       TEXT,
      stock       INTEGER DEFAULT 0,
      description TEXT,
      active      BOOLEAN DEFAULT TRUE,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
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
    CREATE TABLE IF NOT EXISTS orders (
      id              SERIAL PRIMARY KEY,
      reference       TEXT UNIQUE NOT NULL,
      customer_id     INTEGER REFERENCES customers(id),
      customer_name   TEXT,
      customer_email  TEXT,
      customer_phone  TEXT,
      items           JSONB NOT NULL,
      subtotal        NUMERIC(10,2) NOT NULL,
      total           NUMERIC(10,2) NOT NULL,
      status          TEXT DEFAULT 'pending',
      payment_status  TEXT DEFAULT 'unpaid',
      paystack_ref    TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW()
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
