"use client";

import Image from "next/image";
import { Edit3, Layers3, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  ConfirmDialog,
  LoadingSkeleton,
  Modal,
  SectionHeader,
} from "@/src/components/admin/admin-ui";
import { ImageUploadField } from "@/src/components/admin/admin-image-upload";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { cn } from "@/src/lib/utils";
import type { ApiResponse, SectionHeaderData, SectionHeaderUpsertPayload } from "@/src/types/admin-api";

const DEFAULT_HEADER: SectionHeaderData = {
  id: 0,
  sectionKey: "VISION",
  badgeText: "OUR VISION",
  heading: "The Enterprise AI Workforce Needs an Operating System",
  description:
    "\u201cWe believe every enterprise will enhance itself with AI. WiiZ is building the operating system that enables enterprises to adopt AI at ease.\u201d",
  buttonText: null,
  buttonUrl: "/api/assets/dummy_image/about_section.png",
  backgroundImage: null,
  createdAt: "",
  updatedAt: "",
};

function OverlayButton({
  label,
  active = false,
  className,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative block w-full rounded-2xl border border-dashed border-transparent text-left transition focus:outline-none hover:border-white/30 cursor-pointer",
        active && "ring-2 ring-[#98235f]",
        className,
      )}
    >
      <span className="pointer-events-none absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-black/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus:opacity-100 shadow-md">
        <Edit3 className="h-3.5 w-3.5 text-[#E68F17]" />
        {label}
      </span>
      {children}
    </button>
  );
}

