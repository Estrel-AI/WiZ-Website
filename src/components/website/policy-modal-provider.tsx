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

type PolicyModalContextValue = {
  openPolicy: (key: PolicyKey) => void;
  closePolicy: () => void;
};

const PolicyModalContext = createContext<PolicyModalContextValue | null>(null);
const fallbackPolicyModalContext: PolicyModalContextValue = {
  openPolicy: () => {},
  closePolicy: () => {},
};

export function PolicyModalProvider({ children }: { children: ReactNode }) {
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);
  const pathname = usePathname();
  const showCookieBanner = !pathname.startsWith("/admin");

  const handleDownload = () => {
    if (!activePolicy) {
      return;
    }

    const entry = policyRegistry[activePolicy];
    const fileName =
      activePolicy === "terms"
        ? "wiiz-terms-and-conditions.txt"
        : activePolicy === "privacy"
          ? "wiiz-privacy-policy.txt"
          : "wiiz-cookie-policy.txt";
    const blob = new Blob([entry.content], { type: "text/plain;charset=utf-8" });
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
    []
  );

  const activeEntry = activePolicy ? policyRegistry[activePolicy] : null;

  return (
      <PolicyModalContext.Provider value={value}>
        {children}
      {showCookieBanner ? <CookieConsentBanner openPolicy={value.openPolicy} /> : null}

      {activeEntry ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-6"
          onClick={() => setActivePolicy(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-modal-title"
            className="relative w-full max-w-5xl overflow-hidden rounded-[1rem] md:rounded-[2rem] border border-white/20 bg-primary shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Escape") {
                setActivePolicy(null);
              }
            }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 md:px-6 py-4 md:py-5 lg:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-secondary">
                  Legal
                </p>
                <h2
                  id="policy-modal-title"
                  className="mt-2 text-xl md:text-2xl font-semibold text-white"
                >
                  {activeEntry.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolicy(null)}
                  aria-label="Close policy modal"
                  className="flex h-10 w-10 items-center justify-center rounded-full  text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="max-h-[75vh] space-y-2 md:space-y-5 overflow-y-auto px-4 md:px-6 py-4 md:py-6 lg:px-8 [scrollbar-color:#8b3d67_#221520] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#8b3d67] [&::-webkit-scrollbar-track]:bg-[#221520] [&::-webkit-scrollbar]:w-1.5">
              {renderPolicyContent(activeEntry.content)}
            </div>
          </div>
        </div>
      ) : null}
    </PolicyModalContext.Provider>
  );
}

export function usePolicyModal() {
  const context = useContext(PolicyModalContext);
  return context ?? fallbackPolicyModalContext;
}
