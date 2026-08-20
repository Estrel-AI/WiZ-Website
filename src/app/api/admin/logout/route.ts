import { NextResponse } from "next/server";
import { clearAdminSession, shouldUseSecureCookies } from "@/src/lib/admin-auth";

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true });
  clearAdminSession(response, shouldUseSecureCookies(request));
  return response;
}
