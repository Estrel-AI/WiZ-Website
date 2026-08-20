"use client";

import { AlertTriangle, Loader2, MoreHorizontal, Search } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[10px] border border-slate-200 bg-white shadow-sm transition hover:border-slate-300", className)}>
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-[1.65rem] font-semibold leading-tight text-slate-950">{title}</h2>
        <p className="mt-1.5 max-w-3xl text-sm text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function AdminButton({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-[10px] px-3.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-slate-950 text-white hover:bg-slate-800",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-500",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminToolbarButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  label,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
      <input
        className={cn(
          "h-11 w-full rounded-[10px] border border-slate-200 bg-white px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:placeholder:text-slate-400 disabled:opacity-100",
          error && "border-rose-300 focus:border-rose-500",
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-2 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

export function AdminTextarea({
  label,
  error,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        className={cn(
          "min-h-[108px] w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950",
          error && "border-rose-300 focus:border-rose-500",
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-2 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

export function AdminSelect({
  label,
  error,
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <select
        className={cn(
          "h-11 w-full rounded-[10px] border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-950 outline-none transition focus:border-slate-950",
          error && "border-rose-300 focus:border-rose-500",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-2 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block w-full">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[10px] border border-slate-200 bg-white pl-10 pr-3.5 text-sm outline-none transition focus:border-slate-950"
      />
    </label>
  );
}

export function AdminTableToolbar({
  search,
  primaryAction,
  secondaryActions,
}: {
  search?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-slate-50/70 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">{search}</div>
      <div className="flex flex-wrap items-center gap-2.5">
        {primaryAction}
        {secondaryActions}
      </div>
    </div>
  );
}

export function AdminRowActionMenu({
  items,
}: {
  items: Array<{
    label: string;
    onClick: () => void;
    tone?: "default" | "danger";
  }>;
}) {
  return (
    <details className="group relative z-30">
      <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-[10px] border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700">
        <MoreHorizontal className="h-5 w-5" />
      </summary>
      <div className="absolute right-12 top-1/2 z-50 min-w-[180px] -translate-y-1/2 overflow-hidden rounded-[10px] border border-slate-200 bg-white p-2 shadow-[0_22px_50px_rgba(15,23,42,0.18)]">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className={cn(
              "flex w-full items-center rounded-[10px] px-3 py-2 text-left text-sm transition hover:bg-slate-50",
              item.tone === "danger" ? "text-rose-600" : "text-slate-700",
            )}
            onClick={() => {
              item.onClick();
              const details = document.activeElement?.closest("details");
              if (details instanceof HTMLDetailsElement) {
                details.open = false;
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </details>
  );
}

export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-[10px] bg-slate-100" />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
      <AlertTriangle className="h-9 w-9 text-slate-400" />
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function StatusPill({
  value,
}: {
  value: "draft" | "published" | "visible" | "hidden";
}) {
  const active = value === "published" || value === "visible";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
      )}
    >
      {value}
    </span>
  );
}

export function Drawer({
  open,
  title,
  description,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm mb-0"
        onClick={onClose}
        aria-label="Close drawer"
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <h3 className="text-lg font-semibold text-[#4c112e]">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </>
  );
}


export function Modal({
  open,
  title,
  description: _description,
  children,
  footer,
  onClose,
  size = "lg",
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  size?: "md" | "lg" | "xl";
}) {
  if (!open) {
    return null;
  }

  void _description;

  const widthClass =
    size === "md" ? "max-w-2xl" : size === "xl" ? "max-w-6xl" : "max-w-4xl";

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className={cn(
            "relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.22)]",
            widthClass,
          )}
        >
          <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
            <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
          {footer ? <div className="border-t border-slate-200 bg-white px-5 py-3.5 sm:px-6">{footer}</div> : null}
        </div>
      </div>
    </>
  );
}
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-950/40"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[10px] border border-slate-200 bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-semibold text-[#4c112e]">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        <div className="mt-5 flex justify-end gap-2.5">
          <AdminButton variant="secondary" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </>
  );
}

export function InlineLoader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}







