import { getDb } from "@/db";
import { products } from "@/db/schema";
import { eq, and, desc, isNull, sql } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

type NewProduct = InferInsertModel<typeof products>;

export async function fetchActiveProducts() {
  const db = getDb();
  return await db
    .select()
    .from(products)
    .where(and(eq(products.active, true), isNull(products.deletedAt)))
    .orderBy(desc(products.createdAt));
}

export async function fetchAllProducts() {
  const db = getDb();
  return await db
    .select()
    .from(products)
    .where(isNull(products.deletedAt))
    .orderBy(desc(products.createdAt));
}

export async function fetchProductById(id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.id, Number(id)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createProduct(data: Partial<NewProduct>) {
  const db = getDb();
  const rows = await db
    .insert(products)
    .values(data as NewProduct)
    .returning();
  return rows[0];
}

export async function updateProduct(id: string, data: Partial<NewProduct>) {
  const db = getDb();
  const rows = await db
    .update(products)
    .set({ ...data, updatedAt: sql`NOW()` })
    .where(eq(products.id, Number(id)))
    .returning();
  return rows[0] ?? null;
}

export async function deleteProduct(id: string) {
  const db = getDb();
  await db
    .update(products)
    .set({ deletedAt: sql`NOW()` })
    .where(eq(products.id, Number(id)));
}
