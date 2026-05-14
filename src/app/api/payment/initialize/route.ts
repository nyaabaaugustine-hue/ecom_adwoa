/**
 * POST /api/payment/initialize
 * Body: { email, name, phone, address, items, total }
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateReference } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
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

    const customerRows = await sql`
      SELECT id FROM customers WHERE email = ${email}
    `;
    const customer = customerRows[0];

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
