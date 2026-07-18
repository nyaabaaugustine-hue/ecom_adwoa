import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerCustomerAccount } from "@/lib/auth";

// Public — this completes an account for a customer row that was already
// created by guest checkout (upsertCustomer). It never creates a brand-new
// customer and never overwrites an existing password (see auth.ts).
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);

    const result = await registerCustomerAccount(parsed.email, parsed.password);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ user: result.user, token: result.token });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[auth/register]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
