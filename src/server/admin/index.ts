import { getDb } from "@/db";
import { shippingZones, storeSettings, notificationSettings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

// ── Shipping Zones ──
export type NewShippingZone = InferInsertModel<typeof shippingZones>;
export async function fetchShippingZones() {
  const db = getDb();
  return await db.select().from(shippingZones).orderBy(desc(shippingZones.createdAt));
}

export async function createShippingZone(data: NewShippingZone) {
  const db = getDb();
  const rows = await db.insert(shippingZones).values(data).returning();
  return rows[0];
}

export async function updateShippingZone(id: number, data: Partial<NewShippingZone>) {
  const db = getDb();
  const rows = await db.update(shippingZones).set(data).where(eq(shippingZones.id, id)).returning();
  return rows[0] ?? null;
}

export async function deleteShippingZone(id: number) {
  const db = getDb();
  await db.delete(shippingZones).where(eq(shippingZones.id, id));
}

// ── Store Settings ──
export async function fetchStoreSettings() {
  const db = getDb();
  return await db.select().from(storeSettings);
}

export async function upsertStoreSetting(key: string, value: string) {
  const db = getDb();
  const existing = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);
  if (existing[0]) {
    const rows = await db.update(storeSettings).set({ value }).where(eq(storeSettings.key, key)).returning();
    return rows[0];
  }
  const rows = await db.insert(storeSettings).values({ key, value }).returning();
  return rows[0];
}

// ── Notification Settings ──
export async function fetchNotificationSettings() {
  const db = getDb();
  return await db.select().from(notificationSettings);
}

export async function upsertNotificationSetting(channel: string, event: string, enabled: boolean) {
  const db = getDb();
  const existing = await db.select().from(notificationSettings).where(eq(notificationSettings.event, event)).limit(1);
  if (existing[0]) {
    const rows = await db.update(notificationSettings).set({ channel, enabled }).where(eq(notificationSettings.event, event)).returning();
    return rows[0];
  }
  const rows = await db.insert(notificationSettings).values({ channel: channel as "email", event, enabled }).returning();
  return rows[0];
}

export { fetchDiscounts, fetchDiscountById, createDiscount, updateDiscount, deleteDiscount } from "./discounts";
