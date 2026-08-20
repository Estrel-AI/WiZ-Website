import { NextResponse } from "next/server";
import { UTILITY_API_BASE_URL, buildPublicApiUrl } from "@/src/config/public-env";
import { applyAdminSession, shouldUseSecureCookies } from "@/src/lib/admin-auth";

export async function POST(request: Request) {
  const secureCookies = shouldUseSecureCookies(request);
  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim();
  const password = body.password;

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 },
    );
  }

  try {
    const upstreamResponse = await fetch(
      buildPublicApiUrl(UTILITY_API_BASE_URL, "/super-admin/login"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        cache: "no-store",
      },
    );

    const payload = (await upstreamResponse.json().catch(() => null)) as
      | {
          status?: string;
          message?: string;
          data?: {
            username?: string;
            email?: string;
            role?: string;
            token?: string;
          };
        }
      | null;

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        { message: payload?.message ?? "Invalid admin credentials." },
        { status: upstreamResponse.status === 401 ? 401 : 502 },
      );
    }

    const adminIdentifier =
      payload?.data?.email ??
      payload?.data?.username ??
      username;

    const response = NextResponse.json({
      status: payload?.status ?? "success",
      message: payload?.message ?? "Login successful",
      data: {
        username: payload?.data?.username ?? username,
        email: payload?.data?.email ?? adminIdentifier,
        role: payload?.data?.role ?? "super-admin",
        token: payload?.data?.token ?? "",
      },
    });

    applyAdminSession(response, adminIdentifier, secureCookies);
    return response;
  } catch {
    return NextResponse.json(
      { message: "Admin login service is unavailable." },
      { status: 502 },
    );
  }
}
