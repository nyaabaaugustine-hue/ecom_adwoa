import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchStoreSettings, upsertStoreSetting } from "@/server/admin";
import { requireRole } from "@/lib/auth-utils";

const schema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "manage_settings");
  if (auth instanceof NextResponse) return auth;

  try {
    const data = await fetchStoreSettings();
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
    const data = await upsertStoreSetting(parsed.key, parsed.value);
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues }, { status: 400 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
