import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/api/products",
  "/api/auth/login",
  "/api/payment/initialize",
  "/api/payment/verify",
  "/api/payment/webhook",
  "/api/setup",
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Allow public paths without auth
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Guest order tracking: GET /api/orders?reference=XXX must stay public
  // (customers who just checked out are never logged in). Listing every
  // order (no reference param) still requires auth below.
  if (pathname === "/api/orders" && request.method === "GET" && searchParams.get("reference")) {
    return NextResponse.next();
  }

  // Only protect /api/* routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Edge middleware cannot verify JWT (no Node.js crypto).
  // Route handlers perform full verification via requireAuth()/requireRole().
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
