import { getDb } from "@/db";
import { customers } from "@/db/schema";
import { eq, desc, isNull, sql } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

type NewCustomer = InferInsertModel<typeof customers>;

export async function fetchCustomers() {
  const db = getDb();
  return await db
    .select()
    .from(customers)
    .where(isNull(customers.deletedAt))
    .orderBy(desc(customers.createdAt));
}

export async function fetchCustomerByEmail(email: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(customers)
    .where(eq(customers.email, email))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertCustomer(payload: Partial<NewCustomer>) {
  const db = getDb();
  const existing = await fetchCustomerByEmail(payload.email!);
  if (existing) {
    const rows = await db
      .update(customers)
      .set({
        name: payload.name ?? existing.name,
        phone: payload.phone ?? existing.phone,
        address: payload.address ?? existing.address,
        updatedAt: sql`NOW()`,
      })
      .where(eq(customers.email, payload.email!))
      .returning();
    return rows[0];
  }
  const rows = await db
    .insert(customers)
    .values({
      name: payload.name ?? "",
      email: payload.email!,
      phone: payload.phone ?? "",
      address: payload.address ?? "",
    } as NewCustomer)
    .returning();
  return rows[0];
}
