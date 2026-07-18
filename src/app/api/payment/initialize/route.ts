import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateReference } from "@/lib/paystack";
import { upsertCustomer, fetchCustomerByEmail, createPendingOrder, createCodOrder } from "@/server/ecommerce";

// NOTE: intentionally public — this is the guest checkout endpoint.
// Customers are never logged in when they buy, so requiring a Bearer
// token here would block every single purchase. Do not add requireAuth.

const checkoutSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  method: z.enum(["paystack", "cod"]).default("paystack"),
  items: z.array(z.object({
    product_id: z.number().optional(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
  })).min(1),
  total: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.parse(body);
    const { email, name, phone, address, notes, method, items, total } = parsed;

    const reference = generateReference();

    // Check BEFORE upsert whether this email already has a real account
    // (a password set) — upsertCustomer below will create/refresh the row
    // either way (guest checkout always needs a customer record to attach
    // the order to), but only a first-time buyer should be prompted to
    // create an account after the order goes through.
    const existingCustomer = await fetchCustomerByEmail(email);
    const needsAccount = !existingCustomer?.passwordHash;

    const customer = await upsertCustomer({ name, email, phone, address });

    // Normalize snake_case product_id (from the client cart) to the
    // camelCase productId expected internally, so stock actually
    // decrements when the order is paid / placed.
    const normalizedItems = items.map((i) => ({
      productId: i.product_id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }));

    if (method === "cod") {
      await createCodOrder({
        reference,
        customerId: customer.id,
        name,
        email,
        phone,
        address,
        notes,
        items: normalizedItems,
        subtotal: total,
        total,
      });
      return NextResponse.json({ reference, method: "cod", needsAccount });
    }

    await createPendingOrder({
      reference,
      customerId: customer.id,
      name,
      email,
      phone,
      items: normalizedItems,
      subtotal: total,
      total,
    });

    return NextResponse.json({ reference, method: "paystack", needsAccount });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[payment/initialize]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
