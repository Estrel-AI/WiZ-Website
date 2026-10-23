"use client";

import Image from "next/image";
import { Edit3, Layers3, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageUploadField } from "@/src/components/admin/admin-image-upload";
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
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { cn } from "@/src/lib/utils";
import type { ApiResponse, SectionHeaderData, SectionHeaderUpsertPayload } from "@/src/types/admin-api";

type PartnerButtonsConfig = {
  primaryText: string;
  primaryUrl: string;
  secondaryText: string;
  secondaryUrl: string;
};

function parsePartnerButtons(raw: string | null): PartnerButtonsConfig {
  if (raw && raw.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return {
        primaryText: typeof parsed.primaryText === "string" ? parsed.primaryText : "Explore and Apply",
        primaryUrl: typeof parsed.primaryUrl === "string" ? parsed.primaryUrl : "#pathway",
        secondaryText: typeof parsed.secondaryText === "string" ? parsed.secondaryText : "Find a Partner",
        secondaryUrl: typeof parsed.secondaryUrl === "string" ? parsed.secondaryUrl : "#find-partner",
      };
    } catch {
      // ignore malformed JSON
    }
  }
  return {
    primaryText: raw || "Explore and Apply",
    primaryUrl: "#pathway",
    secondaryText: "Find a Partner",
    secondaryUrl: "#find-partner",
  };
}

const DEFAULT_HEADER: SectionHeaderData = {
  id: 0,
  sectionKey: "PARTNER_HEADER",
  badgeText: null,
  heading: "Become a Partner",
  description:
    "Partner with us and empower your customers by supporting them in simplifying their AI journey and how they can leverage Agentic AI with Governance and Orchestration.",
  buttonText: JSON.stringify({
    primaryText: "Explore and Apply",
    primaryUrl: "#pathway",
    secondaryText: "Find a Partner",
    secondaryUrl: "#find-partner",
  }),
  buttonUrl: "/api/assets/dummy_image/partners-banner-img.jpg",
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
        "group relative block w-full rounded-3xl border border-dashed border-transparent text-left transition focus:outline-none hover:border-white/30 cursor-pointer",
        active && "ring-2 ring-[#98235f]",
        className,
      )}
    >
      <span className="pointer-events-none absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full bg-black/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus:opacity-100 shadow-md">
        <Edit3 className="h-3.5 w-3.5 text-[#E68F17]" />
        {label}
      </span>
      {children}
    </button>
  );
}

