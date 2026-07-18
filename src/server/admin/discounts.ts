import { getDb } from "@/db";
import { discounts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Discount = InferSelectModel<typeof discounts>;
export type NewDiscount = InferInsertModel<typeof discounts>;

export async function fetchDiscounts() {
  const db = getDb();
  return await db.select().from(discounts).orderBy(desc(discounts.createdAt));
}

export async function fetchDiscountById(id: number) {
  const db = getDb();
  const rows = await db.select().from(discounts).where(eq(discounts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function fetchDiscountByCode(code: string) {
  const db = getDb();
  const rows = await db.select().from(discounts).where(eq(discounts.code, code)).limit(1);
  return rows[0] ?? null;
}

export async function createDiscount(data: NewDiscount) {
  const db = getDb();
  const rows = await db.insert(discounts).values(data).returning();
  return rows[0];
}

export async function updateDiscount(id: number, data: Partial<NewDiscount>) {
  const db = getDb();
  const rows = await db.update(discounts).set(data).where(eq(discounts.id, id)).returning();
  return rows[0] ?? null;
}

export async function deleteDiscount(id: number) {
  const db = getDb();
  await db.delete(discounts).where(eq(discounts.id, id));
}
