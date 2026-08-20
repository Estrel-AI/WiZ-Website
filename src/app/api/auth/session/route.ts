import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyAuthToken } from "@/src/lib/website-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { authenticated: false, userId: "", token: "", user: null },
      { status: 401 },
    );
  }

  const payload = verifyAuthToken(token);

  if (!payload) {
    return NextResponse.json(
      { authenticated: false, userId: "", token: "", user: null },
      { status: 401 },
    );
  }

  return NextResponse.json({
    authenticated: true,
    userId: String(payload.id),
    token,
    user: payload,
  });
}
