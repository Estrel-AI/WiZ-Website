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

const DEFAULT_HEADER: SectionHeaderData = {
  id: 0,
  sectionKey: "AI_AGENTS_HEADER",
  badgeText: null,
  heading: "Pre-Built Enterprise AI Agents",
  description:
    "Explore industries, business functions, and practical AI use cases designed to turn high-value workflows into clear implementation paths.",
  buttonText: "Explore Pre-Built Enterprise AI Agents by Industry",
  buttonUrl: "Explore use cases by industries, business functions, and practical AI use cases designed to turn high-value workflows into clear implementation paths.",
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
      <span className="pointer-events-none absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full bg-black/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus:opacity-100 shadow-md">
        <Edit3 className="h-3.5 w-3.5 text-[#E68F17]" />
        {label}
      </span>
      {children}
    </button>
  );
}

export default function AdminAiAgentsHeaderPage() {
  const { showToast } = useAdminToast();
  const [saved, setSaved] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [draft, setDraft] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/section-headers/AI_AGENTS_HEADER", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<SectionHeaderData | null>;
        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? payload.message);
        }
        if (active && payload.data) {
          const data = {
            ...payload.data,
            heading: payload.data.heading || DEFAULT_HEADER.heading,
            description: payload.data.description || DEFAULT_HEADER.description,
            buttonText: payload.data.buttonText || DEFAULT_HEADER.buttonText,
            buttonUrl: payload.data.buttonUrl || DEFAULT_HEADER.buttonUrl,
          };
          setSaved(data);
          setDraft(data);
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
    if (!draft.heading.trim()) next.heading = "Heading is required.";
    if (draft.heading.length > 100) next.heading = "Maximum 100 characters.";
    if (draft.description && draft.description.length > 250) next.description = "Maximum 250 characters.";
    if (draft.buttonText && draft.buttonText.length > 100) next.buttonText = "Maximum 100 characters.";
    if (draft.buttonUrl && draft.buttonUrl.length > 300) next.buttonUrl = "Maximum 300 characters.";
    setErrors(next);
    return !Object.keys(next).length;
  }

  async function handleSave() {
    if (!validate()) {
      setIsHeaderModalOpen(true);
      return;
    }

    setSaving(true);
    try {
      const body: SectionHeaderUpsertPayload = {
        sectionKey: "AI_AGENTS_HEADER",
        badgeText: null,
        heading: draft.heading.trim(),
        description: draft.description?.trim() || null,
        buttonText: draft.buttonText?.trim() || null,
        buttonUrl: draft.buttonUrl?.trim() || null,
        backgroundImage: draft.backgroundImage?.trim() || null,
      };

      const response = await fetch("/api/admin/section-headers/AI_AGENTS_HEADER", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = (await response.json()) as ApiResponse<SectionHeaderData>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error ?? payload.message ?? "Failed to update AI Agents header.");
      }

      setSaved(payload.data);
      setDraft(payload.data);
      setIsHeaderModalOpen(false);
      setIsCardModalOpen(false);
      showToast({
        tone: "success",
        title: "Settings updated",
        description: "AI Agents page settings saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not save settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setDraft(saved);
    setErrors({});
    setShowDiscardDialog(false);
    showToast({
      tone: "error",
      title: "Changes discarded",
      description: "Restored previous saved content.",
    });
  }

  if (loading) return <LoadingSkeleton rows={4} />;

  const hasChanges = JSON.stringify(saved) !== JSON.stringify(draft);
  const bgImageUrl = draft.backgroundImage?.trim() || null;
  const cardHeading = draft.buttonText?.trim() || "";
  const cardDescription = draft.buttonUrl?.trim() || "";

  return (
    <div className="space-y-6">
      <SectionHeader
        title="AI Agents Header Editor"
        description="Manage the hero header and card section content displayed on the AI Agents page."
        action={
          <div className="flex items-center gap-3">
            {hasChanges ? (
              <AdminButton variant="secondary" onClick={() => setShowDiscardDialog(true)} disabled={saving}>
                Discard
              </AdminButton>
            ) : null}
            <AdminButton onClick={() => void handleSave()} disabled={saving || !hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </AdminButton>
          </div>
        }
      />

      {/* Hero Header Preview */}
      <AdminCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#98235f]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Hero Header</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-600">
              <Layers3 className="h-4 w-4" />
              Live Sync
            </span>
            <AdminButton variant="secondary" onClick={() => setIsHeaderModalOpen(true)} className="text-xs">
              <Edit3 className="mr-1.5 h-4 w-4" />
              Edit Header
            </AdminButton>
          </div>
        </div>

        <OverlayButton label="Click to Edit Hero Header" onClick={() => setIsHeaderModalOpen(true)}>
          <div className="relative flex flex-col items-center justify-center min-h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#2B1123] via-[#210D1B] to-[#1D0C18] px-6 py-14 text-center shadow-lg">
            {bgImageUrl ? (
              <div className="absolute inset-0">
                <Image
                  src={bgImageUrl}
                  alt="AI Agents header background"
                  fill
                  unoptimized
                  className="object-cover opacity-25"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2B1123]/70 via-[#210D1B]/70 to-[#1D0C18]/70" />
              </div>
            ) : (
              <>
                <div className="absolute left-0 top-1/2 h-[100%] w-[240%] -translate-x-1/2 -translate-y-1/2 bg-[url('/texture.svg')] bg-cover bg-center opacity-100 pointer-events-none md:w-[160%] [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)]" />
                <div className="absolute right-0 top-1/2 h-[100%] w-[240%] translate-x-1/2 -translate-y-1/2 bg-[url('/texture.svg')] bg-cover bg-center opacity-100 pointer-events-none md:w-[160%] [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)]" />
              </>
            )}
            <div className="absolute -top-[230px] left-1/2 h-[520px] w-[620px] -translate-x-1/2 rounded-full bg-gradient-about blur-[200px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-4xl space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
                {draft.heading || "Pre-Built Enterprise AI Agents"}
              </h1>
              {draft.description ? (
                <p className="text-base md:text-lg text-[#FDFDFD] max-w-3xl mx-auto leading-relaxed">
                  {draft.description}
                </p>
              ) : null}

              {bgImageUrl ? (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Background image active
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[11px] font-medium text-white/50">
                  No background image — click to add one
                </div>
              )}
            </div>
          </div>
        </OverlayButton>
      </AdminCard>

      {/* Card Section Preview */}
      <AdminCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#98235f]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Industry Card Section</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-600">
              <Layers3 className="h-4 w-4" />
              Live Sync
            </span>
            <AdminButton variant="secondary" onClick={() => setIsCardModalOpen(true)} className="text-xs">
              <Edit3 className="mr-1.5 h-4 w-4" />
              Edit Card
            </AdminButton>
          </div>
        </div>

        <OverlayButton label="Click to Edit Card Section" onClick={() => setIsCardModalOpen(true)}>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
              {cardHeading || "Explore Pre-Built Enterprise AI Agents by Industry"}
            </h2>
            {cardDescription ? (
              <p className="mb-5 max-w-3xl text-sm leading-relaxed text-gray-500 md:text-base">
                {cardDescription}
              </p>
            ) : null}
            <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Industries
              <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-200 to-transparent md:hidden" />
            </h3>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-secondary/50 bg-gradient-to-r from-[#912059] to-[#d63d75] px-5 py-2.5 text-xs font-semibold text-white shadow-sm">
                Banking and Financial Services
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-xs font-medium text-gray-700">
                Manufacturing
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-xs font-medium text-gray-700">
                Healthcare
              </span>
            </div>
          </div>
        </OverlayButton>
      </AdminCard>

      {/* Hero Header Edit Modal */}
      <Modal
        open={isHeaderModalOpen}
        onClose={() => setIsHeaderModalOpen(false)}
        title="Edit Hero Header"
        description="Update the heading, description, and background image for the hero section."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setIsHeaderModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : "Save Header"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Heading *"
            value={draft.heading}
            onChange={(e) => update("heading", e.target.value)}
            error={errors.heading}
            maxLength={100}
            counter={`${draft.heading.length}/100`}
            placeholder="Pre-Built Enterprise AI Agents"
          />
          <AdminTextarea
            label="Description / Subheading"
            rows={4}
            maxLength={250}
            value={draft.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            counter={`${(draft.description ?? "").length}/250`}
            placeholder="Explore industries, business functions, and practical AI use cases..."
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <ImageUploadField
              label="Background Image (optional — overlaid behind heading at 25% opacity)"
              value={draft.backgroundImage}
              folder="section-bg"
              aspectRatio="wide"
              placeholderText="PNG, JPG, or WebP (max 5 MB) — replaces the default texture pattern"
              onChange={(url) => update("backgroundImage", url ?? "")}
            />
          </div>
        </div>
      </Modal>

      {/* Card Section Edit Modal */}
      <Modal
        open={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        title="Edit Industry Card Section"
        description="Update the heading and description displayed in the card section above the industry tabs."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setIsCardModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : "Save Card"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Card Heading *"
            value={draft.buttonText ?? ""}
            onChange={(e) => update("buttonText", e.target.value || null)}
            error={errors.buttonText}
            maxLength={100}
            counter={`${(draft.buttonText ?? "").length}/100`}
            placeholder="Explore Pre-Built Enterprise AI Agents by Industry"
          />
          <AdminTextarea
            label="Card Description"
            rows={4}
            maxLength={300}
            value={draft.buttonUrl ?? ""}
            onChange={(e) => update("buttonUrl", e.target.value || null)}
            error={errors.buttonUrl}
            counter={`${(draft.buttonUrl ?? "").length}/300`}
            placeholder="Explore use cases by industries, business functions, and practical AI use cases..."
          />
        </div>
      </Modal>

      {/* Discard Dialog */}
      <ConfirmDialog
        open={showDiscardDialog}
        title="Discard Unsaved Changes?"
        description="Are you sure you want to discard your edits and revert to the saved version?"
        confirmLabel="Discard Changes"
        onConfirm={handleDiscard}
        onClose={() => setShowDiscardDialog(false)}
      />
    </div>
  );
}
