import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { AdminSession } from "@/src/types/admin-cms";

export const ADMIN_SESSION_COOKIE = "wiiz_admin_session";

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!session) {
    return null;
  }

  return {
    email: session,
    role: "super-admin",
  };
}

export async function isAdminAuthenticated() {
  const session = await getAdminSession();
  return Boolean(session);
}

export function shouldUseSecureCookies(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();

  if (forwardedProto) {
    return forwardedProto === "https";
  }

  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return process.env.NODE_ENV === "production";
  }
}

export function applyAdminSession(response: NextResponse, email: string, secure: boolean) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: email,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export function clearAdminSession(response: NextResponse, secure: boolean) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    expires: new Date(0),
  });
}
