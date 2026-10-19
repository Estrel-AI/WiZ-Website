"use client";

import { Image as ImageIcon, RefreshCw, Trash2, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { AdminButton } from "@/src/components/admin/admin-ui";
import { cn } from "@/src/lib/utils";

type ImageUploadFieldProps = {
  label?: string;
  value?: string | null;
  folder?: "hero" | "impact" | "blog" | "feature" | "trusted-by" | "testimonials" | "team" | "section-bg";
  onChange: (url: string | null) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  aspectRatio?: "square" | "video" | "wide";
  placeholderText?: string;
  className?: string;
  error?: string;
};

export function ImageUploadField({
  label = "Image Upload",
  value,
  folder = "team",
  onChange,
  onUploadStart,
  onUploadEnd,
  aspectRatio = "square",
  placeholderText = "PNG, JPG, WebP, or SVG (max 5MB)",
  className,
  error,
}: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be 5MB or less.");
      return;
    }

    setUploading(true);
    onUploadStart?.();

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/media/upload/${folder}`, {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to upload image.");
      }

      const mediaPath = payload.data?.filepath ? `/api/media/${payload.data.filepath}` : payload.data?.url;
      onChange(mediaPath);
    } catch (err) {
      console.error("Upload error:", err);
      alert(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      onUploadEnd?.();
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      void handleFile(files[0]);
    }
  }

  const previewAspectClass =
    aspectRatio === "video"
      ? "w-40 aspect-video"
      : aspectRatio === "wide"
        ? "w-48 h-28"
        : "w-24 h-24";

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
        </label>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {value ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-xs">
          <div
            className={cn(
              "relative shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs group",
              previewAspectClass,
            )}
          >
            <img
              src={value}
              alt="Uploaded preview"
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-1 rounded-md backdrop-blur-xs">
                Uploaded
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Image Attached
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <AdminButton
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="h-8 text-xs cursor-pointer"
              >
                {uploading ? (
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin text-[#98235f]" />
                ) : (
                  <Upload className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
                )}
                {uploading ? "Replacing..." : "Replace Image"}
              </AdminButton>

              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-600 shadow-2xs hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer",
            isDragging
              ? "border-[#98235f] bg-[#98235f]/5 scale-[0.99]"
              : "border-slate-200 bg-slate-50/50 hover:border-[#98235f]/40 hover:bg-slate-50",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs border border-slate-200 text-slate-500 group-hover:scale-110 group-hover:text-[#98235f] group-hover:border-[#98235f]/30 transition-transform">
            {uploading ? (
              <RefreshCw className="h-6 w-6 animate-spin text-[#98235f]" />
            ) : (
              <ImageIcon className="h-6 w-6" />
            )}
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-xs font-bold text-slate-800">
              {uploading ? "Uploading file..." : "Click to upload or drag & drop"}
            </p>
            <p className="text-[11px] text-slate-500 font-normal">{placeholderText}</p>
          </div>
        </div>
      )}

      {error ? <p className="text-xs text-rose-600 font-medium">{error}</p> : null}
    </div>
  );
}
