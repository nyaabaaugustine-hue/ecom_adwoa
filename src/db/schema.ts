import {
  pgTable,
  serial,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    brand: text("brand").notNull().default("Adwoa's Collection"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
    rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
    reviews: integer("reviews").default(0),
    category: text("category").notNull(),
    image: text("image"),
    badge: text("badge"),
    stock: integer("stock").default(0),
    description: text("description"),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_products_category").on(table.category),
    index("idx_products_active").on(table.active),
  ]
);

export const customers = pgTable(
  "customers",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    address: text("address"),
    role: text("role").default("customer"),
    passwordHash: text("password_hash"),
    avatar: text("avatar"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("idx_customers_email").on(table.email)]
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    customerId: integer("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    customerName: text("customer_name"),
    customerEmail: text("customer_email"),
    customerPhone: text("customer_phone"),
    items: jsonb("items").notNull(),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
    total: numeric("total", { precision: 10, scale: 2 }).notNull(),
    status: text("status").default("pending"),
    paymentStatus: text("payment_status").default("unpaid"),
    paymentMethod: text("payment_method").default("paystack"),
    paystackRef: text("paystack_ref"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_orders_customer_id").on(table.customerId),
    index("idx_orders_status").on(table.status),
    index("idx_orders_payment_status").on(table.paymentStatus),
    index("idx_orders_created_at").on(table.createdAt),
    uniqueIndex("idx_orders_reference").on(table.reference),
  ]
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id").references(() => orders.id, {
      onDelete: "cascade",
    }),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => [
    index("idx_order_items_order_id").on(table.orderId),
    index("idx_order_items_product_id").on(table.productId),
  ]
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    tableName: text("table_name").notNull(),
    recordId: integer("record_id"),
    action: text("action").notNull(),
    oldData: jsonb("old_data"),
    newData: jsonb("new_data"),
    changedBy: text("changed_by").default("system"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_audit_log_table").on(table.tableName, table.recordId),
    index("idx_audit_log_created_at").on(table.createdAt),
  ]
);

export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const shippingZones = pgTable("shipping_zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  regions: jsonb("regions").notNull().default("[]"),
  baseRate: numeric("base_rate", { precision: 10, scale: 2 }).notNull().default("0"),
  freeThreshold: numeric("free_threshold", { precision: 10, scale: 2 }),
  estimatedDays: text("estimated_days"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull().default("percentage"),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  minOrder: numeric("min_order", { precision: 10, scale: 2 }),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  startsAt: timestamp("starts_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const notificationSettings = pgTable("notification_settings", {
  id: serial("id").primaryKey(),
  channel: text("channel").notNull().default("email"),
  event: text("event").notNull(),
  enabled: boolean("enabled").default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
