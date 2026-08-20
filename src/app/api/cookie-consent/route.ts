import { headers } from "next/headers";
import { badRequest, ok, serverError } from "@/src/lib/admin-api";
import {
  COOKIE_CONSENT_VERSION,
  isCookieConsentDecision,
  isCookieConsentTimestamp,
  type CookieConsentCapturePayload,
} from "@/src/lib/cookie-consent";
import { createCookieConsentEvent } from "@/src/lib/cookie-consent-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CookieConsentCapturePayload;

    if (!isCookieConsentDecision(body.decision)) {
      return badRequest("A valid cookie consent decision is required.");
    }

    if (!isCookieConsentTimestamp(body.timestamp)) {
      return badRequest("A valid cookie consent timestamp is required.");
    }

    const version = body.version?.trim() || COOKIE_CONSENT_VERSION;
    const requestHeaders = await headers();
    const anonymousId = requestHeaders.get("x-anonymous-consent-id")?.trim() || crypto.randomUUID();
    const forwardedFor = requestHeaders.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip")?.trim() || null;
    const userAgent = requestHeaders.get("user-agent")?.trim() || null;
    const pagePath = body.path?.trim() || null;

    await createCookieConsentEvent({
      anonymousId,
      decision: body.decision,
      version,
      timestamp: body.timestamp,
      pagePath,
      ipAddress,
      userAgent,
    });

    return ok("Cookie consent captured successfully.", {
      decision: body.decision,
      version,
      timestamp: body.timestamp,
      anonymousId,
    });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to capture cookie consent.");
  }
}
