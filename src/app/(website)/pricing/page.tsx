"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { X, Zap } from "lucide-react";
import Link from "next/link";
import {
  ADDON_PLAN_CODES,
  BUSINESS_ENTRY_ANNUAL_PLAN_CODE,
  BUSINESS_ENTRY_MONTHLY_PLAN_CODE,
  ENTERPRISE_ANNUAL_PLAN_CODE,
  BUSINESS_STANDARD_ANNUAL_PLAN_CODE,
  BUSINESS_STANDARD_MONTHLY_PLAN_CODE,
  FREE_TRIAL_PLAN_CODE,
  PAYMENTS_API_BASE_URL,
  RECAPTCHA_SITE_KEY,
  STARTER_ANNUAL_PLAN_CODE,
  STARTER_MONTHLY_PLAN_CODE,
  buildPublicApiUrl,
} from "@/src/config/public-env";
import {
  AUTH_USER_KEY,
  AUTH_TOKEN_KEY,
  HUB_LOGIN_URL,
  persistWebsiteLogin,
} from "@/src/features/auth/website-auth"; 
import { requestPasswordReset, submitSignin } from "@/src/services/website-auth-service";
import type { ApiResponse, ListData, PlanRow } from "@/src/types/admin-api";
import WebsiteCtaButton from "@/src/components/website/website-cta-button";

const API_URL = buildPublicApiUrl(PAYMENTS_API_BASE_URL, "/plans/getSubscriptionPlans");
const PLAN_CONTENT_API_URL = "/api/plans";
type BillingPeriod = "monthly" | "annually";

type LoginForm = {
  username: string;
  password: string;
};

type ModalView = "login" | "reset" | "login-success";

type CheckoutTarget =
  | {
    type: "plan";
    code: string;
  }
  | {
    type: "addon";
    code: string;
  };

interface ApiPlan {
  plan_code?: string;
  addon_code?: string;
  name: string;
  price: number | string;
  recurring_price?: number | string | null;
  actual_cost?: number | string | null;
  promotional_cost?: number | string | null;
  description?: string;
  interval?: number;
  interval_unit?: string;
  annual_billing?: number | string | null;
}

interface PricingApiResponse {
  code: number;
  plans: ApiPlan[];
  addons_packs: ApiPlan[];
}

interface ExecutionOption {
  id: string;
  label: string;
  monthlyPlanCode: string;
  annualPlanCode: string;
  tokens: string;
}

