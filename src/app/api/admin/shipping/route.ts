import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchShippingZones, createShippingZone, updateShippingZone, deleteShippingZone } from "@/server/admin";
import { requireRole } from "@/lib/auth-utils";

const schema = z.object({
  name: z.string().min(1),
  regions: z.array(z.string()),
  baseRate: z.coerce.number().min(0),
  freeThreshold: z.coerce.number().positive().optional().nullable(),
  estimatedDays: z.string().optional(),
  active: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "manage_settings");
  if (auth instanceof NextResponse) return auth;

  try {
    const data = await fetchShippingZones();
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
    const parsed = schema.parse(body);
    const data = await createShippingZone({
      ...parsed,
      regions: JSON.stringify(parsed.regions),
      baseRate: String(parsed.baseRate),
      freeThreshold: parsed.freeThreshold ? String(parsed.freeThreshold) : null,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues }, { status: 400 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
