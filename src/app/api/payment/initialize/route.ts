/**
 * POST /api/payment/initialize
 * Body: { email, name, phone, address, items, total }
 *
 * Creates a pending order in Neon and returns a unique reference.
 * The client-side Paystack popup uses this reference directly.
 * Server-side Paystack initialisation is NOT needed for the popup flow.
 */
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { generateReference } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, address, items, total } = body;

    if (!email || !items?.length || !total) {
      return NextResponse.json(
        { error: "Missing required fields (email, items, total)" },
        { status: 400 }
      );
    }

    const reference = generateReference();

    // Upsert customer
    await sql`
      INSERT INTO customers (name, email, phone, address)
      VALUES (${name ?? ""}, ${email}, ${phone ?? ""}, ${address ?? ""})
      ON CONFLICT (email) DO UPDATE
        SET name    = EXCLUDED.name,
            phone   = EXCLUDED.phone,
            address = COALESCE(EXCLUDED.address, customers.address)
    `;

    const [customer] = await sql`
      SELECT id FROM customers WHERE email = ${email}
    `;

    // Create pending order
    await sql`
      INSERT INTO orders (
        reference, customer_id, customer_name, customer_email,
        customer_phone, items, subtotal, total, status, payment_status
      ) VALUES (
        ${reference},
        ${customer.id},
        ${name ?? ""},
        ${email},
        ${phone ?? ""},
        ${JSON.stringify(items)},
        ${total},
        ${total},
        'pending',
        'unpaid'
      )
    `;

    return NextResponse.json({ reference });
  } catch (err: any) {
    console.error("[payment/initialize]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
