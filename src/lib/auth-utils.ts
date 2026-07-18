import { NextResponse } from "next/server";
import { verifyToken, hasPermission, type AuthUser, type UserRole } from "./auth";

export function getUserFromRequest(request: Request): AuthUser | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  return verifyToken(token);
}

export function requireAuth(request: Request): AuthUser | NextResponse {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  return user;
}

export function requireRole(
  request: Request,
  permission: string
): AuthUser | NextResponse {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  if (!hasPermission(user.role as UserRole, permission)) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }
  return user;
}
