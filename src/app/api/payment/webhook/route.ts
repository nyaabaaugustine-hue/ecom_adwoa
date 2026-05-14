/**
 * POST /api/payment/webhook
 * Paystack webhook for server-side payment confirmation.
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const sql = getDb();
    const reference = event.data.reference;
    await sql`
      UPDATE orders
      SET payment_status = 'paid',
          status         = 'processing',
          paystack_ref   = ${reference},
          updated_at     = NOW()
      WHERE reference = ${reference}
        AND payment_status != 'paid'
    `;
  }

  return NextResponse.json({ received: true });
}
