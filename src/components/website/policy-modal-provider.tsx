"use client";

import { Download, X } from "lucide-react";
import {
  createContext,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  policyRegistry,
  PolicyKey,
  renderPolicyContent,
} from "@/src/components/website/policy-content";
import CookieConsentBanner from "@/src/components/website/cookie-consent-banner";
import type { ApiResponse, LegalPolicyRow } from "@/src/types/admin-api";

type PolicyModalContextValue = {
  openPolicy: (key: PolicyKey) => void;
  closePolicy: () => void;
};

const PolicyModalContext = createContext<PolicyModalContextValue | null>(null);
const fallbackPolicyModalContext: PolicyModalContextValue = {
  openPolicy: () => {},
  closePolicy: () => {},
};

type DynamicPolicyStore = Record<string, { title: string; content: string }>;

export function PolicyModalProvider({ children }: { children: ReactNode }) {
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);
  const [dynamicPolicies, setDynamicPolicies] = useState<DynamicPolicyStore>({});
  const pathname = usePathname();
  const showCookieBanner = !pathname.startsWith("/admin");

  useEffect(() => {
    let active = true;
    fetch("/api/legal-policies")
      .then(async (res) => {
        const payload = (await res.json()) as ApiResponse<LegalPolicyRow[]>;
        if (active && payload.success && payload.data && payload.data.length > 0) {
          const map: DynamicPolicyStore = {};
          for (const item of payload.data) {
            map[item.policyKey] = {
              title: item.title,
              content: item.content,
            };
          }
          setDynamicPolicies(map);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const activeEntry = useMemo(() => {
    if (!activePolicy) return null;
    const dynamic = dynamicPolicies[activePolicy];
    if (dynamic && dynamic.content) {
      return dynamic;
    }
    return policyRegistry[activePolicy] || null;
  }, [activePolicy, dynamicPolicies]);

  const handleDownload = () => {
    if (!activePolicy || !activeEntry) {
      return;
    }

    const fileName =
      activePolicy === "terms"
        ? "wiiz-terms-and-conditions.txt"
        : activePolicy === "privacy"
          ? "wiiz-privacy-policy.txt"
          : "wiiz-cookie-policy.txt";
    const blob = new Blob([activeEntry.content], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!activePolicy) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePolicy(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [activePolicy]);

  const value = useMemo(
    () => ({
      openPolicy: (key: PolicyKey) => setActivePolicy(key),
      closePolicy: () => setActivePolicy(null),
    }),
    [],
  );

  return (
    <PolicyModalContext.Provider value={value}>
      {children}
      {showCookieBanner ? <CookieConsentBanner openPolicy={value.openPolicy} /> : null}

      {activeEntry ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-6"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-modal-title"
            className="relative w-full max-w-5xl overflow-hidden rounded-[1rem] md:rounded-[2rem] border border-white/20 bg-primary shadow-2xl"
            onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Escape") {
                setActivePolicy(null);
              }
            }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0F1115]/95 px-6 py-4 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                {activeEntry.title}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:bg-white/15 hover:text-white"
                  title="Download as text file"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePolicy(null)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-6 font-sans text-gray-300 h-[80vh] md:h-[600px] lg:h-[600px]">
              <div className="space-y-4">
                {renderPolicyContent(activeEntry.content)}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PolicyModalContext.Provider>
  );
}

export function usePolicyModal() {
  const context = useContext(PolicyModalContext);
  return context || fallbackPolicyModalContext;
}
