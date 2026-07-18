import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCustomerAccount } from "@/lib/auth";

// Public — pre-checkout account creation. Unlike /api/auth/register (which
// only completes an existing guest-checkout row after an order), this
// creates a brand-new customer account before any order exists. Required
// now that checkout is gated behind having an account.
const signupSchema = z.object({
  name: z.string().min(1, "Please enter your full name"),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.parse(body);

    const result = await createCustomerAccount(
      parsed.name,
      parsed.email,
      parsed.password,
      parsed.phone
    );

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // Intentionally NOT logging the user in here — the account-creation
    // flow requires the buyer to explicitly log in with their new
    // credentials afterwards (see SignupModal / page.tsx).
    return NextResponse.json({ user: result.user });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[auth/signup]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
