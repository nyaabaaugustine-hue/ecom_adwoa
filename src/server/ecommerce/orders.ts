import { getDb } from "@/db";
import { orders, products } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

type NewOrder = InferInsertModel<typeof orders>;
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
export type PaymentMethod = "paystack" | "cod";
export type OrderItem = { productId?: number; name: string; price: number; quantity: number };

export async function fetchOrders(reference?: string) {
  const db = getDb();
  if (reference) {
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.reference, reference))
      .limit(1);
    return rows[0] ?? null;
  }
  return await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));
}

export async function fetchOrderById(id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.id, Number(id)))
    .limit(1);
  return rows[0] ?? null;
}

async function decrementStockForItems(items: OrderItem[]) {
  const db = getDb();
  for (const item of items) {
    if (item.productId && item.quantity) {
      await db
        .update(products)
        .set({
          stock: sql`GREATEST(stock - ${item.quantity}, 0)`,
          updatedAt: sql`NOW()`,
        })
        .where(eq(products.id, item.productId));
    }
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const db = getDb();

  // Cash-on-delivery orders are only "paid" once the courier actually
  // hands over the cash — which is exactly the moment the order is marked
  // delivered. Auto-flip paymentStatus so the dashboard reflects reality
  // without a separate manual step.
  const existing = await db.select().from(orders).where(eq(orders.id, Number(orderId))).limit(1);
  const current = existing[0];

  const shouldMarkPaid =
    status === "delivered" &&
    current?.paymentMethod === "cod" &&
    current?.paymentStatus !== "paid";

  const rows = await db
    .update(orders)
    .set({
      status,
      ...(shouldMarkPaid ? { paymentStatus: "paid" } : {}),
      updatedAt: sql`NOW()`,
    })
    .where(eq(orders.id, Number(orderId)))
    .returning();
  return rows[0] ?? null;
}

export async function createPendingOrder(data: {
  reference: string;
  customerId: number;
  name?: string;
  email: string;
  phone?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
}) {
  const db = getDb();
  const rows = await db
    .insert(orders)
    .values({
      reference: data.reference,
      customerId: data.customerId,
      customerName: data.name ?? "",
      customerEmail: data.email,
      customerPhone: data.phone ?? "",
      items: JSON.stringify(data.items),
      subtotal: String(data.subtotal),
      total: String(data.total),
      status: "pending",
      paymentStatus: "unpaid",
      paymentMethod: "paystack",
    } as NewOrder)
    .returning();
  return rows[0];
}

/**
 * Cash-on-delivery order: unlike the Paystack flow, there's no payment
 * gateway to verify, so the order is confirmed and stock is reserved
 * immediately at checkout. paymentStatus stays "unpaid" until the courier
 * collects cash on delivery (see updateOrderStatus above).
 */
export async function createCodOrder(data: {
  reference: string;
  customerId: number;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
}) {
  const db = getDb();
  const rows = await db
    .insert(orders)
    .values({
      reference: data.reference,
      customerId: data.customerId,
      customerName: data.name ?? "",
      customerEmail: data.email,
      customerPhone: data.phone ?? "",
      items: JSON.stringify(data.items),
      subtotal: String(data.subtotal),
      total: String(data.total),
      status: "processing",
      paymentStatus: "unpaid",
      paymentMethod: "cod",
      notes: data.notes ?? null,
    } as NewOrder)
    .returning();

  await decrementStockForItems(data.items);

  return rows[0];
}

export async function markOrderPaid(reference: string) {
  const db = getDb();
  const rows = await db
    .update(orders)
    .set({
      paymentStatus: "paid",
      status: "processing",
      paystackRef: reference,
      updatedAt: sql`NOW()`,
    })
    .where(
      and(
        eq(orders.reference, reference),
        eq(orders.paymentStatus, "unpaid")
      )
    )
    .returning({ items: orders.items });

  const order = rows[0];
  if (order?.items) {
    let items: OrderItem[] = [];
    try {
      items = Array.isArray(order.items) ? order.items : JSON.parse(order.items as string);
    } catch {
      items = [];
    }
    await decrementStockForItems(items);
  }
}

export async function markOrderFailed(reference: string) {
  const db = getDb();
  await db
    .update(orders)
    .set({ paymentStatus: "failed", updatedAt: sql`NOW()` })
    .where(eq(orders.reference, reference));
}
