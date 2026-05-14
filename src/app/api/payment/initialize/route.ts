/**
 * POST /api/payment/initialize
 * Body: { email, name, phone, items, total }
 * Creates an order in Neon and returns a Paystack authorization URL.
 */
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { initializePayment, generateReference } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, items, total } = body;

    if (!email || !items?.length || !total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const reference = generateReference();

    // Upsert customer
    await sql`
      INSERT INTO customers (name, email, phone)
      VALUES (${name}, ${email}, ${phone})
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone
    `;

    const [customer] = await sql`SELECT id FROM customers WHERE email = ${email}`;

    // Create pending order
    await sql`
      INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status)
      VALUES (
        ${reference},
        ${customer.id},
        ${name},
        ${email},
        ${phone},
        ${JSON.stringify(items)},
        ${total},
        ${total},
        'pending',
        'unpaid'
      )
    `;

    // Initialize with Paystack
    const paystack = await initializePayment({
      email,
      amount: total,
      reference,
      metadata: { order_reference: reference, customer_name: name },
    });

    return NextResponse.json({
      authorization_url: paystack.data.authorization_url,
      reference,
    });
  } catch (err: any) {
    console.error("[payment/initialize]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
