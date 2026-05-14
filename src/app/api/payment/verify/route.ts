/**
 * GET /api/payment/verify?reference=ADWOA-xxx[&popup=true]
 *
 * Two modes:
 *  • popup=true  → called by client-side Paystack popup callback; returns JSON
 *  • default     → called by Paystack redirect; issues HTTP redirect to success/fail page
 *
 * Verifies the transaction with Paystack and marks the order paid in Neon.
 */
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPayment } from "@/lib/paystack";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  const isPopup = req.nextUrl.searchParams.get("popup") === "true";

  if (!reference) {
    if (isPopup) {
      return NextResponse.json({ error: "missing_reference" }, { status: 400 });
    }
    return NextResponse.redirect(
      new URL("/checkout?error=missing_reference", req.url)
    );
  }

  try {
    const result = await verifyPayment(reference);

    if (result.data.status === "success") {
      await sql`
        UPDATE orders
        SET payment_status = 'paid',
            status         = 'processing',
            paystack_ref   = ${reference},
            updated_at     = NOW()
        WHERE reference = ${reference}
      `;

      if (isPopup) {
        return NextResponse.json({ status: "success", reference });
      }
      return NextResponse.redirect(
        new URL(`/checkout/success?ref=${reference}`, req.url)
      );
    } else {
      await sql`
        UPDATE orders
        SET payment_status = 'failed',
            updated_at     = NOW()
        WHERE reference = ${reference}
      `;

      if (isPopup) {
        return NextResponse.json(
          { status: "failed", message: "Payment not successful" },
          { status: 402 }
        );
      }
      return NextResponse.redirect(
        new URL(`/checkout?error=payment_failed&ref=${reference}`, req.url)
      );
    }
  } catch (err: any) {
    console.error("[payment/verify]", err);
    if (isPopup) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.redirect(
      new URL("/checkout?error=verification_failed", req.url)
    );
  }
}
