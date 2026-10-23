import { useState, useRef } from "react";
import { AlertTriangle, Check, Image as ImageIcon, Link as LinkIcon, Loader2, MoreHorizontal, Search, Trash2, UploadCloud, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[16px] border border-white/80 bg-white/80 backdrop-blur-md shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-white hover:bg-white/95 hover:shadow-[0_8px_32px_rgba(15,23,42,0.08)]", className)}>
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
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-500">{description}</p>
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
        "inline-flex h-10 items-center justify-center rounded-[12px] px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-gradient-to-r from-[#801b54] via-[#98235f] to-[#b32b70] text-white hover:from-[#6b1646] hover:to-[#801b54] shadow-[0_4px_14px_rgba(152,35,95,0.3)]",
        variant === "secondary" && "border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-500 shadow-[0_4px_14px_rgba(225,29,72,0.3)]",
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
        "inline-flex h-10 items-center justify-center gap-2 rounded-[12px] border border-slate-200/90 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50",
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
  counter,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  counter?: string;
}) {
  return (
    <label className="block">
      {label || counter ? (
        <span className="mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>{label}</span>
          {counter ? (
            <span className="shrink-0 text-[11px] font-medium normal-case tracking-normal text-slate-400">{counter}</span>
          ) : null}
        </span>
      ) : null}
      <input
        className={cn(
          "h-11 w-full rounded-[14px] border border-slate-200/80 bg-white px-4 text-sm text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 shadow-[0_2px_8px_rgba(15,23,42,0.03)] focus:border-[#98235f] focus:bg-white focus:ring-4 focus:ring-[#98235f]/12 disabled:cursor-not-allowed disabled:border-slate-200/60 disabled:bg-slate-100/50 disabled:text-slate-400 disabled:placeholder:text-slate-400 disabled:opacity-100",
          error && "border-rose-300 focus:border-rose-500 focus:ring-rose-500/15",
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

export function AdminTextarea({
  label,
  error,
  counter,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  counter?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <span>{label}</span>
        {counter ? (
          <span className="shrink-0 text-[11px] font-medium normal-case tracking-normal text-slate-400">{counter}</span>
        ) : null}
      </span>
      <textarea
        className={cn(
          "min-h-[110px] w-full rounded-[14px] border border-slate-200/80 bg-white/60 backdrop-blur-md px-4 py-3 text-sm text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_8px_rgba(15,23,42,0.03)] focus:border-[#98235f] focus:bg-white/90 focus:ring-4 focus:ring-[#98235f]/12",
          error && "border-rose-300 focus:border-rose-500 focus:ring-rose-500/15",
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span> : null}
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
  label?: string;
  error?: string;
}) {
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span> : null}
      <select
        className={cn(
          "h-11 w-full rounded-[14px] border border-slate-200/80 bg-white/60 backdrop-blur-md px-4 pr-10 text-sm text-slate-950 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_8px_rgba(15,23,42,0.03)] focus:border-[#98235f] focus:bg-white/90 focus:ring-4 focus:ring-[#98235f]/12",
          error && "border-rose-300 focus:border-rose-500 focus:ring-rose-500/15",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

export function ImageUploadField({
  label,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<"file" | "url">(value && !value.startsWith("/uploads/") ? "url" : "file");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.message || "Failed to upload image.");
      }
    } catch {
      alert("An error occurred while uploading the image.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-0.5 transition cursor-pointer",
              mode === "file" ? "bg-white text-slate-900 shadow-xs font-bold" : "hover:text-slate-900"
            )}
          >
            <UploadCloud className="h-3 w-3" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-0.5 transition cursor-pointer",
              mode === "url" ? "bg-white text-slate-900 shadow-xs font-bold" : "hover:text-slate-900"
            )}
          >
            <LinkIcon className="h-3 w-3" />
            URL / Path
          </button>
        </div>
      </div>

      {mode === "file" ? (
        <div className="space-y-2">
          {value ? (
            <div className="relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                <img src={value} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{value.split("/").pop() || value}</p>
                <p className="text-[11px] text-emerald-600 font-mono flex items-center gap-1">
                  <Check className="h-3 w-3" /> Image uploaded successfully
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#98235f] font-semibold hover:underline cursor-pointer"
                  >
                    Change Image
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative flex flex-col items-center justify-center min-h-[140px] rounded-2xl border-2 border-dashed border-slate-300/80 bg-slate-50/50 p-4 text-center transition-all cursor-pointer hover:border-[#98235f]/50 hover:bg-pink-50/30",
                dragOver && "border-[#98235f] bg-pink-50/50 ring-4 ring-[#98235f]/10",
                uploading && "pointer-events-none opacity-60",
                error && "border-rose-300 bg-rose-50/30"
              )}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-slate-600">
                  <Loader2 className="h-7 w-7 animate-spin text-[#98235f]" />
                  <span className="text-xs font-semibold">Uploading image file...</span>
                </div>
              ) : (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-slate-200 text-[#98235f] shadow-xs mb-2">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    Click to upload <span className="text-slate-400 font-normal">or drag & drop image</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP, GIF, SVG (Max 10MB)</p>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) void handleFileSelect(e.target.files[0]);
            }}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. /images/Enterprice_it.jpg or https://..."
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-900 shadow-2xs focus:border-[#98235f] focus:outline-none focus:ring-2 focus:ring-[#98235f]/20",
              error && "border-rose-500 focus:border-rose-500"
            )}
          />
          {value ? (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <img src={value} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <span className="text-xs text-slate-600 truncate flex-1">{value}</span>
            </div>
          ) : null}
        </div>
      )}

      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
      {hint && !error ? <p className="text-[11px] text-slate-400">{hint}</p> : null}
    </div>
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
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[14px] border border-slate-200/80 bg-white/60 backdrop-blur-md pl-10 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_8px_rgba(15,23,42,0.03)] focus:border-[#98235f] focus:bg-white/90 focus:ring-4 focus:ring-[#98235f]/12"
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
    <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">{search}</div>
      <div className="flex flex-wrap items-center gap-3">
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
      <div className="absolute right-12 top-1/2 z-50 min-w-[180px] -translate-y-1/2 overflow-hidden rounded-[12px] border border-slate-200 bg-white p-2 shadow-[0_22px_50px_rgba(15,23,42,0.18)]">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className={cn(
              "flex w-full items-center rounded-[10px] px-3 py-2 text-left text-sm font-medium transition hover:bg-slate-50",
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
        <div key={index} className="h-12 animate-pulse rounded-[12px] bg-slate-100" />
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
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-slate-300/80 bg-slate-50/60 px-5 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200/80 text-slate-400 shadow-xs">
        <AlertTriangle className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function StatusPill({
  value,
}: {
  value: "draft" | "published" | "visible" | "hidden" | "active" | "inactive";
}) {
  const active = value === "published" || value === "visible" || value === "active";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs",
        active
          ? "border border-emerald-200/70 bg-emerald-50 text-emerald-700"
          : "border border-slate-200/70 bg-slate-100 text-slate-600",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-400")} />
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
        className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-md mb-0"
        onClick={onClose}
        aria-label="Close drawer"
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto border-l border-white/80 bg-white/90 backdrop-blur-2xl shadow-[0_32px_90px_rgba(15,23,42,0.22)]">
        <div className="sticky top-0 border-b border-slate-200/80 bg-white/90 px-5 py-4 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#4c112e]">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-xs transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
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
        className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className={cn(
            "relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-[22px] border border-white/90 bg-white/90 backdrop-blur-2xl shadow-[0_32px_90px_rgba(15,23,42,0.22)]",
            widthClass,
          )}
        >
          <div className="border-b border-slate-200/80 bg-white/80 px-5 py-4 backdrop-blur-md sm:px-6">
            <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
          {footer ? <div className="border-t border-slate-200/80 bg-white/80 px-5 py-3.5 backdrop-blur-md sm:px-6">{footer}</div> : null}
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
        className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-xs animate-in fade-in-0 duration-150 cursor-default"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/80 bg-white/95 p-4 sm:p-5 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#98235f]/10 text-[#98235f] font-bold shadow-xs">
            <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">{title}</h3>
            <p className="mt-0.5 line-clamp-2 text-sm font-normal text-slate-500 leading-snug">{description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-slate-100/70 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200/80 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-xl bg-[#98235f] hover:bg-[#801b54] px-4 py-1.5 text-xs font-bold text-white shadow-xs shadow-[#98235f]/20 transition-all cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}

export function StatusConfirmModal({
  open,
  title,
  targetStatus,
  loading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title?: string;
  targetStatus: "active" | "inactive";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const isActivating = targetStatus === "active";
  const modalTitle = title || (isActivating ? "Activate item?" : "Deactivate item?");

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-xs animate-in fade-in-0 duration-150 cursor-default"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#98235f]/10 text-[#98235f] font-bold shadow-xs">
            {isActivating ? (
              <Check className="h-5 w-5 stroke-[2.5]" />
            ) : (
              <X className="h-5 w-5 stroke-[2.5]" />
            )}
          </div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">{modalTitle}</h3>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-slate-100/70 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200/80 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-[#98235f] hover:bg-[#801b54] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs shadow-[#98235f]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Updating...
              </span>
            ) : isActivating ? (
              "Activate"
            ) : (
              "Deactivate"
            )}
          </button>
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







