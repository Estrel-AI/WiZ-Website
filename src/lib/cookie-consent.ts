import {
  COOKIE_CONSENT_ANONYMOUS_ID_KEY,
  COOKIE_CONSENT_COOKIE_NAME,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
} from "@/src/lib/constants";
import type {
  CookieConsentCapturePayload,
  CookieConsentDecision,
  CookieConsentRecord,
} from "@/src/types/admin-api";

export {
  COOKIE_CONSENT_ANONYMOUS_ID_KEY,
  COOKIE_CONSENT_COOKIE_NAME,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
};

export type { CookieConsentCapturePayload, CookieConsentDecision, CookieConsentRecord };

export function serializeCookieConsent(record: CookieConsentRecord) {
  return JSON.stringify(record);
}

export function parseCookieConsent(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as CookieConsentRecord;
  } catch {
    return null;
  }
}

export function isCookieConsentDecision(value: string | undefined): value is CookieConsentDecision {
  return value === "accepted" || value === "essential";
}

export function isCookieConsentTimestamp(value: string | undefined) {
  if (!value) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}
