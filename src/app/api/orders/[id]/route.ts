/**
 * PATCH /api/orders/[id]  → update order status
 */
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const [order] = await sql`
      UPDATE orders SET status = ${status}, updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;
    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
