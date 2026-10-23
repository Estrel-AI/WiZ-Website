import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  buildOAuthAuthorizationUrl,
  createOAuthStateToken,
  getOAuthStateCookieName,
  isOAuthProvider,
} from "@/src/lib/oauth";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: rawProvider } = await params;

  if (!isOAuthProvider(rawProvider)) {
    return NextResponse.json({ success: false, message: "Unsupported OAuth provider." }, { status: 404 });
  }

  try {
    const intent = request.nextUrl.searchParams.get("intent") === "login" ? "login" : "signup";
    const accountTypeParam = request.nextUrl.searchParams.get("account_type");
    const accountType =
      accountTypeParam === "business" || accountTypeParam === "developer" ? accountTypeParam : undefined;
    const planIdParam = Number(request.nextUrl.searchParams.get("plan_id"));
    const planNameParam = request.nextUrl.searchParams.get("plan_name")?.trim() || undefined;
    const cookieStore = await cookies();
    const { state, token } = createOAuthStateToken(
      rawProvider,
      intent,
      accountType,
      Number.isInteger(planIdParam) && planIdParam > 0 ? planIdParam : undefined,
      planNameParam,
    );
    const authorizationUrl = buildOAuthAuthorizationUrl(rawProvider, state);

    cookieStore.set(getOAuthStateCookieName(rawProvider), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    });

    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start OAuth authentication.";
    const url = new URL("/login", request.url);
    url.searchParams.set("oauth_error", message);
    return NextResponse.redirect(url);
  }
}
