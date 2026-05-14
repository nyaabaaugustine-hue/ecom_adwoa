/**
 * GET    /api/orders         → list all orders (admin) or get by reference
 * PATCH  /api/orders/[id]    → update order status
 */
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get("reference");

    if (reference) {
      const [order] = await sql`
        SELECT * FROM orders WHERE reference = ${reference}
      `;
      
      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(order);
    }

    // List all orders
    const rows = await sql`
      SELECT o.*, c.phone AS customer_phone_lookup
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      ORDER BY o.created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
