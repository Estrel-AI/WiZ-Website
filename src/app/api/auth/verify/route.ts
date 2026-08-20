import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyAuthToken } from "@/src/lib/website-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
  }

  const payload = verifyAuthToken(token);

  if (!payload) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({ success: true, user: payload });
}
