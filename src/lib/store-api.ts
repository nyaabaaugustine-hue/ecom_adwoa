/**
 * lib/store-api.ts
 * Client-side helpers for talking to the store's own API routes.
 * Converts DB rows (snake_case, numeric-as-string) into the shapes
 * the existing UI components already expect (camelCase, real numbers).
 */

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  badge?: string;
  stock: number;
  description: string;
  active?: boolean;
}

export interface OrderItem {
  id?: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

function normalizeProduct(row: any): Product {
  return {
    id: Number(row.id),
    name: row.name,
    brand: row.brand,
    price: Number(row.price),
    originalPrice: row.originalPrice != null ? Number(row.originalPrice) : undefined,
    rating: row.rating != null ? Number(row.rating) : 0,
    reviews: row.reviews != null ? Number(row.reviews) : 0,
    category: row.category,
    image: row.image ?? "",
    badge: row.badge ?? undefined,
    stock: row.stock != null ? Number(row.stock) : 0,
    description: row.description ?? "",
    active: row.active,
  };
}

function normalizeOrder(row: any): Order {
  let items: OrderItem[] = [];
  try {
    items = Array.isArray(row.items) ? row.items : JSON.parse(row.items ?? "[]");
  } catch {
    items = [];
  }
  return {
    id: Number(row.id),
    reference: row.reference,
    // Drizzle returns rows keyed by the schema's TS field names (camelCase),
    // not the raw snake_case SQL column names — read camelCase first, and
    // fall back to snake_case only in case a raw SQL row is ever passed in.
    customerName: row.customerName ?? row.customer_name ?? "",
    customerEmail: row.customerEmail ?? row.customer_email ?? "",
    customerPhone: row.customerPhone ?? row.customer_phone ?? "",
    items,
    subtotal: Number(row.subtotal ?? 0),
    total: Number(row.total ?? 0),
    status: row.status ?? "pending",
    paymentStatus: row.paymentStatus ?? row.payment_status ?? "unpaid",
    paymentMethod: row.paymentMethod ?? row.payment_method ?? "paystack",
    createdAt: row.createdAt ?? row.created_at,
    updatedAt: row.updatedAt ?? row.updated_at,
  };
}

function normalizeCustomer(row: any): Customer {
  return {
    id: Number(row.id),
    name: row.name ?? "",
    email: row.email,
    phone: row.phone ?? "",
    address: row.address ?? "",
    createdAt: row.createdAt ?? row.created_at,
  };
}

// ── Admin helpers ─────────────────────────────────────────────────
export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function toErrorMessage(body: any, status: number): string {
  const err = body?.error;
  if (typeof err === "string" && err.trim()) return err;
  if (Array.isArray(err)) {
    return err
      .map((issue: any) =>
        typeof issue === "string"
          ? issue
          : issue?.message
          ? `${issue.path ? issue.path.join(".") + ": " : ""}${issue.message}`
          : JSON.stringify(issue)
      )
      .join("; ");
  }
  if (err && typeof err === "object") {
    try {
      return JSON.stringify(err);
    } catch {
      return `Request failed (${status})`;
    }
  }
  return `Request failed (${status})`;
}

async function handle(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(toErrorMessage(body, res.status));
  }
  return res.json();
}

// ── Products ──────────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[]> {
  const rows = await handle(await fetch("/api/products", { cache: "no-store" }));
  return rows.map(normalizeProduct);
}

export async function createProductApi(payload: Partial<Product>): Promise<Product> {
  const row = await handle(
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        name: payload.name,
        brand: payload.brand,
        price: payload.price,
        original_price: payload.originalPrice ?? null,
        category: payload.category,
        image: payload.image ?? null,
        badge: payload.badge ?? null,
        stock: payload.stock ?? 0,
        description: payload.description ?? "",
      }),
    })
  );
  return normalizeProduct(row);
}

