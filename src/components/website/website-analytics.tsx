"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: Record<string, unknown>) => void;
    trackEvent?: (eventName: string, params?: Record<string, unknown>) => void;
    onOtpSent?: () => void;
    onOtpFailed?: (errorCode: string, errorMessage: string) => void;
    onSignupComplete?: (method: string, accountType: string) => void;
  }
}

export default function WebsiteAnalytics() {
  useEffect(() => {
    let otpAttemptCount = 0;

    window.trackEvent = (eventName, params = {}) => {
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", eventName, {
          debug_mode: true,
          ...params,
        });
      }
    };

    window.onOtpSent = () => {
      window.trackEvent?.("otp_sent", {
        method: "email",
      });
    };

    window.onOtpFailed = (errorCode, errorMessage) => {
      otpAttemptCount += 1;
      window.trackEvent?.("otp_failed", {
        error_code: errorCode,
        error_message: errorMessage,
        attempt_number: otpAttemptCount,
      });
    };

    window.onSignupComplete = (method, accountType) => {
      window.trackEvent?.("signup_complete", {
        method,
        account_type: accountType,
      });
    };

    const handleHeroCtaClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest(".hero-cta") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!button) {
        return;
      }

      const buttonText = button.textContent?.trim() ?? "";
      const href = button instanceof HTMLAnchorElement
        ? button.getAttribute("href")
        : null;

      window.trackEvent?.("hero_cta_click", {
        button_location: "homepage_hero",
        button_text: buttonText,
        link_url: href || window.location.pathname,
      });
    };

    document.addEventListener("click", handleHeroCtaClick);

    return () => {
      document.removeEventListener("click", handleHeroCtaClick);
    };
  }, []);

  useEffect(() => {
    const isBlogDetailPage = /^\/blog\/[^/]+\/?$/.test(window.location.pathname);
    if (!isBlogDetailPage) {
      return;
    }

    let startTime = Date.now();
    let totalActiveTime = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        totalActiveTime += Date.now() - startTime;
      } else {
        startTime = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      if (!document.hidden) {
        totalActiveTime += Date.now() - startTime;
      }

      const activeSeconds = Math.floor(totalActiveTime / 1000);
      if (activeSeconds >= 30) {
        window.trackEvent?.("article_read", {
          article_slug: window.location.pathname,
          active_time_seconds: activeSeconds,
          article_name: document.title,
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
}
