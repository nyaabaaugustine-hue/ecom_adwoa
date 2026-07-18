import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateOrderStatus } from "@/server/ecommerce";
import type { OrderStatus } from "@/server/ecommerce";
import { requireRole } from "@/lib/auth-utils";

const orderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "returned"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireRole(req, "manage_orders");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const parsed = orderStatusSchema.parse(body);
    const order = await updateOrderStatus(params.id, parsed.status as OrderStatus);
    return NextResponse.json(order);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
