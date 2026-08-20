"use client";

import { useEffect, useState } from "react";
import { type PolicyKey } from "@/src/components/website/policy-content";
import {
  COOKIE_CONSENT_COOKIE_NAME,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  parseCookieConsent,
  type CookieConsentDecision,
  type CookieConsentRecord,
  serializeCookieConsent,
} from "@/src/lib/cookie-consent";

function readStoredConsent() {
  return parseCookieConsent(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
}

function writeConsentCookie(value: string) {
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
}

export default function CookieConsentBanner({
  openPolicy,
}: {
  openPolicy: (key: PolicyKey) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const consent = readStoredConsent();
    const hasCurrentConsent = consent?.version === COOKIE_CONSENT_VERSION;
    setVisible(!hasCurrentConsent);
  }, []);

  async function captureDecision(decision: CookieConsentDecision) {
    const record: CookieConsentRecord = {
      decision,
      version: COOKIE_CONSENT_VERSION,
      timestamp: new Date().toISOString(),
    };
    const serialized = serializeCookieConsent(record);

    setSubmitting(true);

    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, serialized);
      writeConsentCookie(serialized);
    } finally {
      setSubmitting(false);
      setVisible(false);
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[110] px-4 pb-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-secondary/45 bg-[linear-gradient(140deg,rgba(24,13,23,0.98)_0%,rgba(37,18,33,0.98)_55%,rgba(58,22,46,0.98)_100%)] p-5 text-white shadow-[0_34px_90px_rgba(0,0,0,0.5),0_0_0_1px_rgba(216,122,170,0.15)] backdrop-blur xl:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-secondary">
              Cookie Preferences
            </p>
            <h2 className="mt-2 text-lg font-semibold md:text-xl">
              We use cookies for essential site operation, preferences, and consent tracking.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 md:text-[15px]">
              You can accept all cookies we use on this site, or continue with essential cookies only.
              Your choice is recorded with the current policy version.
            </p>
            <button
              type="button"
              onClick={() => openPolicy("cookies")}
              className="mt-3 text-sm font-medium text-secondary transition hover:text-white"
            >
              Review Cookie Policy
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => captureDecision("essential")}
              disabled={submitting}
              className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => captureDecision("accepted")}
              disabled={submitting}
              className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-gradient-to-r from-tertiary to-quaternary px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Accept Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
