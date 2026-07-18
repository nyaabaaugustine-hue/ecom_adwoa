import { NextRequest, NextResponse } from "next/server";
import { fetchOrders, fetchOrdersByCustomerId } from "@/server/ecommerce";
import { requireAuth } from "@/lib/auth-utils";
import { hasPermission, type UserRole } from "@/lib/auth";

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

  // Everything else requires a valid session.
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    // Admin/manager/staff see every order (dashboard order management).
    if (hasPermission(auth.role as UserRole, "manage_orders")) {
      const rows = await fetchOrders();
      return NextResponse.json(rows);
    }

    // A logged-in customer only ever sees their own orders — never the
    // full list. auth.id is the customers.id set when the JWT was issued.
    const rows = await fetchOrdersByCustomerId(auth.id);
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
