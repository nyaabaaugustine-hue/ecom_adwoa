import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getDb } from "@/db";
import { customers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export type UserRole = "admin" | "manager" | "staff" | "customer";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-change-me-in-production";
const TOKEN_EXPIRY = "24h";

// Pre-hashed passwords for hardcoded users
const ADMIN_USERS: { email: string; passwordHash: string; name: string; role: UserRole }[] = [
  { email: "admin@adwoas.com", passwordHash: bcrypt.hashSync("admin123", 10), name: "Adwoa Mensah", role: "admin" },
  { email: "manager@adwoas.com", passwordHash: bcrypt.hashSync("manager123", 10), name: "Kofi Asante", role: "manager" },
  { email: "staff@adwoas.com", passwordHash: bcrypt.hashSync("staff123", 10), name: "Ama Serwaa", role: "staff" },
  { email: "customer@adwoas.com", passwordHash: bcrypt.hashSync("customer123", 10), name: "Akua Mensah", role: "customer" },
];

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string } | null> {
  // Check hardcoded admin/staff users
  const adminUser = ADMIN_USERS.find(
    (u) => u.email === email
  );
  if (adminUser) {
    const valid = bcrypt.compareSync(password, adminUser.passwordHash);
    if (!valid) return null;
    const user: AuthUser = {
      id: 0,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    };
    const token = generateToken(user);
    return { user, token };
  }

  // Check DB customers
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);
    const customer = rows[0];
    if (!customer) return null;

    if (customer.passwordHash) {
      const valid = await bcrypt.compare(password, customer.passwordHash);
      if (!valid) return null;
    } else {
      return null;
    }

    const user: AuthUser = {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      role: (customer.role as UserRole) || "customer",
    };
    const token = generateToken(user);
    return { user, token };
  } catch {
    return null;
  }
}

/**
 * Completes an account for a customer row that already exists (created
 * during guest checkout via upsertCustomer) but has no password yet.
 * Used by the post-order "fast account creation" flow — never creates a
 * brand-new customer row, and never overwrites an existing password.
 */
export async function registerCustomerAccount(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string } | { error: string; status: number }> {
  const db = getDb();
  const rows = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
  const customer = rows[0];

  if (!customer) {
    return { error: "No order found for this email yet.", status: 404 };
  }
  if (customer.passwordHash) {
    return { error: "An account already exists for this email. Please log in instead.", status: 409 };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const updated = await db
    .update(customers)
    .set({ passwordHash, updatedAt: sql`NOW()` })
    .where(eq(customers.id, customer.id))
    .returning();
  const row = updated[0];

  const user: AuthUser = {
    id: row.id,
    email: row.email,
    name: row.name,
    role: (row.role as UserRole) || "customer",
  };
  const token = generateToken(user);
  return { user, token };
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    "view_dashboard", "manage_products", "manage_orders", "manage_customers",
    "manage_settings", "view_analytics", "manage_users", "view_reports",
  ],
  manager: [
    "view_dashboard", "manage_products", "manage_orders", "view_analytics", "view_reports",
  ],
  staff: ["view_dashboard", "manage_orders"],
  customer: ["view_dashboard", "view_orders"],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getRolePermissions(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
