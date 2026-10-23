"use client";

import Link from "next/link";
import { ArrowRight, Edit3, GripVertical, Layers3, Pencil, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminTableToolbar,
  AdminTextarea,
  ConfirmDialog,
  LoadingSkeleton,
  Modal,
  SearchField,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { cn } from "@/src/lib/utils";
import type {
  ApiResponse,
  HomeUseCaseCardDisplayOrderPayload,
  HomeUseCaseCardRow,
  HomeUseCaseHeader,
  HomeUseCaseHeaderUpsertPayload,
  ListData,
  SelectOption,
} from "@/src/types/admin-api";

const DEFAULT_HEADER: HomeUseCaseHeader = {
  id: 0,
  badgeText: "USE CASES",
  heading: "Leaderboard of WiiZ Built AI Agents",
  description: "Examples of AI agents built on WiiZ for real enterprise workflows.",
  buttonText: "View All Agents",
  buttonUrl: "/ai-agents",
  createdAt: "",
  updatedAt: "",
};

type FormState = {
  id: number;
  useCaseId: string;
};

function createEmptyForm(): FormState {
  return {
    id: 0,
    useCaseId: "",
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

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
        active && "ring-2 ring-secondary/80",
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

function SectionBlockHeading({
  index,
  title,
  description,
  action,
}: {
  index: number;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-500">{description}</p>
        </div>
      </div>
      <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">{action}</div>
    </div>
  );
}

export default function AdminHomeUseCasesPage() {
  const { showToast } = useAdminToast();

  // ---- Section 1: Use Cases Header ---- //
  const [saved, setSaved] = useState<HomeUseCaseHeader>(DEFAULT_HEADER);
  const [draft, setDraft] = useState<HomeUseCaseHeader>(DEFAULT_HEADER);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerSaving, setHeaderSaving] = useState(false);
  const [headerErrors, setHeaderErrors] = useState<Record<string, string>>({});
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // ---- Section 2: Home Use Case Cards ---- //
  const [rows, setRows] = useState<HomeUseCaseCardRow[]>([]);
  const [useCaseOptions, setUseCaseOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(createEmptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const requestRef = useRef<AbortController | null>(null);
  const dragRowIdRef = useRef<number | null>(null);
  const canAddMore = rows.length < 3;

  useEffect(() => {
    let active = true;
    fetch("/api/admin/home-use-case-header", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<HomeUseCaseHeader | null>;
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error || payload.message);
        }
        if (active) {
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
        if (active) setHeaderLoading(false);
      });
    return () => {
      active = false;
    };
  }, [showToast]);

  function updateHeader<K extends keyof HomeUseCaseHeader>(key: K, value: HomeUseCaseHeader[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setHeaderErrors((current) => ({ ...current, [key]: "" }));
  }

  function validateHeader() {
    const next: Record<string, string> = {};
    if (!draft.badgeText.trim()) next.badgeText = "Badge text is required.";
    if (draft.badgeText.length > 60) next.badgeText = "Maximum 60 characters.";
    if (!draft.heading.trim()) next.heading = "Heading is required.";
    if (draft.heading.length > 113) next.heading = "Maximum 113 characters.";
    if (!draft.description.trim()) next.description = "Description is required.";
    if (draft.description.length > 154) next.description = "Maximum 154 characters.";
    if (!draft.buttonText.trim()) next.buttonText = "Button text is required.";
    if (draft.buttonText.length > 60) next.buttonText = "Maximum 60 characters.";
    if (!draft.buttonUrl.trim()) next.buttonUrl = "Button URL is required.";
    setHeaderErrors(next);
    return !Object.keys(next).length;
  }

  async function saveHeader() {
    if (!validateHeader()) return;
    setHeaderSaving(true);
    try {
      const body: HomeUseCaseHeaderUpsertPayload = {
        id: draft.id,
        badgeText: draft.badgeText.trim(),
        heading: draft.heading.trim(),
        description: draft.description.trim(),
        buttonText: draft.buttonText.trim(),
        buttonUrl: draft.buttonUrl.trim(),
      };
      const response = await fetch("/api/admin/home-use-case-header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as ApiResponse<{ id: number }>;
      if (!response.ok || !payload.success) throw new Error(payload.error || payload.message);
      const next = { ...draft, id: payload.data?.id ?? draft.id, updatedAt: new Date().toISOString() };
      setSaved(next);
      setDraft(next);
      setHeaderModalOpen(false);
      showToast({
        tone: "success",
        title: "Use Cases Header updated",
        description: "The homepage header was saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Unable to save header",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setHeaderSaving(false);
    }
  }

  function handleDiscard() {
    setDraft(saved);
    setHeaderErrors({});
    setShowDiscardDialog(false);
  }

  const loadRows = useCallback(async (query: string) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/home-use-case-cards/list", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: query.trim() }),
      });

      const payload = (await response.json()) as ApiResponse<ListData<HomeUseCaseCardRow>>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to load home use cases.");
      }

      setRows(payload.data.result);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      showToast({
        tone: "error",
        title: "Home use cases unavailable",
        description: error instanceof Error ? error.message : "Unable to load home use cases.",
      });
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [showToast]);

  const loadUseCaseOptions = useCallback(async () => {
    setOptionsLoading(true);

    try {
      const response = await fetch("/api/admin/use-cases/combo", {
        method: "GET",
      });

      const payload = (await response.json()) as ApiResponse<SelectOption[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to load use case options.");
      }

      setUseCaseOptions(payload.data);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Use cases unavailable",
        description: error instanceof Error ? error.message : "Unable to load use case options.",
      });
    } finally {
      setOptionsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadRows(search);
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [loadRows, search]);

  useEffect(() => {
    void loadUseCaseOptions();
    return () => {
      requestRef.current?.abort();
    };
  }, [loadUseCaseOptions]);

  function resetEditor() {
    setForm(createEmptyForm());
    setErrors({});
  }

  function openCreate() {
    if (!canAddMore) {
      showToast({
        tone: "error",
        title: "Limit reached",
        description: "Only 3 home use cases can be added for now.",
      });
      return;
    }

    resetEditor();
    setModalOpen(true);
  }

  function openEdit(row: HomeUseCaseCardRow) {
    setForm({
      id: row.id,
      useCaseId: String(row.useCaseId),
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.useCaseId) {
      nextErrors.useCaseId = "Use case is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/home-use-case-cards/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id || undefined,
          useCaseId: Number(form.useCaseId),
          displayOrder: form.id > 0
            ? rows.find((item) => item.id === form.id)?.displayOrder ?? rows.length
            : rows.length,
          isActive: true,
        }),
      });

      const payload = (await response.json()) as ApiResponse<{ id: number; action: "created" | "updated" }>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to save home use case.");
      }

      await loadRows(search);
      setModalOpen(false);
      resetEditor();
      showToast({
        tone: "success",
        title: form.id > 0 ? "Home use case updated" : "Home use case created",
        description: "The homepage use case binding was saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save home use case.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/home-use-case-cards/${deleteId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as ApiResponse<{ deletedId: number }>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Unable to delete home use case.");
      }

      setDeleteId(null);
      await loadRows(search);
      showToast({
        tone: "success",
        title: "Home use case deleted",
        description: "The homepage use case binding was removed successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete home use case.",
      });
    }
  }

  async function persistRowOrder(nextRows: HomeUseCaseCardRow[]) {
    setReordering(true);

    try {
      const response = await fetch("/api/admin/home-use-case-cards/display-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: nextRows.map((row, index) => ({
            id: row.id,
            displayOrder: index,
          })),
        } satisfies HomeUseCaseCardDisplayOrderPayload),
      });

      const payload = (await response.json()) as ApiResponse<{ updatedCount: number }>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to update home use case order.");
      }

      setRows(nextRows.map((row, index) => ({ ...row, displayOrder: index })));
      showToast({
        tone: "success",
        title: "Order updated",
        description: "Home use case order was saved successfully.",
      });
    } catch (error) {
      await loadRows(search);
      showToast({
        tone: "error",
        title: "Unable to reorder",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setReordering(false);
      dragRowIdRef.current = null;
    }
  }

  function handleDragStart(rowId: number) {
    dragRowIdRef.current = rowId;
  }

  function handleDrop(targetRowId: number) {
    const draggedRowId = dragRowIdRef.current;
    if (!draggedRowId || draggedRowId === targetRowId || reordering) {
      dragRowIdRef.current = null;
      return;
    }

    const currentRows = [...rows];
    const fromIndex = currentRows.findIndex((row) => row.id === draggedRowId);
    const toIndex = currentRows.findIndex((row) => row.id === targetRowId);

    if (fromIndex < 0 || toIndex < 0) {
      dragRowIdRef.current = null;
      return;
    }

    const [movedRow] = currentRows.splice(fromIndex, 1);
    currentRows.splice(toIndex, 0, movedRow);
    setRows(currentRows.map((row, index) => ({ ...row, displayOrder: index })));
    void persistRowOrder(currentRows);
  }

  const hasHeaderChanges = JSON.stringify(saved) !== JSON.stringify(draft);

  return (
    <div className="space-y-10">
      {/* ============================= Section 1: Header ============================= */}
      <section className="space-y-4">
        <SectionBlockHeading
          index={1}
          title="Use Cases Header"
          description="Badge, heading, description, and CTA button shown above the card grid."
          action={
            <>
              <AdminButton
                variant="secondary"
                onClick={() => setShowDiscardDialog(true)}
                disabled={!hasHeaderChanges || headerSaving}
              >
                Discard
              </AdminButton>
              <AdminButton onClick={() => void saveHeader()} disabled={headerSaving || !hasHeaderChanges}>
                <Save className="mr-2 h-4 w-4" />
                {headerSaving ? "Saving..." : "Save Changes"}
              </AdminButton>
            </>
          }
        />

        {headerLoading ? (
          <LoadingSkeleton rows={4} />
        ) : (
          <AdminCard className="overflow-hidden p-4 md:p-6">
            <div className="mb-5 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Live Preview</div>
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

            <div className="overflow-hidden rounded-[24px] border border-[#2B1826] bg-[#1C0D17] p-2 shadow-inner">
              <OverlayButton
                label="Edit Section Header"
                active={headerModalOpen}
                onClick={() => setHeaderModalOpen(true)}
                className="block w-full rounded-[20px] bg-[#1C0D17] px-6 py-10 font-sans md:px-12 md:py-14"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div className="flex flex-col items-start max-w-3xl">
                    <div className="mb-4 inline-block rounded-full border border-[#5E4A47] bg-[#211A2533] px-4 py-1">
                      <span className="text-[12px] font-bold uppercase tracking-widest text-[#E68F17]">
                        {draft.badgeText || "USE CASES"}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.6rem] leading-tight">
                      {draft.heading || "Leaderboard of WiiZ Built AI Agents"}
                    </h2>
                    <p className="mt-3 text-base font-light text-[#EBEBEB] md:text-lg">
                      {draft.description || "Examples of AI agents built on WiiZ for real enterprise workflows."}
                    </p>
                  </div>

                  <Link
                    href={draft.buttonUrl || "#"}
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#E68F17] px-6 py-2.5 text-sm font-semibold text-[#E68F17] transition-all group hover:bg-[#E68F17] hover:text-[#1C0D17]"
                  >
                    {draft.buttonText || "View All Agents"}
                    <ArrowRight className="ml-2 h-4 w-4 text-[#E68F17] transition-transform group-hover:translate-x-0.5 group-hover:text-[#1C0D17]" />
                  </Link>
                </div>
              </OverlayButton>
            </div>
          </AdminCard>
        )}
      </section>

      {/* ============================= Section 2: Cards ============================= */}
      <section className="space-y-4">
        <SectionBlockHeading
          index={2}
          title="Home Use Case Cards"
          description="Bind use cases as cards inside the WiiZ Built AI Agents section. Up to three, reorderable from the list."
          action={
            <AdminButton onClick={openCreate} disabled={optionsLoading || !canAddMore} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Home Use Case
            </AdminButton>
          }
        />

        {reordering ? (
          <div className="rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Saving home use case order...
          </div>
        ) : null}

        <AdminDataTable
          rows={rows}
          loading={loading}
          rowKey={(row) => String(row.id)}
          emptyTitle="No home use cases found"
          emptyDescription="Add homepage use case cards for the WiiZ Built AI Agents section."
          rowProps={(row) => ({
            draggable: !reordering,
            onDragStart: () => handleDragStart(row.id),
            onDragOver: (event) => event.preventDefault(),
            onDrop: () => handleDrop(row.id),
            className: "cursor-grab active:cursor-grabbing",
          })}
          toolbar={
            <AdminTableToolbar
              search={
                <div className="max-w-[420px]">
                  <SearchField
                    value={search}
                    onChange={setSearch}
                    placeholder="Search use case title or slug"
                  />
                </div>
              }
            />
          }
          columns={[
            {
              key: "order",
              label: "Order",
              render: (row) => (
                <div className="flex items-center gap-2 font-medium text-slate-600">
                  <GripVertical className="h-4 w-4 cursor-grab text-slate-400" />
                  <span>{row.displayOrder + 1}</span>
                </div>
              ),
            },
            {
              key: "useCase",
              label: "Use Case",
              sortable: true,
              sortValue: (row) => row.useCaseTitle,
              render: (row) => <div className="font-semibold text-slate-950">{row.useCaseTitle}</div>,
            },
            {
              key: "slug",
              label: "Slug",
              sortable: true,
              sortValue: (row) => row.useCaseSlug ?? "",
              render: (row) => <span className="text-sm text-slate-500">{row.useCaseSlug || "-"}</span>,
            },
            {
              key: "date",
              label: "Date",
              sortable: true,
              sortValue: (row) => row.createdAt,
              render: (row) => <span className="text-sm text-slate-500">{formatDate(row.createdAt)}</span>,
            },
            {
              key: "actions",
              label: "Actions",
              className: "w-[120px]",
              render: (row) => (
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                    onClick={() => openEdit(row)}
                    aria-label="Edit home use case"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4 stroke-[1.9]" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => setDeleteId(row.id)}
                    aria-label="Delete home use case"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 stroke-[1.9]" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* ============================= Modals & Dialogs ============================= */}
      <Modal
        open={headerModalOpen}
        onClose={() => setHeaderModalOpen(false)}
        title="Edit Use Cases Header"
        description="Update the badge, heading, description, and button properties."
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">Changes stay local until you click Save Changes.</div>
            <AdminButton variant="secondary" onClick={() => setHeaderModalOpen(false)}>
              Close
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Section Badge"
            maxLength={60}
            value={draft.badgeText}
            onChange={(event) => updateHeader("badgeText", event.target.value)}
            error={headerErrors.badgeText}
            counter={`${(draft.badgeText || "").length}/60 characters (including spaces)`}
            placeholder="USE CASES"
          />
          <AdminInput
            label="Main Heading"
            maxLength={113}
            value={draft.heading}
            onChange={(event) => updateHeader("heading", event.target.value)}
            error={headerErrors.heading}
            counter={`${(draft.heading || "").length}/113 characters (including spaces)`}
            placeholder="Leaderboard of WiiZ Built AI Agents"
          />
          <AdminTextarea
            label="Description"
            maxLength={154}
            value={draft.description}
            onChange={(event) => updateHeader("description", event.target.value)}
            error={headerErrors.description}
            counter={`${(draft.description || "").length}/154 characters (including spaces)`}
            placeholder="Examples of AI agents built on WiiZ for real enterprise workflows."
          />
          <AdminInput
            label="Button Text"
            maxLength={60}
            value={draft.buttonText}
            onChange={(event) => updateHeader("buttonText", event.target.value)}
            error={headerErrors.buttonText}
            counter={`${(draft.buttonText || "").length}/60 characters (including spaces)`}
            placeholder="View All Agents"
          />
          <AdminInput
            label="Button URL"
            value={draft.buttonUrl}
            onChange={(event) => updateHeader("buttonUrl", event.target.value)}
            error={headerErrors.buttonUrl}
            placeholder="/ai-agents"
          />
        </div>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => {
          if (saving) {
            return;
          }
          setModalOpen(false);
        }}
        title={form.id > 0 ? "Edit Home Use Case" : "Add Home Use Case"}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving || optionsLoading}>
              {saving ? "Saving..." : form.id > 0 ? "Save Changes" : "Save Home Use Case"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-[14px] border border-slate-200 bg-slate-50/80 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">Homepage slot binding</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Pick one use case to show inside the &quot;WiiZ Built AI Agents&quot; section. You can add up to three cards and reorder them from the list.
            </p>
          </div>

          <div className="rounded-[14px] border border-slate-200 bg-white px-4 py-4">
            <AdminSelect
              label="Use Case"
              value={form.useCaseId}
              onChange={(event) => setForm((current) => ({ ...current, useCaseId: event.target.value }))}
              error={errors.useCaseId}
              disabled={optionsLoading}
              className="py-2.5"
            >
              <option value="">Select use case</option>
              {useCaseOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </AdminSelect>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={showDiscardDialog}
        title="Discard all unsaved changes?"
        description="This will restore the last saved header content."
        confirmLabel="Discard All"
        onConfirm={handleDiscard}
        onClose={() => setShowDiscardDialog(false)}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
        title="Delete home use case?"
        description="This will remove the selected homepage use case binding."
        confirmLabel="Delete"
      />
    </div>
  );
}