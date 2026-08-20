const normalizeBaseUrl = (value: string | undefined, fallback: string) =>
  (value ?? fallback).replace(/\/+$/, "");

const isLocalFrontend =
  (process.env.NEXT_PUBLIC_FRONTEND_BASE_URL ?? "").includes("localhost") ||
  (process.env.NEXT_PUBLIC_FRONTEND_BASE_URL ?? "").includes("127.0.0.1");

export const HUB_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_HUB_BASE_URL,
  "https://hub.wiiz.it",
);

export const AUTH_API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL,
  "https://dev.wiiz.it/aiwf",
);

export const AUTH_OAUTH_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_AUTH_OAUTH_BASE_URL,
  "https://test-backend.wiiz.it",
);

export const UTILITY_API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_UTILITY_API_BASE_URL,
  "https://utility.wiiz.it/api",
);

export const PAYMENTS_API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_PAYMENTS_API_BASE_URL,
  "https://payments-dev.wiiz.it",
);

export const FRONTEND_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
  "http://localhost:3000",
);

export const RECAPTCHA_SITE_KEY =
  (isLocalFrontend
    ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_LOCAL
    : undefined) ??
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ??
  "6Lf-GkgsAAAAAAyYJGIQf2XJLYoaw3A1a3utYFka";

export const STARTER_MONTHLY_PLAN_CODE =
  process.env.NEXT_PUBLIC_PLAN_CODE_STARTER_MONTHLY ?? "WIIZ_MONTHLY_STARTER_PLAN_V2_DEV";

export const STARTER_ANNUAL_PLAN_CODE =
  process.env.NEXT_PUBLIC_PLAN_CODE_STARTER_ANNUAL ?? "WIIZ_ANNUAL_STARTER_PLAN_V2_DEV";

export const FREE_TRIAL_PLAN_CODE =
  process.env.NEXT_PUBLIC_PLAN_CODE_FREE_TRIAL ?? "WIIZ_FREE_PLAN_V2_DEV";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

export const BUSINESS_ENTRY_MONTHLY_PLAN_CODE =
  process.env.NEXT_PUBLIC_PLAN_CODE_BUSINESS_ENTRY_MONTHLY ??
  "WIIZ_MONTHLY_BUSINESS_ENTRY_PLAN_V2_DEV";

export const BUSINESS_ENTRY_ANNUAL_PLAN_CODE =
  process.env.NEXT_PUBLIC_PLAN_CODE_BUSINESS_ENTRY_ANNUAL ??
  "WIIZ_ANNUAL_BUSINESS_ENTRY_PLAN_V2_DEV";

export const BUSINESS_STANDARD_MONTHLY_PLAN_CODE =
  process.env.NEXT_PUBLIC_PLAN_CODE_BUSINESS_STANDARD_MONTHLY ??
  "WIIZ_MONTHLY_BUSINESS_STANDARD_PLAN_V2_DEV";

export const BUSINESS_STANDARD_ANNUAL_PLAN_CODE =
  process.env.NEXT_PUBLIC_PLAN_CODE_BUSINESS_STANDARD_ANNUAL ??
  "WIIZ_ANNUAL_BUSINESS_STANDARD_PLAN_V2_DEV";

export const ENTERPRISE_ANNUAL_PLAN_CODE =
  process.env.NEXT_PUBLIC_PLAN_CODE_ENTERPRISE_ANNUAL ??
  "ENTERPRISE_ANNUAL_BUSINESS_PLAN_V2_DEV";

export const ADDON_PLAN_CODES = [
  process.env.NEXT_PUBLIC_PLAN_CODE_ADDON_1000 ?? "WIIZ_1000RUNS_ADDON_TEST",
  process.env.NEXT_PUBLIC_PLAN_CODE_ADDON_5000 ?? "WIIZ_5000RUNS_ADDON_TEST",
  process.env.NEXT_PUBLIC_PLAN_CODE_ADDON_10000 ?? "WIIZ_10000RUNS_ADDON_TEST",
] as const;

export const buildPublicApiUrl = (baseUrl: string, path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
