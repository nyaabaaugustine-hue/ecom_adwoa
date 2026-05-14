/**
 * GET /api/payment/verify?reference=ADWOA-xxx
 * Called by Paystack redirect after payment.
 * Verifies the transaction and marks the order paid.
 */
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPayment } from "@/lib/paystack";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  if (!reference) {
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
            status = 'processing',
            paystack_ref = ${reference},
            updated_at = NOW()
        WHERE reference = ${reference}
      `;
      return NextResponse.redirect(
        new URL(`/checkout/success?ref=${reference}`, req.url)
      );
    } else {
      await sql`
        UPDATE orders
        SET payment_status = 'failed', updated_at = NOW()
        WHERE reference = ${reference}
      `;
      return NextResponse.redirect(
        new URL(`/checkout?error=payment_failed&ref=${reference}`, req.url)
      );
    }
  } catch (err: any) {
    console.error("[payment/verify]", err);
    return NextResponse.redirect(
      new URL("/checkout?error=verification_failed", req.url)
    );
  }
}
