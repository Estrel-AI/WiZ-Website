"use client";

import { Edit3, GripVertical, Layers3, Pencil, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  SectionHeader,
  StatusConfirmModal,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { cn } from "@/src/lib/utils";
import type {
  ApiResponse,
  HomeFaqRow,
  SectionHeaderData,
  SectionHeaderUpsertPayload,
} from "@/src/types/admin-api";

const DEFAULT_HEADER: SectionHeaderData = {
  id: 0,
  sectionKey: "FAQ",
  badgeText: "FAQ",
  heading: "Frequently Asked Questions",
  description: "Find answers to commonly asked questions about WiiZ agentic AI platform.",
  buttonText: null,
  buttonUrl: null,
  createdAt: "",
  updatedAt: "",
};

type FaqFormState = {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
};

const EMPTY_FORM: FaqFormState = {
  id: 0,
  question: "",
  answer: "",
  displayOrder: 1,
  isActive: true,
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

export default function AdminFaqsPage() {
  const { showToast } = useAdminToast();

  const [headerSaved, setHeaderSaved] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerDraft, setHeaderDraft] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerSaving, setHeaderSaving] = useState(false);
  const [headerErrors, setHeaderErrors] = useState<Record<string, string>>({});
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [headerDiscardDialog, setHeaderDiscardDialog] = useState(false);

  const [rows, setRows] = useState<HomeFaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FaqFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const dragRowIdRef = useRef<number | null>(null);

  const [statusModalTarget, setStatusModalTarget] = useState<HomeFaqRow | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/section-headers/FAQ", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<SectionHeaderData | null>;
        if (!response.ok || !payload.success) {
          throw new Error(payload.error || payload.message);
        }
        if (active && payload.data) {
          setHeaderSaved(payload.data);
          setHeaderDraft(payload.data);
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

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/faqs", { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<HomeFaqRow[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to load FAQ items.");
      }
      setRows(payload.data);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load Error",
        description: error instanceof Error ? error.message : "Unable to fetch FAQs.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const isHeaderDirty = JSON.stringify(headerSaved) !== JSON.stringify(headerDraft);

  function validateHeader(data: SectionHeaderData) {
    const nextErrors: Record<string, string> = {};
    if (!data.heading.trim()) {
      nextErrors.heading = "Heading is required.";
    }
    setHeaderErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSaveHeader() {
    if (!validateHeader(headerDraft)) {
      showToast({
        tone: "error",
        title: "Validation error",
        description: "Please fix highlighted fields before saving.",
      });
      return;
    }

    setHeaderSaving(true);
    try {
      const payload: SectionHeaderUpsertPayload = {
        sectionKey: "FAQ",
        badgeText: headerDraft.badgeText?.trim() || null,
        heading: headerDraft.heading.trim(),
        description: headerDraft.description?.trim() || null,
        buttonText: headerDraft.buttonText?.trim() || null,
        buttonUrl: headerDraft.buttonUrl?.trim() || null,
      };

      const response = await fetch("/api/admin/section-headers/FAQ", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resPayload = (await response.json()) as ApiResponse<SectionHeaderData>;
      if (!response.ok || !resPayload.success || !resPayload.data) {
        throw new Error(resPayload.error || resPayload.message || "Failed to update header.");
      }

      setHeaderSaved(resPayload.data);
      setHeaderDraft(resPayload.data);
      setHeaderModalOpen(false);
      showToast({
        tone: "success",
        title: "FAQ Header Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save section header.",
      });
    } finally {
      setHeaderSaving(false);
    }
  }

  function handleCancelHeaderModal() {
    if (isHeaderDirty) {
      setHeaderDiscardDialog(true);
    } else {
      setHeaderModalOpen(false);
    }
  }

  function confirmDiscardHeader() {
    setHeaderDraft(headerSaved);
    setHeaderErrors({});
    setHeaderDiscardDialog(false);
    setHeaderModalOpen(false);
  }

  function openAddModal() {
    if (rows.length >= 5) {
      showToast({
        tone: "error",
        title: "Limit Reached",
        description: "A maximum of 5 FAQ questions is allowed.",
      });
      return;
    }
    const nextOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.displayOrder)) + 1 : 1;
    setForm({ ...EMPTY_FORM, displayOrder: nextOrder });
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(row: HomeFaqRow) {
    setForm({
      id: row.id,
      question: row.question,
      answer: row.answer,
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    if (!form.question.trim()) {
      nextErrors.question = "Question is required.";
    } else if (form.question.trim().length > 130) {
      nextErrors.question = "Maximum 130 characters.";
    }
    if (!form.answer.trim()) {
      nextErrors.answer = "Answer is required.";
    } else if (form.answer.trim().length > 345) {
      nextErrors.answer = "Maximum 345 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id > 0 ? form.id : undefined,
          question: form.question.trim(),
          answer: form.answer.trim(),
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<HomeFaqRow>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to save FAQ item.");
      }

      showToast({
        tone: "success",
        title: form.id > 0 ? "FAQ Updated" : "FAQ Created",
        description: `"${payload.data.question}" saved successfully.`,
      });

      setModalOpen(false);
      await loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save FAQ item.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/faqs/${deleteId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as ApiResponse<{ id: number }>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to delete FAQ item.");
      }

      showToast({
        tone: "success",
        title: "FAQ Deleted",
        description: "The FAQ item has been deleted.",
      });

      setDeleteId(null);
      await loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete FAQ item.",
      });
    }
  }

  async function persistRowOrder(nextRows: HomeFaqRow[]) {
    setReordering(true);
    try {
      const response = await fetch("/api/admin/faqs/display-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: nextRows.map((r, index) => ({ id: r.id, displayOrder: index + 1 })),
        }),
      });

      const payload = (await response.json()) as ApiResponse<null>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to save display order.");
      }

      showToast({
        tone: "success",
        title: "Order Updated",
        description: "FAQ display order saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Reorder Failed",
        description: error instanceof Error ? error.message : "Unable to persist order.",
      });
      await loadData();
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
    const nextRows = [...rows];
    const fromIndex = nextRows.findIndex((item) => item.id === draggedRowId);
    const toIndex = nextRows.findIndex((item) => item.id === targetRowId);
    if (fromIndex < 0 || toIndex < 0) return;
    const [moved] = nextRows.splice(fromIndex, 1);
    nextRows.splice(toIndex, 0, moved);
    const updatedRows = nextRows.map((item, index) => ({ ...item, displayOrder: index + 1 }));
    setRows(updatedRows);
    void persistRowOrder(updatedRows);
  }

  async function executeStatusToggle() {
    if (!statusModalTarget) return;
    const row = statusModalTarget;
    const nextActive = !row.isActive;
    setStatusUpdating(true);
    try {
      const response = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          question: row.question,
          answer: row.answer,
          displayOrder: row.displayOrder,
          isActive: nextActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<HomeFaqRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to update status.");
      }

      setRows((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, isActive: nextActive } : item)),
      );
      setStatusModalTarget(null);
      showToast({
        tone: "success",
        title: "Status updated",
        description: `FAQ item is now ${nextActive ? "active" : "inactive"}.`,
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Status update failed",
        description: error instanceof Error ? error.message : "Unable to toggle status.",
      });
    } finally {
      setStatusUpdating(false);
    }
  }

  const filteredRows = rows.filter((row) => {
    if (statusFilter === "active") return row.isActive;
    if (statusFilter === "inactive") return !row.isActive;
    return true;
  });

  const columns = [
    {
      key: "order",
      label: "Order",
      className: "w-20",
      render: (row: HomeFaqRow) => (
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600">
          <GripVertical className="h-4 w-4 cursor-grab text-slate-400 hover:text-slate-700" />
          <span>#{row.displayOrder}</span>
        </div>
      ),
    },
    {
      key: "question",
      label: "Question",
      sortable: true,
      sortValue: (row: HomeFaqRow) => row.question,
      render: (row: HomeFaqRow) => (
        <div className="max-w-md font-bold text-slate-900 line-clamp-2">
          {row.question}
        </div>
      ),
    },
    {
      key: "answer",
      label: "Answer",
      render: (row: HomeFaqRow) => (
        <p className="line-clamp-2 max-w-lg text-xs font-normal leading-relaxed text-slate-600">
          {row.answer}
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: HomeFaqRow) => (
        <button
          type="button"
          onClick={() => setStatusModalTarget(row)}
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#98235f]/40",
            row.isActive ? "bg-emerald-500" : "bg-slate-300",
          )}
          aria-label={`Set FAQ ${row.isActive ? "inactive" : "active"}`}
          aria-pressed={row.isActive}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 rounded-full bg-white transition-transform shadow-xs",
              row.isActive ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-28 text-right",
      render: (row: HomeFaqRow) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            aria-label="Edit FAQ"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 cursor-pointer"
            aria-label="Delete FAQ"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {headerLoading ? (
        <div className="space-y-6">
          <SectionHeader
            title="FAQ Section Header"
            description="Manage main heading and description for the website FAQ section."
          />
          <AdminCard className="p-6">
            <LoadingSkeleton rows={4} />
          </AdminCard>
        </div>
      ) : (
        <div className="space-y-6">
          <SectionHeader
            title="FAQ Section Header"
            description="Click the section below to edit the FAQ heading and description."
            action={
              <AdminButton onClick={() => setHeaderModalOpen(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit FAQ Header
              </AdminButton>
            }
          />

          <AdminCard className="overflow-hidden border border-slate-200/80 bg-slate-900 shadow-xl">
            <div className="px-5 !py-7 text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
               Live Preview
              </span>
             <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3.5 py-1.5 text-xs font-semibold text-pink-700">
                  <Sparkles className="h-4 w-4" />
                  Hover to Edit
                </span>
            </div>

            <div className="p-4 md:p-6 !pt-0 text-white">
              <OverlayButton
                label="Edit FAQ Header"
                active={headerModalOpen}
                onClick={() => setHeaderModalOpen(true)}
              >
                <div className="overflow-hidden rounded-[24px] bg-[#1C0D17] p-6 md:py-16 md:px-6 shadow-inner border border-[#2B1826]">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                    {headerDraft.heading || "Frequently Asked Questions"}
                  </h2>
                  {headerDraft.description ? (
                    <p className="text-sm md:text-base text-gray-300 max-w-xl font-light mt-4">
                      {headerDraft.description}
                    </p>
                  ) : null}
                </div>
              </OverlayButton>
            </div>
          </AdminCard>
        </div>
      )}

      <Modal
        open={headerModalOpen}
        onClose={handleCancelHeaderModal}
        title="Edit FAQ Header"
        description="Update the main title and description for the homepage FAQ section."
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <AdminButton variant="secondary" onClick={handleCancelHeaderModal} disabled={headerSaving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSaveHeader()} disabled={headerSaving || !isHeaderDirty}>
              <Save className="mr-2 h-4 w-4" />
              {headerSaving ? "Saving..." : "Save Header"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Section Badge (Optional)"
            value={headerDraft.badgeText || ""}
            onChange={(e) => setHeaderDraft({ ...headerDraft, badgeText: e.target.value })}
            maxLength={60}
            counter={`${(headerDraft.badgeText || "").length}/60 characters (including spaces)`}
            placeholder="FAQ"
          />

          <AdminInput
            label="Main Heading *"
            value={headerDraft.heading}
            onChange={(e) => setHeaderDraft({ ...headerDraft, heading: e.target.value })}
            error={headerErrors.heading}
            maxLength={113}
            counter={`${(headerDraft.heading || "").length}/113 characters (including spaces)`}
            placeholder="Frequently Asked Questions"
          />

          <AdminTextarea
            label="Description (Optional)"
            value={headerDraft.description || ""}
            onChange={(e) => setHeaderDraft({ ...headerDraft, description: e.target.value })}
            maxLength={154}
            counter={`${(headerDraft.description || "").length}/154 characters (including spaces)`}
            placeholder="Find answers to commonly asked questions about WiiZ agentic AI platform."
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={headerDiscardDialog}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes. Are you sure you want to discard them?"
        confirmLabel="Discard Changes"
        onConfirm={confirmDiscardHeader}
        onClose={() => setHeaderDiscardDialog(false)}
      />

      <SectionHeader
        title="Frequently Asked Questions (FAQs)"
        description="Manage questions and answers displayed in the website FAQ section. (Maximum limit: 5 FAQs)."
        action={
          rows.length < 5 ? (
            <AdminButton onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </AdminButton>
          ) : undefined
        }
      />

      <AdminDataTable
        rows={filteredRows}
        columns={columns}
        rowKey={(row) => String(row.id)}
        loading={loading}
        emptyTitle="No FAQs found"
        emptyDescription="Create your first FAQ item using the Add FAQ button."
        pageSize={10}
        rowProps={(row) => ({
          draggable: !reordering,
          onDragStart: () => handleDragStart(row.id),
          onDragOver: (event) => event.preventDefault(),
          onDrop: () => handleDrop(row.id),
          className: "cursor-grab active:cursor-grabbing hover:bg-slate-50/80 transition-colors",
        })}
        toolbar={
          <AdminTableToolbar
            search={
              <SearchField
                value={search}
                onChange={setSearch}
                placeholder="Search FAQs by question or answer..."
              />
            }
            secondaryActions={
              <div className="flex items-center gap-2">
                <AdminSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                  className="w-36"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </AdminSelect>
              </div>
            }
          />
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id > 0 ? "Edit FAQ" : "Add New FAQ"}
        description="Fill out the question and answer text for the FAQ section."
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : form.id > 0 ? "Update FAQ" : "Save FAQ"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminTextarea
            label="Question *"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            error={errors.question}
            placeholder="e.g. What is WiiZ?"
            maxLength={130}
            counter={`${form.question.length}/130`}
          />

          <AdminTextarea
            label="Answer *"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            error={errors.answer}
            placeholder="Write the full detailed answer..."
            maxLength={345}
            counter={`${form.answer.length}/345`}
          />
        </div>
      </Modal>

      <StatusConfirmModal
        open={Boolean(statusModalTarget)}
        targetStatus={statusModalTarget?.isActive ? "inactive" : "active"}
        loading={statusUpdating}
        onConfirm={() => void executeStatusToggle()}
        onClose={() => setStatusModalTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete FAQ Item?"
        description="Are you sure you want to delete this FAQ item? This action cannot be undone."
        confirmLabel="Delete FAQ"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}