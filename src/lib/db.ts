/**
 * lib/db.ts
 * Neon PostgreSQL client — single shared instance for the whole app.
 * DATABASE_URL is validated lazily (at call time, not at module load time)
 * so that Next.js can collect page data during build without a live DB.
 */

import { neon, neonConfig } from "@neondatabase/serverless";

// Enable connection pooling (recommended for serverless)
neonConfig.fetchConnectionCache = true;

/**
 * Returns a tagged-template sql client.
 * Throws at *call time* (not import time) if DATABASE_URL is missing,
 * which prevents build-time errors when the env var is only set in prod.
 */
function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(url);
}

/**
 * Lazily-initialised sql client.
 * All API routes call this; it's never executed during `next build`.
 */
export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    const client = getDb();
    const value = (client as any)[prop];
    if (typeof value === "function") return value.bind(client);
    return value;
  },
  apply(_target, _thisArg, args) {
    const client = getDb();
    return (client as any)(...args);
  },
});

// Also allow direct use as a tagged-template function via default export trick
export function createSql() {
  return getDb();
}

/**
 * Run this once to create all tables (call from a setup script or
 * from an API route at /api/setup — protect it with a secret).
 */
export async function createTables() {
  const db = getDb();

  await db`
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

  await db`
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

  await db`
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT
  `;

  await db`
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

  await db`
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