declare global {
  interface Window {
    grecaptcha?: {
      ready?: (callback: () => void) => void;
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function parseApiPrice(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePlanCode(value: string | null | undefined) {
  return value?.trim().toUpperCase() ?? "";
}

function normalizePlanName(value: string | null | undefined) {
  return value?.trim().toUpperCase().replace(/\s+/g, " ") ?? "";
}

function isCustomAddonPlan(addon: ApiPlan) {
  const name = normalizePlanName(addon.name);
  const code = normalizePlanCode(addon.addon_code ?? addon.plan_code);

  return name.includes("CUSTOM") || code.includes("CUSTOM");
}

function getStandardAddonPackKey(addon: ApiPlan) {
  const normalizedCode = normalizePlanCode(addon.addon_code ?? addon.plan_code);
  const normalizedName = normalizePlanName(addon.name);

  if (
    normalizedCode.includes("10000") ||
    normalizedName.includes("10000") ||
    normalizedName.includes("10,000")
  ) {
    return "10000";
  }

  if (
    normalizedCode.includes("5000") ||
    normalizedName.includes("5000") ||
    normalizedName.includes("5,000")
  ) {
    return "5000";
  }

  if (
    normalizedCode.includes("1000") ||
    normalizedName.includes("1000") ||
    normalizedName.includes("1,000")
  ) {
    return "1000";
  }

  return null;
}

function getStandardAddonPackKeyFromCode(code: string) {
  const normalizedCode = normalizePlanCode(code);

  if (normalizedCode.includes("10000")) {
    return "10000";
  }

  if (normalizedCode.includes("5000")) {
    return "5000";
  }

  if (normalizedCode.includes("1000")) {
    return "1000";
  }

  return null;
}

function getPlanDisplayPrice(plan: ApiPlan | null | undefined) {
  return (
    parseApiPrice(plan?.promotional_cost) ??
    parseApiPrice(plan?.price) ??
    parseApiPrice(plan?.recurring_price)
  );
}

function getPlanComparePrice(plan: ApiPlan | null | undefined) {
  return parseApiPrice(plan?.actual_cost);
}

function extractFeatureItems(value: string | null | undefined) {
  const source = value?.trim() ?? "";

  if (!source) {
    return [];
  }

  const liMatches = Array.from(source.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((match) =>
      decodeHtmlEntities(match[1])
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);

  if (liMatches.length) {
    return liMatches;
  }

  return decodeHtmlEntities(source)
    .replace(/<\/(p|div|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function FeatureList({ items }: { items: string[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <ul className="space-y-1 md:space-y-2 text-sm text-gray-300 flex-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-[#50D890] shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function getStoredWebsiteAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY)?.trim() ?? "";
}

function getStoredWebsiteUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as {
      email?: string;
      username?: string;
      display_name?: string;
      zoho_customer_id?: string;
    };
  } catch {
    return null;
  }
}

function hasStoredWebsiteSession() {
  const authToken = getStoredWebsiteAuthToken();
  const storedUser = getStoredWebsiteUser();

  return Boolean(authToken && storedUser?.email);
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [plansData, setPlansData] = useState<PricingApiResponse | null>(null);
  const [planContentRows, setPlanContentRows] = useState<PlanRow[]>([]);
  const [isWebsiteAuthenticated, setIsWebsiteAuthenticated] = useState(false);
  const [hasClientSession, setHasClientSession] = useState(false);
  const [pricingError, setPricingError] = useState("");
  const [purchaseError, setPurchaseError] = useState("");
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState("");
  const [isLoadingPricing, setIsLoadingPricing] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>("login");
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");
  const [isSendingResetLink, setIsSendingResetLink] = useState(false);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [pendingCheckoutTarget, setPendingCheckoutTarget] = useState<CheckoutTarget | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const recaptchaWidgetIdRef = useRef<number | null>(null);

  const executionOptions: ExecutionOption[] = [
    {
      id: "50k",
      label: "Business Entry",
      monthlyPlanCode: BUSINESS_ENTRY_MONTHLY_PLAN_CODE,
      annualPlanCode: BUSINESS_ENTRY_ANNUAL_PLAN_CODE,
      tokens: "50,000 Tokens (Monthly)",
    },
    {
      id: "100k",
      label: "Business Standard",
      monthlyPlanCode: BUSINESS_STANDARD_MONTHLY_PLAN_CODE,
      annualPlanCode: BUSINESS_STANDARD_ANNUAL_PLAN_CODE,
      tokens: "100,000 Tokens (Monthly)",
    },
  ];

  const [selectedExecution, setSelectedExecution] = useState<ExecutionOption>(
    executionOptions[0],
  );

  const markRecaptchaAsLoaded = () => {
    if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
      setRecaptchaLoaded(true);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const syncAuthState = async () => {
      try {
        const authToken = getStoredWebsiteAuthToken();
        const hasStoredSession = hasStoredWebsiteSession();
        setHasClientSession(hasStoredSession);
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: authToken
            ? {
              Authorization: `Bearer ${authToken}`,
            }
            : undefined,
        });

        if (!isMounted) {
          return;
        }

        setIsWebsiteAuthenticated(response.ok || hasStoredSession);
      } catch {
        if (!isMounted) {
          return;
        }

        const hasStoredSession = hasStoredWebsiteSession();
        setHasClientSession(hasStoredSession);
        setIsWebsiteAuthenticated(hasStoredSession);
      }
    };

    void syncAuthState();

    const handleAuthChange = () => {
      void syncAuthState();
    };

    window.addEventListener("wiiz-auth-changed", handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener("wiiz-auth-changed", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const successKeys = [
      "checkout_status",
      "payment_status",
      "purchase_status",
      "status",
      "success",
    ];
    const successValues = new Set([
      "1",
      "true",
      "success",
      "succeeded",
      "paid",
      "completed",
    ]);

    const isSuccessfulCheckout = successKeys.some((key) => {
      const value = params.get(key)?.trim().toLowerCase();
      return Boolean(value && successValues.has(value));
    });

    if (!isSuccessfulCheckout) {
      return;
    }

    const message =
      params.get("message")?.trim() ||
      params.get("success_message")?.trim() ||
      params.get("response_message")?.trim() ||
      "Purchase successful. Your subscription has been activated.";

    setPurchaseError("");
    setPurchaseSuccessMessage(message);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPricing = async () => {
      try {
        const [pricingResponse, planContentResponse] = await Promise.all([
          fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan_code: "" }),
          }),
          fetch(PLAN_CONTENT_API_URL, {
            method: "GET",
            cache: "no-store",
          }),
        ]);

        const rawResponse = await pricingResponse.text();
        const data = JSON.parse(rawResponse) as PricingApiResponse;

        if (data.code !== 0) {
          throw new Error("Unable to load pricing plans.");
        }

        data.plans.forEach((plan) => {
          plan.plan_code = plan.plan_code?.trim();
          plan.price =
            parseApiPrice(plan.promotional_cost) ??
            parseApiPrice(plan.price) ??
            parseApiPrice(plan.recurring_price) ??
            0;
          plan.recurring_price = parseApiPrice(plan.recurring_price);
          plan.actual_cost = parseApiPrice(plan.actual_cost);
          plan.promotional_cost = parseApiPrice(plan.promotional_cost);
          plan.annual_billing = parseApiPrice(plan.annual_billing);
        });

        data.addons_packs.forEach((addon) => {
          addon.addon_code = addon.addon_code?.trim();
          addon.plan_code = addon.plan_code?.trim();
          addon.price =
            parseApiPrice(addon.promotional_cost) ??
            parseApiPrice(addon.price) ??
            parseApiPrice(addon.recurring_price) ??
            0;
          addon.recurring_price = parseApiPrice(addon.recurring_price);
          addon.actual_cost = parseApiPrice(addon.actual_cost);
          addon.promotional_cost = parseApiPrice(addon.promotional_cost);
        });

        let planContentData: PlanRow[] = [];

        if (planContentResponse.ok) {
          const payload = (await planContentResponse.json()) as ApiResponse<ListData<PlanRow>>;
          planContentData = payload.success && payload.data ? payload.data.result : [];
        }

        if (isMounted) {
          setPlansData(data);
          setPlanContentRows(planContentData);
          setPricingError("");
        }
      } catch (error) {
        if (isMounted) {
          setPricingError(
            error instanceof Error
              ? error.message
              : "Unable to load pricing plans.",
          );
          setPlansData(null);
          setPlanContentRows([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPricing(false);
        }
      }
    };

    void loadPricing();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const scriptId = "google-recaptcha-script";
    let pollTimer: number | null = null;

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    const startPolling = () => {
      if (pollTimer !== null) {
        window.clearInterval(pollTimer);
      }

      pollTimer = window.setInterval(() => {
        if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
          setRecaptchaLoaded(true);

          if (pollTimer !== null) {
            window.clearInterval(pollTimer);
            pollTimer = null;
          }
        }
      }, 300);
    };

    if (existingScript) {
      existingScript.addEventListener("load", markRecaptchaAsLoaded);
      markRecaptchaAsLoaded();
      startPolling();

      return () => {
        existingScript.removeEventListener("load", markRecaptchaAsLoaded);
        if (pollTimer !== null) {
          window.clearInterval(pollTimer);
        }
      };
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", markRecaptchaAsLoaded);
    document.body.appendChild(script);
    startPolling();

    return () => {
      script.removeEventListener("load", markRecaptchaAsLoaded);
      if (pollTimer !== null) {
        window.clearInterval(pollTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (
      !loginModalOpen ||
      modalView !== "login" ||
      !recaptchaLoaded ||
      !recaptchaContainerRef.current ||
      recaptchaWidgetIdRef.current !== null
    ) {
      return;
    }

    const renderRecaptcha = () => {
      if (
        !window.grecaptcha ||
        typeof window.grecaptcha.render !== "function" ||
        !recaptchaContainerRef.current
      ) {
        return;
      }

      recaptchaWidgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token: string) => {
          setRecaptchaToken(token);
          setLoginError("");
        },
        "expired-callback": () => {
          setRecaptchaToken("");
        },
        "error-callback": () => {
          setRecaptchaToken("");
          setLoginError("reCAPTCHA could not be verified. Please try again.");
        },
      });
    };

    if (typeof window.grecaptcha?.ready === "function") {
      window.grecaptcha.ready(renderRecaptcha);
      return;
    }

    renderRecaptcha();
  }, [loginModalOpen, modalView, recaptchaLoaded]);

  useEffect(() => {
    if (!loginModalOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [loginModalOpen]);

  const starterMonthlyPlan = useMemo(
    () =>
      plansData?.plans.find(
        (plan) => normalizePlanCode(plan.plan_code) === normalizePlanCode(STARTER_MONTHLY_PLAN_CODE),
      ) ?? null,
    [plansData],
  );

  const starterAnnualPlan = useMemo(
    () =>
      plansData?.plans.find(
        (plan) => normalizePlanCode(plan.plan_code) === normalizePlanCode(STARTER_ANNUAL_PLAN_CODE),
      ) ?? null,
    [plansData],
  );

  const freeTrialPlan = useMemo(
    () =>
      plansData?.plans.find(
        (plan) => normalizePlanCode(plan.plan_code) === normalizePlanCode(FREE_TRIAL_PLAN_CODE),
      ) ?? null,
    [plansData],
  );

  const starterMonthlyComparePrice = useMemo(
    () => getPlanComparePrice(starterMonthlyPlan),
    [starterMonthlyPlan],
  );

  const starterAnnualComparePrice = useMemo(
    () => getPlanComparePrice(starterAnnualPlan),
    [starterAnnualPlan],
  );

  const addonPlans = useMemo(
    () => {
      const addonCodeSet = new Set(ADDON_PLAN_CODES.map((code) => normalizePlanCode(code)));
      const matchedAddons = new Map<string, ApiPlan>();

      for (const addon of plansData?.addons_packs ?? []) {
        if (isCustomAddonPlan(addon)) {
          continue;
        }

        const normalizedCode = normalizePlanCode(addon.addon_code ?? addon.plan_code);

        if (addonCodeSet.has(normalizedCode)) {
          matchedAddons.set(normalizedCode, addon);
          continue;
        }

        const fallbackKey = getStandardAddonPackKey(addon);

        if (fallbackKey) {
          matchedAddons.set(fallbackKey, addon);
        }
      }

      return ADDON_PLAN_CODES.map((code) => {
        const normalizedCode = normalizePlanCode(code);
        const fallbackKey = getStandardAddonPackKeyFromCode(code);
        return matchedAddons.get(normalizedCode) ?? (fallbackKey ? matchedAddons.get(fallbackKey) : undefined);
      }).filter((addon): addon is ApiPlan => Boolean(addon));
    },
    [plansData],
  );

  const selectedBusinessMonthlyPlan = useMemo(
    () =>
      plansData?.plans.find(
        (plan) => normalizePlanCode(plan.plan_code) === normalizePlanCode(selectedExecution.monthlyPlanCode),
      ) ?? null,
    [plansData, selectedExecution],
  );

  const selectedBusinessAnnualPlan = useMemo(
    () =>
      plansData?.plans.find(
        (plan) => normalizePlanCode(plan.plan_code) === normalizePlanCode(selectedExecution.annualPlanCode),
      ) ?? null,
    [plansData, selectedExecution],
  );

  const selectedBusinessMonthlyComparePrice = useMemo(
    () => getPlanComparePrice(selectedBusinessMonthlyPlan),
    [selectedBusinessMonthlyPlan],
  );

  const selectedBusinessAnnualComparePrice = useMemo(
    () => getPlanComparePrice(selectedBusinessAnnualPlan),
    [selectedBusinessAnnualPlan],
  );

  const planContentByCode = useMemo(
    () =>
      new Map(
        planContentRows
          .filter((row) => row.planCode?.trim())
          .map((row) => [row.planCode!.trim().toUpperCase(), row]),
      ),
    [planContentRows],
  );

  const starterPlanContent = useMemo(
    () =>
      billingPeriod === "annually"
        ? planContentByCode.get(STARTER_ANNUAL_PLAN_CODE.trim().toUpperCase()) ??
        planContentByCode.get(STARTER_MONTHLY_PLAN_CODE.trim().toUpperCase()) ??
        null
        : planContentByCode.get(STARTER_MONTHLY_PLAN_CODE.trim().toUpperCase()) ??
        planContentByCode.get(STARTER_ANNUAL_PLAN_CODE.trim().toUpperCase()) ??
        null,
    [billingPeriod, planContentByCode],
  );

  const freeTrialPlanContent = useMemo(
    () => planContentByCode.get(FREE_TRIAL_PLAN_CODE.trim().toUpperCase()) ?? null,
    [planContentByCode],
  );

  const selectedBusinessPlanContent = useMemo(
    () =>
      billingPeriod === "annually"
        ? planContentByCode.get(selectedExecution.annualPlanCode.trim().toUpperCase()) ??
        planContentByCode.get(selectedExecution.monthlyPlanCode.trim().toUpperCase()) ??
        null
        : planContentByCode.get(selectedExecution.monthlyPlanCode.trim().toUpperCase()) ??
        planContentByCode.get(selectedExecution.annualPlanCode.trim().toUpperCase()) ??
        null,
    [billingPeriod, planContentByCode, selectedExecution],
  );

  const enterprisePlanContent = useMemo(
    () => planContentByCode.get(ENTERPRISE_ANNUAL_PLAN_CODE) ?? null,
    [planContentByCode],
  );

  const starterHighlightedFeatures = useMemo(() => {
    return extractFeatureItems(starterPlanContent?.highlightedFeatures);
  }, [starterPlanContent]);

  const starterPlanFeatures = useMemo(() => {
    return extractFeatureItems(starterPlanContent?.features);
  }, [starterPlanContent]);

  const businessHighlightedFeatures = useMemo(() => {
    return extractFeatureItems(selectedBusinessPlanContent?.highlightedFeatures);
  }, [selectedBusinessPlanContent]);

  const businessPlanFeatures = useMemo(() => {
    return extractFeatureItems(selectedBusinessPlanContent?.features);
  }, [selectedBusinessPlanContent]);

  const freeTrialHighlightedFeatures = useMemo(() => {
    return extractFeatureItems(freeTrialPlanContent?.highlightedFeatures);
  }, [freeTrialPlanContent]);

  const freeTrialPlanFeatures = useMemo(() => {
    return extractFeatureItems(freeTrialPlanContent?.features);
  }, [freeTrialPlanContent]);

  const enterpriseHighlightedFeatures = useMemo(() => {
    return extractFeatureItems(enterprisePlanContent?.highlightedFeatures);
  }, [enterprisePlanContent]);

  const enterprisePlanFeatures = useMemo(() => {
    return extractFeatureItems(enterprisePlanContent?.features);
  }, [enterprisePlanContent]);

  const selectedStarterPlanCode =
    billingPeriod === "annually" ? STARTER_ANNUAL_PLAN_CODE : STARTER_MONTHLY_PLAN_CODE;

  const selectedStarterPlan =
    billingPeriod === "annually" ? starterAnnualPlan : starterMonthlyPlan;

  const selectedStarterComparePrice =
    billingPeriod === "annually" ? starterAnnualComparePrice : starterMonthlyComparePrice;

  const selectedBusinessPlan =
    billingPeriod === "annually" ? selectedBusinessAnnualPlan : selectedBusinessMonthlyPlan;

  const selectedBusinessComparePrice =
    billingPeriod === "annually"
      ? selectedBusinessAnnualComparePrice
      : selectedBusinessMonthlyComparePrice;

  const getPrice = (
    monthlyPrice: number | null,
    annualPrice?: number | null,
  ): number | null => {
    if (monthlyPrice === null && annualPrice === null) return null;
    if (monthlyPrice === 0) return 0;
    if (billingPeriod === "annually") {
      if (annualPrice === null || annualPrice === undefined) {
        return monthlyPrice;
      }

      return Math.round((annualPrice / 12) * 100) / 100;
    }
    return monthlyPrice;
  };

  const displayPrice = (
    monthlyPrice: number | null,
    annualPrice?: number | null,
  ): string => {
    const price = getPrice(monthlyPrice, annualPrice);
    if (price === null) return "Custom";
    if (price === 0) return "$0";
    return `$${price.toFixed(2)}`;
  };

  const getAnnualBillingNote = (annualPrice?: number | null): string | null => {
    if (billingPeriod !== "annually" || annualPrice === null || annualPrice === undefined) {
      return null;
    }

    return `Billed annually at $${annualPrice.toFixed(2)}/year`;
  };

  const getPlanCardAnimationStyle = () => ({
    animation: "pricingCardReveal 720ms cubic-bezier(0.16, 1, 0.3, 1) both",
  });

  const resetRecaptchaWidget = () => {
    setRecaptchaToken("");

    if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
      window.grecaptcha.reset(recaptchaWidgetIdRef.current);
    }

    recaptchaWidgetIdRef.current = null;

    if (recaptchaContainerRef.current) {
      recaptchaContainerRef.current.innerHTML = "";
    }
  };

  const resetLoginState = () => {
    setLoginForm({ username: "", password: "" });
    setLoginError("");
    setIsLoggingIn(false);
    setResetEmail("");
    setResetError("");
    setResetSuccessMessage("");
    setIsSendingResetLink(false);
    setIsStartingCheckout(false);
    setModalView("login");
    resetRecaptchaWidget();
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
    setPendingCheckoutTarget(null);
    resetLoginState();
  };

  const handleLoginChange =
    (field: keyof LoginForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setLoginForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
    };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setLoginError("Please fill in username and password.");
      return;
    }

    if (!recaptchaToken) {
      setLoginError("Please complete the reCAPTCHA.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");

    const data = {
      username: loginForm.username.trim(),
      password: loginForm.password,
      recaptcha_token: recaptchaToken,
    };

    try {
      const responseData = await submitSignin(data);

      if (!responseData?.success) {
        throw new Error(responseData?.message || "Unable to log in right now.");
      }

      persistWebsiteLogin(responseData as Record<string, unknown>);
      setIsWebsiteAuthenticated(true);
      setLoginError("");
      setPendingCheckoutTarget(null);
      setModalView("login-success");
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Unable to log in right now.",
      );
    } finally {
      setIsLoggingIn(false);
      setRecaptchaToken("");

      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!resetEmail.trim()) {
      setResetError("Please enter your email address.");
      setResetSuccessMessage("");
      return;
    }

    setIsSendingResetLink(true);
    setResetError("");
    setResetSuccessMessage("");

    try {
      const responseData = await requestPasswordReset({ email: resetEmail.trim() });

      if (!responseData?.success) {
        throw new Error(responseData?.message || "Unable to send the password reset link.");
      }

      setResetSuccessMessage(
        responseData.message || "Password reset link sent to your email",
      );
      setResetError("");
    } catch (error) {
      setResetError(
        error instanceof Error
          ? error.message
          : "Unable to send the password reset link right now.",
      );
      setResetSuccessMessage("");
    } finally {
      setIsSendingResetLink(false);
    }
  };

  const switchToResetView = () => {
    setLoginError("");
    setResetError("");
    setResetSuccessMessage("");
    setModalView("reset");
    resetRecaptchaWidget();
  };

  const switchToLoginView = () => {
    setResetError("");
    setResetSuccessMessage("");
    setLoginError("");
    setModalView("login");
    resetRecaptchaWidget();
  };

  const startCheckout = async (target: CheckoutTarget, useModalError = false) => {
    if (useModalError) {
      setLoginError("");
    } else {
      setPurchaseError("");
    }

    setIsStartingCheckout(true);

    try {
      const storedUser = getStoredWebsiteUser();
      const zohoCustomerId = storedUser?.zoho_customer_id?.trim() ?? "";
      const customerEmail = storedUser?.email?.trim() ?? "";
      const customerName =
        storedUser?.display_name?.trim() ||
        storedUser?.username?.trim() ||
        customerEmail;

      if (!zohoCustomerId || zohoCustomerId === "pending_api_sync") {
        throw new Error("User is not registered in Zoho. Please contact support.");
      }

      if (!customerEmail) {
        throw new Error("User email is missing. Please log in again.");
      }

      const params = new URLSearchParams({
        zoho_customer_id: zohoCustomerId,
        customer_name: customerName,
        customer_email: customerEmail,
        plan_code: target.code,
        redirect_url: HUB_LOGIN_URL,
      });

      setPendingCheckoutTarget(null);
      window.location.assign(
        `${buildPublicApiUrl(PAYMENTS_API_BASE_URL, "/payments/checkOut")}?${params.toString()}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start checkout.";

      if (useModalError) {
        setLoginError(message);
      } else {
        setPurchaseError(message);
      }
    } finally {
      setIsStartingCheckout(false);
    }
  };

  const handlePurchasePlan = () => {
    const target: CheckoutTarget = {
      type: "plan",
      code: selectedStarterPlanCode,
    };

    if (!isWebsiteAuthenticated && !hasClientSession) {
      setPendingCheckoutTarget(target);
      setLoginModalOpen(true);
      return;
    }

    void startCheckout(target);
  };

  const handlePurchaseAddon = (addonCode: string) => {
    const target: CheckoutTarget = {
      type: "addon",
      code: addonCode,
    };

    if (!isWebsiteAuthenticated && !hasClientSession) {
      setPendingCheckoutTarget(target);
      setLoginModalOpen(true);
      return;
    }

    void startCheckout(target);
  };

  return (
    <main>
      <section className="relative bg-primary min-h-screen py-10 md:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
        <div className="absolute top-[120px] left-0 -translate-y-1/2 -translate-x-1/2 w-[100%] h-[40%] md:w-[100%] md:h-[60%] lg:w-[100%] lg:h-[66%] xl:w-[94%] xl:h-[94%] bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center, quaternary_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="absolute top-[120px] right-0 -translate-y-1/2 translate-x-1/2 w-[100%] h-[40%] md:w-[100%] md:h-[60%] lg:w-[100%] lg:h-[66%] xl:w-[94%] xl:h-[94%] bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,quaternary_0_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-[84%] h-[88%] bg-gradient-hero blur-[160px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4 tracking-tight" >
              Product Plans & Pricing
            </h2>
            <p className="text-gray-300 text-base md:text-lg" >
              Explore and Adopt, we will support you as you grow on the Agentic AI Journey
            </p>

            <div className="inline-flex items-center mt-4 md:mt-8 bg-[#1E0A14] border border-white/10 rounded-full p-1 shadow-lg transition-all" >
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 md:px-6 py-2 rounded-full text-white text-sm shadow-md transition-all duration-300 ${billingPeriod === "monthly"
                    ? "bg-gradient-to-r from-tertiary to-quaternary"
                    : "bg-transparent text-gray-300 hover:text-white"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annually")}
                className={`px-4 md:px-6 py-2 rounded-full text-sm transition-all duration-300 flex items-center gap-1.5 ${billingPeriod === "annually"
                    ? "bg-gradient-to-r from-tertiary to-quaternary text-white"
                    : "bg-transparent text-gray-300 hover:text-white"
                  }`}
              >
                Annually
                <span className="text-secondary text-[12px] font-medium tracking-wider">
                  (Save 10%)
                </span>
              </button>
            </div>

            {isLoadingPricing ? (
              <p className="mt-4 text-sm text-gray-400">Loading pricing...</p>
            ) : null}

            {!isLoadingPricing && pricingError ? (
              <p className="mt-4 text-sm text-amber-300">{pricingError}</p>
            ) : null}

            {!isLoadingPricing && purchaseError ? (
              <p className="mt-4 text-sm text-amber-300">{purchaseError}</p>
            ) : null}

            {!isLoadingPricing && purchaseSuccessMessage ? (
              <p className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {purchaseSuccessMessage}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:px-4">
            {/* Free Plan */}
            <div
              key={`${billingPeriod}-free`}
              style={getPlanCardAnimationStyle()}
              className="w-full md:w-[calc(50%-12px)] xl:w-[calc(25%-18px)] bg-gradient-to-br from-[#240D1A] via-[#240D1A] to-[#9120595d] backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="mb-1 md:mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Free Plan
                </h3>
              </div>
              <div className="mb-2 md:mb-4 flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-bold text-white">
                  {displayPrice(getPlanDisplayPrice(freeTrialPlan) ?? 0)}
                </span>
                <span className="text-gray-400 text-sm">
                  {billingPeriod === "monthly" ? "/mo" : "/mo"}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-3 md:mb-6 min-h-[3rem]">
                {freeTrialPlanContent?.shortDescription?.trim() || ""}
              </p>
              <Link
                href={isWebsiteAuthenticated || hasClientSession ? HUB_LOGIN_URL : "/register"}
                className="w-full sm:w-fit md:w-full py-2.5 md:py-3.5 px-4 md:px-6 rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(216,69,142,0.3)] text-center"
              >
                {isWebsiteAuthenticated || hasClientSession
                  ? "Go to Dashboard"
                  : "Start free trial"}
              </Link>

              {freeTrialHighlightedFeatures.length > 0 || freeTrialPlanFeatures.length > 0 ? (
                <>
                  <div className="w-full h-px bg-white/10 my-3"></div>
                  {freeTrialHighlightedFeatures.map((item) => (
                    <p key={item} className="text-secondary mb-1 flex text-sm md:text-base gap-2">
                      <span className="flex-shrink-0">
                        <Zap size={16} />
                      </span>
                      {item}
                    </p>
                  ))}
                  {freeTrialPlanFeatures.length > 0 ? (
                    <>
                      <div className="w-full h-px bg-white/10 my-3"></div>
                      <p className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4">
                        Features
                      </p>
                      <FeatureList items={freeTrialPlanFeatures} />
                    </>
                  ) : null}
                </>
              ) : null}
            </div>

            {/* Starter Plan */}
            <div
              key={`${billingPeriod}-starter`}
              style={getPlanCardAnimationStyle()}
              className="w-full md:w-[calc(50%-12px)] xl:w-[calc(25%-18px)] bg-gradient-to-br from-[#240D1A] via-[#240D1A] to-[#9120595d] backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="mb-1 md:mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Starter Plan
                </h3>
              </div>
              <div className="mb-2 md:mb-4 flex items-baseline gap-2">
                {isLoadingPricing ? (
                  <div className="flex items-end gap-2">
                    <SkeletonBlock className="h-10 w-32 md:h-12 md:w-40" />
                    <SkeletonBlock className="h-4 w-12" />
                  </div>
                ) : selectedStarterPlan ? (
                  <>
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {displayPrice(getPlanDisplayPrice(selectedStarterPlan))}
                    </span>
                    {selectedStarterComparePrice !== null ? (
                      <span className="text-gray-500 text-sm line-through decoration-gray-500">
                        {displayPrice(selectedStarterComparePrice)}
                      </span>
                    ) : null}
                    <span className="text-gray-400 text-sm">/mo</span>
                  </>
                ) : (
                  <span className="text-sm text-amber-300">Price unavailable</span>
                )}
              </div>
              {billingPeriod === "annually" && starterAnnualPlan ? (
                <p className="-mt-2 mb-3 text-xs text-gray-400">
                  {getAnnualBillingNote(parseApiPrice(starterAnnualPlan.annual_billing) ?? getPlanDisplayPrice(starterAnnualPlan))}
                </p>
              ) : null}
              <p className="text-gray-400 text-sm leading-relaxed mb-3 md:mb-6 min-h-[3rem]">
                {starterPlanContent?.shortDescription?.trim() || ""}
              </p>
              <button
                type="button"
                onClick={handlePurchasePlan}
                disabled={isStartingCheckout}
                className="w-full sm:w-fit md:w-full py-2.5 md:py-3.5 px-4 md:px-6 rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(216,69,142,0.3)]"
              >
                {isStartingCheckout ? "Redirecting..." : "Purchase Plan Now"}
              </button>

              {starterHighlightedFeatures.length > 0 || starterPlanFeatures.length > 0 ? (
                <>
                  <div className="w-full h-px bg-white/10 my-3"></div>
                  {starterHighlightedFeatures.map((item) => (
                    <p key={item} className="text-secondary mb-1 flex text-sm md:text-base gap-2">
                      <span className="flex-shrink-0">
                        <Zap size={16} />
                      </span>
                      {item}
                    </p>
                  ))}
                  {starterPlanFeatures.length > 0 ? (
                    <>
                      <div className="w-full h-px bg-white/10 my-3"></div>
                      <p className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4">
                        Features
                      </p>
                      <FeatureList items={starterPlanFeatures} />
                    </>
                  ) : null}
                </>
              ) : null}
            </div>

            {/* Business Plan */}
            <div
              key={`${billingPeriod}-business`}
              style={getPlanCardAnimationStyle()}
              className="w-full md:w-[calc(50%-12px)] xl:w-[calc(25%-18px)] bg-gradient-to-br from-[#240D1A] via-[#240D1A] to-[#9120595d] backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="mb-1 md:mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Business
                </h3>
              </div>
              <div className="mb-2 md:mb-4 flex items-baseline gap-2">
                {isLoadingPricing ? (
                  <div className="flex items-end gap-2">
                    <SkeletonBlock className="h-10 w-32 md:h-12 md:w-40" />
                    <SkeletonBlock className="h-4 w-12" />
                  </div>
                ) : selectedBusinessPlan ? (
                  <>
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {displayPrice(getPlanDisplayPrice(selectedBusinessPlan))}
                    </span>
                    {selectedBusinessComparePrice !== null ? (
                      <span className="text-gray-500 text-sm line-through decoration-gray-500">
                        {displayPrice(selectedBusinessComparePrice)}
                      </span>
                    ) : null}
                    <span className="text-gray-400 text-sm">/mo</span>
                  </>
                ) : (
                  <span className="text-sm text-amber-300">Price unavailable</span>
                )}
              </div>
              {billingPeriod === "annually" && selectedBusinessAnnualPlan ? (
                <p className="-mt-2 mb-3 text-xs text-gray-400">
                  {getAnnualBillingNote(parseApiPrice(selectedBusinessAnnualPlan.annual_billing) ?? getPlanDisplayPrice(selectedBusinessAnnualPlan))}
                </p>
              ) : null}
              <p className="text-gray-400 text-sm leading-relaxed mb-3 md:mb-6 min-h-[3rem]">
                {selectedBusinessPlanContent?.shortDescription?.trim() || ""}
              </p>

              <Link
                href="/contact"
                className="w-full sm:w-fit md:w-full py-2.5 md:py-3.5 px-4 md:px-6 rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(216,69,142,0.3)] text-center"
              >
                Contact Sales
              </Link>
              <div
                className="flex mt-4 w-full sm:w-fit md:w-full"
                role="radiogroup"
                aria-label="Business plan run selection"
              >
                <div className="flex w-full bg-[#0f0b10] rounded-full p-1 border border-white/5 shadow-inner">
                  {executionOptions.map((option) => {
                    const isSelected = selectedExecution.id === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedExecution(option)}
                        className={`w-1/2 flex-1 sm:flex-none px-4 md:px-6 lg:px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm lg:text-[13px] font-semibold tracking-wide transition-all duration-300 whitespace-nowrap ${isSelected
                            ? "bg-[#2c2730] text-white shadow-md"
                            : "text-gray-400 hover:text-gray-200"
                          }`}
                      >
                        {option.id === "50k" ? "50K Credits" : "100K Credits"}
                      </button>
                    );
                  })}
                </div>
              </div>
              {businessHighlightedFeatures.length > 0 || businessPlanFeatures.length > 0 ? (
                <>
                  <div className="w-full h-px bg-white/10 my-3"></div>
                  {businessHighlightedFeatures.map((item) => (
                    <p key={item} className="text-secondary mb-1 flex text-sm md:text-base gap-2">
                      <span className="flex-shrink-0">
                        <Zap size={16} />
                      </span>
                      {item}
                    </p>
                  ))}
                  {businessPlanFeatures.length > 0 ? (
                    <>
                      <div className="w-full h-px bg-white/10 my-3"></div>
                      <p className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4">
                        Features
                      </p>
                      <FeatureList items={businessPlanFeatures} />
                    </>
                  ) : null}
                </>
              ) : null}
            </div>

            {/* Enterprise Plan */}
            <div
              key={`${billingPeriod}-enterprise`}
              style={getPlanCardAnimationStyle()}
              className="w-full md:w-[calc(50%-12px)] xl:w-[calc(25%-18px)] bg-gradient-to-br from-[#240D1A] via-[#240D1A] to-[#9120595d] backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="mb-1 md:mb-2">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Enterprise
                </h3>
              </div>
              <div className="mb-2 md:mb-4 flex items-baseline gap-2">
                {isLoadingPricing ? (
                  <div className="flex items-end gap-2">
                    <SkeletonBlock className="h-10 w-32 md:h-12 md:w-40" />
                    <SkeletonBlock className="h-4 w-12" />
                  </div>
                ) : (
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    Custom
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-3 md:mb-6 min-h-[3rem]">
                {enterprisePlanContent?.shortDescription?.trim() || ""}
              </p>
              <Link
                href="/contact"
                className="w-full sm:w-fit md:w-full py-2.5 md:py-3.5 px-4 md:px-6 rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(216,69,142,0.3)] text-center"
              >
                Contact Sales
              </Link>

              {enterpriseHighlightedFeatures.length > 0 || enterprisePlanFeatures.length > 0 ? (
                <>
                  <div className="w-full h-px bg-white/10 my-3"></div>
                  {enterpriseHighlightedFeatures.map((item) => (
                    <p key={item} className="text-secondary mb-1 flex text-sm md:text-base gap-2">
                      <span className="flex-shrink-0">
                        <Zap size={16} />
                      </span>
                      {item}
                    </p>
                  ))}
                  {enterprisePlanFeatures.length > 0 ? (
                    <>
                      <div className="w-full h-px bg-white/10 my-3"></div>
                      <p className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4">
                        Features
                      </p>
                      <FeatureList items={enterprisePlanFeatures} />
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 lg:py-20  bg-primary relative font-sans overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4 tracking-tight" data-aos="fade-down"
              data-aos-duration="1000" data-aos-delay="100">
              Need More Power?
            </h2>
            <p className="text-gray-300 text-sm md:text-base" data-aos="fade-down"
            >
              Top up your account with one-time run packs anytime.
            </p>
          </div>

          <div
            className="flex flex-wrap justify-center gap-6 container mx-auto"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            {isLoadingPricing
              ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`addon-skeleton-${index}`}
                  className="w-full md:w-[calc(50%-12px)] xl:w-[calc(25%-18px)] bg-gradient-to-br from-[#12050B] via-[#240D1A] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 flex flex-col shadow-2xl"
                >
                  <SkeletonBlock className="h-7 w-3/4" />
                  <div className="mt-3">
                    <SkeletonBlock className="h-4 w-28" />
                  </div>
                  <div className="w-full h-px bg-white/5 my-6"></div>
                  <SkeletonBlock className="h-10 w-28" />
                  <div className="mt-8">
                    <SkeletonBlock className="h-11 w-full" />
                  </div>
                </div>
              ))
              : [
                ...addonPlans.map((addon) => {
                  const addonPrice = getPlanDisplayPrice(addon);
                  const addonComparePrice = getPlanComparePrice(addon);

                  return (
                    <div
                      key={addon.addon_code ?? addon.plan_code ?? addon.name}
                      className="w-full md:w-[calc(50%-12px)] xl:w-[calc(25%-18px)] bg-gradient-to-br from-[#12050B] via-[#240D1A] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300"
                    >
                      <h3 className="text-xl font-bold text-white leading-snug mb-1 md:mb-2">
                        {addon.name}
                      </h3>
                      <p className="text-gray-400 text-xs mb-3 md:mb-6">
                        One-time purchase
                      </p>
                      <div className="w-full h-px bg-white/5 mb-3 md:mb-6"></div>
                      <div className="mb-4 md:mb-8 flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-bold text-white">
                          {displayPrice(addonPrice)}
                        </span>
                        {addonComparePrice !== null ? (
                          <span className="text-gray-500 text-sm line-through decoration-gray-500">
                            {displayPrice(addonComparePrice)}
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const addonCode = addon.addon_code ?? addon.plan_code ?? "";
                          if (!addonCode) {
                            return;
                          }
                          handlePurchaseAddon(addonCode);
                        }}
                        disabled={isStartingCheckout}
                        className="md:w-full sm:w-fit w-full px-8 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] text-white font-medium text-sm hover:opacity-90 transition-opacity mt-auto shadow-[0_0_20px_rgba(216,69,142,0.2)] text-center disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isStartingCheckout ? "Redirecting..." : "Buy Pack"}
                      </button>
                    </div>
                  );
                }),
                <div
                  key="custom-addon-pack"
                  className="w-full md:w-[calc(50%-12px)] xl:w-[calc(25%-18px)] bg-gradient-to-br from-[#12050B] via-[#240D1A] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300"
                >
                  <h3 className="text-xl font-bold text-white leading-snug mb-1 md:mb-2">
                    WiiZ Custom AddOn Pack
                  </h3>
                  <p className="text-gray-400 text-xs mb-3 md:mb-6">
                    One-time purchase
                  </p>
                  <div className="w-full h-px bg-white/5 mb-3 md:mb-6"></div>
                  <div className="mb-4 md:mb-8 flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      Custom
                    </span>
                  </div>
                  <Link
                    href="/contact"
                    className="md:w-full sm:w-fit w-full px-8 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] text-white font-medium text-sm hover:opacity-90 transition-opacity mt-auto shadow-[0_0_20px_rgba(216,69,142,0.2)] text-center"
                  >
                    Contact Sales
                  </Link>
                </div>,
              ]}
          </div>

          {!isLoadingPricing && !pricingError && addonPlans.length === 0 ? (
            <p className="mt-6 text-center text-sm text-gray-400">
              No add-on packs are available right now.
            </p>
          ) : null}
        </div>
      </section>

      <section className="relative bg-primary py-10 md:py-12 xl:py-20  font-sans  px-4 overflow-hidden" >
        <div className="container mx-auto px-0 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 lg:p-16 flex flex-col md:flex-row items-center justify-between border border-white/10 bg-gradient-to-b from-[#12050B] via-[#240D1A] via-[#3B16299C] to-[#912059C4] shadow-2xl overflow-hidden" data-aos="fade-down" data-aos-duration="700">
            <div className="text-center md:text-left w-full md:max-w-2xl mb-6 md:mb-0 pr-0 md:pr-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight leading-tight">
                <span className="text-white">
                 Start Building Enterprise

                </span>
                <br></br>
                <span className="text-secondary">AI Agents Today</span>
              </h2>
              <p className="text-base text-gray-300 md:leading-relaxed max-w-xl">
               Join teams using WiiZ to design, deploy, and scale enterprise AI systems with confidence.
              </p>
            </div>

            <div className="flex-shrink-0 md:ml-auto">
              <Link
                href="/register"
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#912059] to-[#D87AAA] text-white px-8  py-2.5 md:py-4 rounded-full text-base font-semibold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#912059]/60 duration-300 shadow-xl shadow-[#912059]/50"
              >
               Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
 

      <style jsx>{`
        @keyframes pricingCardReveal {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.96);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
      `}</style>

      {loginModalOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 py-6"
          onClick={closeLoginModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pricing-login-modal-title"
            className="relative w-full max-w-lg overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#150b12] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-secondary">
                  Starter Plan
                </p>
                <h2
                  id="pricing-login-modal-title"
                  className="mt-2 text-xl font-semibold text-white"
                >
                  {modalView === "login-success"
                    ? "Login Successful!"
                    : modalView === "reset"
                      ? "Reset Password"
                      : "Login to purchase plans"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeLoginModal}
                aria-label="Close login modal"
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-5 md:px-6 md:py-6">
              {modalView === "login-success" ? (
                <div className="space-y-6">
                  <p className="text-sm leading-7 text-gray-300">
                    Now please select the plan you want to purchase.
                  </p>
                  {/* <div className="flex flex-col gap-3">
                    <a
                      href={HUB_LOGIN_URL}
                      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Go to Hub at WiiZ Atlas 2.0
                    </a>
                  </div> */}
                </div>
              ) : modalView === "reset" ? (
                <form className="space-y-4" onSubmit={handleResetPassword}>
                  <p className="text-sm leading-7 text-gray-300">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Email Address <span className="text-white">*</span>
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(event) => setResetEmail(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#ab386a] focus:outline-none"
                    />
                  </div>

                  {resetError ? (
                    <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {resetError}
                    </div>
                  ) : null}

                  {resetSuccessMessage ? (
                    <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      {resetSuccessMessage}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isSendingResetLink}
                      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSendingResetLink ? "Sending..." : "Send reset link"}
                    </button>
                    <button
                      type="button"
                      onClick={switchToLoginView}
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Username <span className="text-white">*</span>
                    </label>
                    <input
                      type="text"
                      value={loginForm.username}
                      onChange={handleLoginChange("username")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#ab386a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Password <span className="text-white">*</span>
                    </label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={handleLoginChange("password")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-[#ab386a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-300">
                      Verify you are human <span className="text-white">*</span>
                    </label>
                    <div className="w-full overflow-hidden">
                      <div
                        ref={recaptchaContainerRef}
                        className="min-h-[72px] sm:min-h-[78px] inline-flex origin-left scale-[0.92] sm:scale-100 rounded-md overflow-hidden"
                      />
                    </div>
                  </div>

                  {loginError ? (
                    <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {loginError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isLoggingIn || isStartingCheckout}
                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoggingIn
                      ? "Logging in..."
                      : isStartingCheckout
                        ? "Redirecting..."
                        : "Login"}
                  </button>

                  <div className="space-y-2 pt-1 text-sm text-gray-300">
                    <p>
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/register"
                        className="font-semibold text-secondary hover:text-white"
                      >
                        Create a new account
                      </Link>
                    </p>
                    <p>
                      <button
                        type="button"
                        onClick={switchToResetView}
                        className="font-semibold text-secondary hover:text-white"
                      >
                        Forgot password?
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
