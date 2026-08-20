import type { ApiResponse, CookieConsentCapturePayload } from "@/src/types/admin-api";

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

export async function captureCookieConsent(
  payload: CookieConsentCapturePayload,
  anonymousConsentId: string,
) {
  const response = await fetch("/api/cookie-consent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-anonymous-consent-id": anonymousConsentId,
    },
    body: JSON.stringify(payload),
  });

  const responseData = await parseJsonResponse<ApiResponse<CookieConsentCapturePayload & { anonymousId: string }>>(response);

  if (!response.ok) {
    throw new Error(responseData?.message || "Unable to capture cookie consent.");
  }

  return responseData;
}
