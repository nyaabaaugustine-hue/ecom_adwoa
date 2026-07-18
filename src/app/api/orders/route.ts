import { NextRequest, NextResponse } from "next/server";
import { fetchOrders } from "@/server/ecommerce";
import { requireRole } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference") ?? undefined;

  // Public: a guest looking up their own order by its unique reference
  // (e.g. the track-order page). No listing is exposed this way.
  if (reference) {
    try {
      const order = await fetchOrders(reference);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  // Everything else (the full order list) is admin/manager/staff only.
  const auth = requireRole(req, "manage_orders");
  if (auth instanceof NextResponse) return auth;

  try {
    const rows = await fetchOrders();
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
