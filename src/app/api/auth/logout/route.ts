import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/src/lib/website-auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  clearAuthCookie(response);
  return response;
}
