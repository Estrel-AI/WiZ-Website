import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Website auth API is available.",
    endpoints: [
      "/api/auth/google",
      "/api/auth/github",
      "/api/auth/linkedin",
      "/api/auth/session",
      "/api/auth/current-user",
      "/api/auth/verify",
      "/api/auth/logout",
    ],
  });
}
