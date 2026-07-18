import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchDiscounts, createDiscount } from "@/server/admin";
import { requireRole } from "@/lib/auth-utils";

const createSchema = z.object({
  code: z.string().min(1).toUpperCase(),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive(),
  minOrder: z.coerce.number().positive().optional().nullable(),
  maxUses: z.coerce.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "view_reports");
  if (auth instanceof NextResponse) return auth;

  try {
    const data = await fetchDiscounts();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "manage_settings");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const parsed = createSchema.parse(body);
    const data = await createDiscount({
      ...parsed,
      value: String(parsed.value),
      minOrder: parsed.minOrder ? String(parsed.minOrder) : null,
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues }, { status: 400 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
