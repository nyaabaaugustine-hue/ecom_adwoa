import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchDiscountById, updateDiscount, deleteDiscount } from "@/server/admin";
import { requireRole } from "@/lib/auth-utils";

const updateSchema = z.object({
  code: z.string().min(1).toUpperCase().optional(),
  type: z.enum(["percentage", "fixed"]).optional(),
  value: z.coerce.number().positive().optional(),
  minOrder: z.coerce.number().positive().optional().nullable(),
  maxUses: z.coerce.number().int().positive().optional().nullable(),
  active: z.boolean().optional(),
  expiresAt: z.string().optional().nullable(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, "manage_settings");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const parsed = updateSchema.parse(body);
    const data = await updateDiscount(Number(params.id), {
      ...parsed,
      value: parsed.value ? String(parsed.value) : undefined,
      minOrder: parsed.minOrder ? String(parsed.minOrder) : null,
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
    });
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues }, { status: 400 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, "manage_settings");
  if (auth instanceof NextResponse) return auth;

  try {
    await deleteDiscount(Number(params.id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, "view_reports");
  if (auth instanceof NextResponse) return auth;

  try {
    const data = await fetchDiscountById(Number(params.id));
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