export default function AdminOurVisionHeaderPage() {
  const { showToast } = useAdminToast();
  const [saved, setSaved] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [draft, setDraft] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/section-headers/VISION", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<SectionHeaderData | null>;
        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? payload.message);
        }
        if (active && payload.data) {
          setSaved(payload.data);
          setDraft(payload.data);
        }
      })
      .catch((error: unknown) =>
        showToast({
          tone: "error",
          title: "Header unavailable",
          description: error instanceof Error ? error.message : "Showing default content.",
        }),
      )
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [showToast]);

  function update<K extends keyof SectionHeaderData>(key: K, value: SectionHeaderData[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (draft.badgeText && draft.badgeText.length > 80) next.badgeText = "Maximum 80 characters.";
    if (!draft.heading.trim()) next.heading = "Heading is required.";
    if (draft.heading.length > 100) next.heading = "Maximum 100 characters.";
    if (draft.description && draft.description.length > 280) next.description = "Maximum 280 characters.";
    setErrors(next);
    return !Object.keys(next).length;
  }

  async function save() {
    if (!validate()) return;
    setSaving(true);
    try {
      const body: SectionHeaderUpsertPayload = {
        badgeText: draft.badgeText?.trim() || null,
        heading: draft.heading.trim(),
        description: draft.description?.trim() || null,
        buttonText: null,
        buttonUrl: draft.buttonUrl?.trim() || null,
        backgroundImage: draft.backgroundImage?.trim() || null,
      };
      const response = await fetch("/api/admin/section-headers/VISION", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as ApiResponse<SectionHeaderData>;
      if (!response.ok || !payload.success) throw new Error(payload.error ?? payload.message);
      const next = payload.data ?? { ...draft, updatedAt: new Date().toISOString() };
      setSaved(next);
      setDraft(next);
      setIsModalOpen(false);
      showToast({
        tone: "success",
        title: "Our Vision Header Updated",
        description: "The Vision section header has been saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Unable to save header",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setDraft(saved);
    setErrors({});
    setShowDiscardDialog(false);
  }

  if (loading) return <LoadingSkeleton rows={6} />;

  const hasChanges = JSON.stringify(saved) !== JSON.stringify(draft);

  // Resolve the background image URL for the live preview
  const bgImageUrl = draft.backgroundImage?.trim() || null;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Our Vision Header"
        description="Edit Section Badge, Main Heading, Subheading/Quote, Section Image, and Background Image."
        action={
          <div className="flex items-center gap-3">
            <AdminButton
              variant="secondary"
              onClick={() => setShowDiscardDialog(true)}
              disabled={!hasChanges || saving}
            >
              Discard
            </AdminButton>
            <AdminButton onClick={() => void save()} disabled={saving || !hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </AdminButton>
          </div>
        }
      />

      {/* Live Preview Card */}
      <AdminCard className="overflow-hidden p-4 md:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
              Live Preview
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-600">
              <Layers3 className="h-4 w-4" />
              Live Sync
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3.5 py-1.5 text-xs font-semibold text-pink-700">
              <Sparkles className="h-4 w-4" />
              Hover to Edit
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] bg-[#1C0D17] p-2 shadow-inner border border-[#2B1826]">
          <OverlayButton
            label="Edit Vision Header"
            active={isModalOpen}
            onClick={() => setIsModalOpen(true)}
            className="block w-full rounded-[20px] overflow-hidden"
          >
            {/* Section with optional background image */}
            <div className="relative bg-[#1C0D17] px-6 py-12 font-sans text-center md:px-12 md:py-16 min-h-[220px] flex flex-col items-center justify-center">
              {/* Background image layer */}
              {bgImageUrl ? (
                <div className="absolute inset-0">
                  <Image
                    src={bgImageUrl}
                    alt="Vision section background"
                    fill
                    unoptimized
                    className="object-cover opacity-30"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-[#1C0D17]/60" />
                </div>
              ) : null}

              {/* Content */}
              <div className="relative z-10 w-full">
                {draft.badgeText ? (
                  <div className="mb-6 inline-block rounded-full border border-[#5E4A47] bg-[#211A2533] px-4 py-1 shadow-sm">
                    <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#E68F17]">
                      {draft.badgeText}
                    </span>
                  </div>
                ) : null}
                <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.5rem] leading-tight md:leading-[1.15] mx-auto text-center">
                  {draft.heading || "The Enterprise AI Workforce Needs an Operating System"}
                </h1>
                {draft.description ? (
                  <p className="mt-5 text-base md:text-lg font-light text-[#EBEBEB] max-w-3xl mx-auto text-center leading-relaxed italic">
                    {draft.description}
                  </p>
                ) : null}

                {/* Background image badge in preview */}
                {bgImageUrl ? (
                  <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Background image active
                  </div>
                ) : (
                  <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[11px] font-medium text-white/50">
                    No background image — click to add one
                  </div>
                )}
              </div>
            </div>
          </OverlayButton>
        </div>
      </AdminCard>

      {/* Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Our Vision Header"
        description="Update badge text, main heading, quote/subheading, section image, and background image."
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Changes stay local until you click Save Changes.
            </div>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Section Badge"
            maxLength={80}
            value={draft.badgeText ?? ""}
            onChange={(e) => update("badgeText", e.target.value)}
            error={errors.badgeText}
            counter={`${(draft.badgeText ?? "").length}/80`}
            placeholder="OUR VISION"
          />
          <AdminInput
            label="Main Heading *"
            maxLength={100}
            value={draft.heading}
            onChange={(e) => update("heading", e.target.value)}
            error={errors.heading}
            counter={`${draft.heading.length}/100`}
            placeholder="The Enterprise AI Workforce Needs an Operating System"
          />
          <AdminTextarea
            label="Quote / Subheading"
            rows={3}
            maxLength={280}
            value={draft.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            error={errors.description}
            counter={`${(draft.description ?? "").length}/280`}
            placeholder="\u201cWe believe every enterprise will enhance itself with AI...\u201d"
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Images
            </p>
            <ImageUploadField
              label="Section Image (shown beside mission points)"
              value={draft.buttonUrl}
              folder="section-bg"
              aspectRatio="wide"
              onChange={(url) => update("buttonUrl", url)}
            />
            <ImageUploadField
              label="Header Background Image (optional — overlaid behind heading)"
              value={draft.backgroundImage}
              folder="section-bg"
              aspectRatio="wide"
              placeholderText="PNG, JPG, or WebP (max 5 MB) — renders at 30% opacity behind text"
              onChange={(url) => update("backgroundImage", url)}
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={showDiscardDialog}
        title="Discard all unsaved changes?"
        description="This will restore the last saved vision header content."
        confirmLabel="Discard All"
        onConfirm={handleDiscard}
        onClose={() => setShowDiscardDialog(false)}
      />
    </div>
  );
}
