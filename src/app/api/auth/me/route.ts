import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";

// Used to restore a logged-in session on page load (e.g. after the
// post-checkout redirect into the customer dashboard) from the token
// already stored client-side.
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({ user: auth });
}
