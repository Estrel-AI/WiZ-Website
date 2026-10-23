"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

type ToastTone = "success" | "error";

type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  showToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 10);
    setToasts((current) => [...current, { ...toast, id }].slice(-5));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[70] h-[180px] w-[min(340px,calc(100vw-2rem))]" aria-live="polite">
        {toasts.map((toast, index) => {
          const depth = toasts.length - index - 1;
          const Icon = toast.tone === "success" ? CheckCircle2 : AlertCircle;
          return (
            <div
              key={toast.id}
              style={{
                zIndex: 70 - depth,
                transform: `translateY(${-depth * 15}px) scale(${1 - Math.min(depth, 4) * 0.035})`,
                opacity: depth > 2 ? 0.62 : 1,
              }}
              className={cn(
                "pointer-events-auto absolute bottom-0 right-0 flex w-full animate-[toast-slide-up_280ms_cubic-bezier(0.22,1,0.36,1)] items-start gap-2.5 overflow-hidden rounded-[14px] border border-white/10 bg-gradient-to-br from-[#36182e] via-[#281027] to-[#98235f] px-3 py-2.5 text-white shadow-[0_14px_36px_rgba(36,13,26,0.38)] backdrop-blur-xl transition-all duration-300",
                toast.tone === "success"
                  ? "border-emerald-400/40 bg-gradient-to-br from-[#1a3b33] via-[#143e34] to-[#1b6d54] ring-1 ring-emerald-300/15"
                  : "border-[#AD2D45]/35 ring-1 ring-[#AD2D45]/15",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  toast.tone === "success" ? "bg-emerald-400/20 text-emerald-300" : "bg-[#AD2D45]/25 text-[#ff9bb5]",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                  {toast.tone === "success" ? "Success" : "Action needed"}
                </div>
                <div className="mt-0.5 text-[13px] font-semibold text-white">{toast.title}</div>
                {toast.description ? <div className="mt-0.5 text-[11px] leading-4 text-white/65">{toast.description}</div> : null}
              </div>
              <button
                type="button"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                className="rounded-lg p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 h-[2px] origin-left animate-[toast-progress_3500ms_linear_forwards]",
                  toast.tone === "success" ? "bg-emerald-400" : "bg-[#AD2D45]",
                )}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useAdminToast must be used within AdminToastProvider");
  }

  return context;
}
