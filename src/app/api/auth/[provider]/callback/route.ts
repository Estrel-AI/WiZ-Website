import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  getOAuthProfileFromCode,
  getOAuthStateCookieName,
  isOAuthProvider,
  verifyOAuthStateToken,
} from "@/src/lib/oauth";
import { AUTH_API_BASE_URL, buildPublicApiUrl } from "@/src/config/public-env";
import type { UserRegisteredResponse } from "@/src/types/auth";

export const runtime = "nodejs";

function clearCookie(response: NextResponse, name: string) {
  response.cookies.set(name, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

async function checkUserRegistered(email: string) {
  const query = new URLSearchParams({ email }).toString();
  const response = await fetch(buildPublicApiUrl(AUTH_API_BASE_URL, `/user_registered?${query}`), {
    method: "GET",
    cache: "no-store",
  });
  const responseData = (await response.json().catch(() => null)) as UserRegisteredResponse | null;

  if (!response.ok) {
    throw new Error(responseData?.message || "Unable to verify whether this email is already registered.");
  }

  if (responseData?.status === "conflict" || responseData?.data?.status === "conflict") {
    return true;
  }

  return Boolean(
    responseData?.registered ??
      responseData?.exists ??
      responseData?.data?.registered ??
      responseData?.data?.exists,
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: rawProvider } = await params;

  if (!isOAuthProvider(rawProvider)) {
    return NextResponse.json({ success: false, message: "Unsupported OAuth provider." }, { status: 404 });
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const providerError = request.nextUrl.searchParams.get("error");

  if (providerError) {
    return NextResponse.json(
      { success: false, message: `Authentication was cancelled: ${providerError}.` },
      { status: 400 },
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      { success: false, message: "Missing OAuth callback parameters." },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const stateCookieName = getOAuthStateCookieName(rawProvider);
  const signedStateToken = cookieStore.get(stateCookieName)?.value;

  if (!signedStateToken || !verifyOAuthStateToken(signedStateToken, rawProvider, state)) {
    return NextResponse.json(
      { success: false, message: "Your OAuth session is invalid or has expired. Please try again." },
      { status: 400 },
    );
  }

  try {
    const profile = await getOAuthProfileFromCode(rawProvider, code);
    const registerUrl = new URL("/register", request.url);

    if (!profile.email) {
      registerUrl.searchParams.set("oauth_error", `We could not get your ${rawProvider} email address.`);
      const response = NextResponse.json({
        success: true,
        redirect_to: `${registerUrl.pathname}${registerUrl.search}`,
      });
      clearCookie(response, stateCookieName);
      return response;
    }

    const email = profile.email.trim().toLowerCase();
    const isRegistered = await checkUserRegistered(email);

    if (isRegistered) {
      registerUrl.searchParams.set("oauth_error", "This email is already registered. Please log in instead.");
    } else {
      registerUrl.searchParams.set("oauth_step", "details");
      registerUrl.searchParams.set("oauth_email", email);
      registerUrl.searchParams.set("oauth_first_name", profile.firstName);
      registerUrl.searchParams.set("oauth_last_name", profile.lastName);
      registerUrl.searchParams.set("oauth_username", email);
      registerUrl.searchParams.set("oauth_verified", "1");
      registerUrl.searchParams.set("oauth_provider", rawProvider);
    }

    const response = NextResponse.json({
      success: true,
      redirect_to: `${registerUrl.pathname}${registerUrl.search}`,
    });
    clearCookie(response, stateCookieName);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to complete OAuth authentication.";

    const registerUrl = new URL("/register", request.url);
    registerUrl.searchParams.set("oauth_error", message);

    return NextResponse.json(
      {
        success: true,
        redirect_to: `${registerUrl.pathname}${registerUrl.search}`,
      },
      { status: 200 },
    );
  }
}
