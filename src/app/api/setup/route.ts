/**
 * GET /api/setup?secret=YOUR_JWT_SECRET
 * Run ONCE to create all Neon database tables.
 * Protect with the JWT_SECRET env var.
 */
import { NextRequest, NextResponse } from "next/server";
import { createTables } from "@/lib/db";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await createTables();
    return NextResponse.json({ success: true, message: "All tables created" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