export async function updateProductApi(id: number, payload: Partial<Product>): Promise<Product> {
  const body: Record<string, unknown> = {};
  if (payload.name !== undefined) body.name = payload.name;
  if (payload.brand !== undefined) body.brand = payload.brand;
  if (payload.price !== undefined) body.price = payload.price;
  if (payload.originalPrice !== undefined) body.original_price = payload.originalPrice;
  if (payload.category !== undefined) body.category = payload.category;
  if (payload.image !== undefined) body.image = payload.image;
  if (payload.badge !== undefined) body.badge = payload.badge;
  if (payload.stock !== undefined) body.stock = payload.stock;
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.active !== undefined) body.active = payload.active;

  const row = await handle(
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    })
  );
  return normalizeProduct(row);
}

export async function deleteProductApi(id: number): Promise<void> {
  await handle(await fetch(`/api/products/${id}`, { method: "DELETE", headers: authHeaders() }));
}

// ── Orders ────────────────────────────────────────────────────
export async function fetchOrders(): Promise<Order[]> {
  const rows = await handle(await fetch("/api/orders", { cache: "no-store", headers: authHeaders() }));
  return rows.map(normalizeOrder);
}

export async function fetchOrderByReference(reference: string): Promise<Order | null> {
  const res = await fetch(`/api/orders?reference=${encodeURIComponent(reference)}`, { cache: "no-store", headers: authHeaders() });
  if (res.status === 404) return null;
  const row = await handle(res);
  return normalizeOrder(row);
}

export async function updateOrderStatusApi(id: number, status: string): Promise<Order> {
  const row = await handle(
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ status }),
    })
  );
  return normalizeOrder(row);
}

// ── Customers ─────────────────────────────────────────────────
export async function fetchCustomers(): Promise<Customer[]> {
  const rows = await handle(await fetch("/api/customers", {
    cache: "no-store",
    headers: authHeaders(),
  }));
  return rows.map(normalizeCustomer);
}

export interface DiscountRow {
  id: number;
  code: string;
  type: string;
  value: string;
  minOrder: string | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
}

export interface ShippingZoneRow {
  id: number;
  name: string;
  regions: string;
  baseRate: string;
  freeThreshold: string | null;
  estimatedDays: string | null;
  active: boolean;
}

export async function fetchDiscountsApi(): Promise<DiscountRow[]> {
  return handle(await fetch("/api/admin/discounts", {
    cache: "no-store",
    headers: authHeaders(),
  }));
}

export async function createDiscountApi(data: any): Promise<DiscountRow> {
  return handle(await fetch("/api/admin/discounts", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  }));
}

export async function updateDiscountApi(id: number, data: any): Promise<DiscountRow> {
  return handle(await fetch(`/api/admin/discounts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  }));
}

export async function deleteDiscountApi(id: number): Promise<void> {
  await fetch(`/api/admin/discounts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function fetchShippingZonesApi(): Promise<ShippingZoneRow[]> {
  return handle(await fetch("/api/admin/shipping", {
    cache: "no-store",
    headers: authHeaders(),
  }));
}

export async function createShippingZoneApi(data: any): Promise<ShippingZoneRow> {
  return handle(await fetch("/api/admin/shipping", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  }));
}

export async function fetchSettingsApi(): Promise<{ key: string; value: string }[]> {
  return handle(await fetch("/api/admin/settings", {
    headers: authHeaders(),
  }));
}

export async function upsertSettingApi(key: string, value: string): Promise<any> {
  return handle(await fetch("/api/admin/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ key, value }),
  }));
}

export async function fetchNotificationSettingsApi(): Promise<{ id: number; channel: string; event: string; enabled: boolean }[]> {
  return handle(await fetch("/api/admin/notifications", {
    headers: authHeaders(),
  }));
}

export async function upsertNotificationSettingApi(channel: string, event: string, enabled: boolean): Promise<any> {
  return handle(await fetch("/api/admin/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ channel, event, enabled }),
  }));
}