export default function AdminPartnerHeaderPage() {
  const { showToast } = useAdminToast();
  const [saved, setSaved] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [draft, setDraft] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [buttons, setButtons] = useState<PartnerButtonsConfig>(parsePartnerButtons(DEFAULT_HEADER.buttonText));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/section-headers/PARTNER_HEADER", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<SectionHeaderData | null>;
        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? payload.message);
        }
        if (active && payload.data) {
          setSaved(payload.data);
          setDraft(payload.data);
          setButtons(parsePartnerButtons(payload.data.buttonText));
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

  function updateButton<K extends keyof PartnerButtonsConfig>(key: K, value: string) {
    const nextButtons = { ...buttons, [key]: value };
    setButtons(nextButtons);
    update("buttonText", JSON.stringify(nextButtons));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!draft.heading.trim()) next.heading = "Heading is required.";
    if (draft.heading.length > 55) next.heading = "Maximum 55 characters.";
    if (draft.description && draft.description.length > 320) next.description = "Maximum 320 characters.";
    if (buttons.primaryText.trim().length > 50) next.primaryButton = "Maximum 50 characters.";
    if (buttons.secondaryText.trim().length > 15) next.secondaryButton = "Maximum 15 characters.";
    setErrors(next);
    return !Object.keys(next).length;
  }

  async function save() {
    if (!validate()) return;
    setSaving(true);
    try {
      const body: SectionHeaderUpsertPayload = {
        badgeText: null,
        heading: draft.heading.trim(),
        description: draft.description?.trim() || null,
        buttonText: JSON.stringify(buttons),
        buttonUrl: draft.buttonUrl?.trim() || "/api/assets/dummy_image/partners-banner-img.jpg",
        backgroundImage: draft.backgroundImage?.trim() || null,
      };
      const response = await fetch("/api/admin/section-headers/PARTNER_HEADER", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as ApiResponse<SectionHeaderData>;
      if (!response.ok || !payload.success) throw new Error(payload.error ?? payload.message);
      const next = payload.data ?? {
        ...draft,
        buttonText: JSON.stringify(buttons),
        updatedAt: new Date().toISOString(),
      };
      setSaved(next);
      setDraft(next);
      setIsModalOpen(false);
      showToast({
        tone: "success",
        title: "Partner Header Updated",
        description: "Partner banner header and buttons have been saved successfully.",
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
    setButtons(parsePartnerButtons(saved.buttonText));
    setErrors({});
    setShowDiscardDialog(false);
  }

  if (loading) return <LoadingSkeleton rows={6} />;

  const hasChanges = JSON.stringify(saved) !== JSON.stringify(draft);
  const bgImageUrl = draft.backgroundImage?.trim() || null;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Partner Banner Header"
        description="Edit heading, subheading, primary & secondary button texts & links, banner image, and background image."
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

      {/* Live Preview */}
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

        <div className="overflow-hidden rounded-[24px] bg-gradient-to-r from-[#1C0D17] via-[#2B1123] to-[#1C0D17] p-2 shadow-inner border border-[#3A1830]">
          <OverlayButton
            label="Edit Partner Banner"
            active={isModalOpen}
            onClick={() => setIsModalOpen(true)}
            className="block w-full rounded-[20px] overflow-hidden"
          >
            <div className="relative bg-gradient-to-r from-[#1C0D17] via-[#2B1123] to-[#1C0D17] px-6 py-10 md:px-12 md:py-14 font-sans">
              {/* Background image layer */}
              {bgImageUrl ? (
                <div className="absolute inset-0">
                  <Image
                    src={bgImageUrl}
                    alt="Partner banner background"
                    fill
                    unoptimized
                    className="object-cover opacity-20"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1C0D17]/80 via-[#2B1123]/70 to-[#1C0D17]/80" />
                </div>
              ) : null}

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
                <div className="w-full lg:w-1/2 text-left">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
                    {draft.heading || "Become a Partner"}
                  </h1>
                  {draft.description ? (
                    <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
                      {draft.description}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B83B76] to-[#882456] px-6 py-3 text-sm font-semibold text-white shadow-lg">
                      {buttons.primaryText} ↗
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#E68F17] bg-[#1C0D17] px-6 py-3 text-sm font-semibold text-white shadow-lg">
                      {buttons.secondaryText} ↗
                    </span>
                  </div>

                  {/* Background image badge */}
                  {bgImageUrl ? (
                    <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Background image active
                    </div>
                  ) : (
                    <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[11px] font-medium text-white/50">
                      No background image — click to add one
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-1/2">
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 aspect-[4/3] shadow-2xl bg-slate-900">
                    <img
                      src={draft.buttonUrl || "/api/assets/dummy_image/partners-banner-img.jpg"}
                      alt="Partner Banner"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </OverlayButton>
        </div>
      </AdminCard>

      {/* Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Partner Banner Header"
        description="Update heading, subheading, primary/secondary button labels & URLs, banner image, and background image."
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
            label="Main Heading *"
            maxLength={55}
            value={draft.heading}
            onChange={(e) => update("heading", e.target.value)}
            error={errors.heading}
            counter={`${draft.heading.length}/55`}
            placeholder="Become a Partner"
          />
          <AdminTextarea
            label="Subheading Description"
            rows={3}
            maxLength={320}
            value={draft.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            error={errors.description}
            counter={`${(draft.description ?? "").length}/320`}
            placeholder="Partner with us and empower your customers..."
          />

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#98235f] block">
                Primary Button (Pill 1)
              </span>
              <AdminInput
                label="Button Text"
                value={buttons.primaryText}
                onChange={(e) => updateButton("primaryText", e.target.value)}
                error={errors.primaryButton}
                maxLength={50}
                counter={`${buttons.primaryText.length}/50`}
                placeholder="Explore and Apply"
              />
              <AdminInput
                label="Button Target URL / Section"
                value={buttons.primaryUrl}
                onChange={(e) => updateButton("primaryUrl", e.target.value)}
                placeholder="#pathway or https://..."
              />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E68F17] block">
                Secondary Button (Pill 2)
              </span>
              <AdminInput
                label="Button Text"
                value={buttons.secondaryText}
                onChange={(e) => updateButton("secondaryText", e.target.value)}
                error={errors.secondaryButton}
                maxLength={15}
                counter={`${buttons.secondaryText.length}/15`}
                placeholder="Find a Partner"
              />
              <AdminInput
                label="Button Target URL / Section"
                value={buttons.secondaryUrl}
                onChange={(e) => updateButton("secondaryUrl", e.target.value)}
                placeholder="#find-partner or https://..."
              />
            </div>
          </div>

          {/* Images */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Images</p>
            <ImageUploadField
              label="Hero Banner Image (shown beside the text)"
              value={draft.buttonUrl}
              folder="section-bg"
              aspectRatio="wide"
              onChange={(url) => update("buttonUrl", url)}
            />
            <ImageUploadField
              label="Page Background Image (optional — overlaid behind the full banner)"
              value={draft.backgroundImage}
              folder="section-bg"
              aspectRatio="wide"
              placeholderText="PNG, JPG, or WebP (max 5 MB) — renders at 20% opacity behind content"
              onChange={(url) => update("backgroundImage", url)}
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={showDiscardDialog}
        title="Discard all unsaved changes?"
        description="This will restore the last saved partner banner content."
        confirmLabel="Discard All"
        onConfirm={handleDiscard}
        onClose={() => setShowDiscardDialog(false)}
      />
    </div>
  );
}
