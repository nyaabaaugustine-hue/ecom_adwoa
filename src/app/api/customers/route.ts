import { NextRequest, NextResponse } from "next/server";
import { fetchCustomers } from "@/server/ecommerce";
import { requireRole } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "manage_customers");
  if (auth instanceof NextResponse) return auth;

  try {
    const rows = await fetchCustomers();
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
