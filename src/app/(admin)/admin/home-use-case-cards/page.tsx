"use client";

import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminSelect,
  ConfirmDialog,
  EmptyState,
  LoadingSkeleton,
  Modal,
  SearchField,
  SectionHeader,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import type { ApiResponse, HomeUseCaseCardDisplayOrderPayload, HomeUseCaseCardRow, ListData, SelectOption } from "@/src/types/admin-api";

type FormState = {
  id: number;
  useCaseId: string;
};

function createEmptyForm() {
  return {
    id: 0,
    useCaseId: "",
  } satisfies FormState;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminHomeUseCaseCardsPage() {
  const { showToast } = useAdminToast();
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

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Home Use Cases"
        description="Manage the homepage use case card bindings for the WiiZ Built AI Agents section."
        action={
          <AdminButton onClick={openCreate} disabled={optionsLoading || !canAddMore}>
            <Plus className="mr-2 h-4 w-4" />
            Add Home Use Case
          </AdminButton>
        }
      />

      <AdminCard className="overflow-hidden">
        <div className="border-b border-slate-200/80 bg-slate-50/70 px-4 py-3 sm:px-5">
          <div className="min-w-0 flex-1">
            <SearchField value={search} onChange={setSearch} placeholder="Search use case title or slug" />
          </div>
        </div>

        {loading ? <LoadingSkeleton rows={6} /> : null}
        {reordering ? (
          <div className="border-b border-slate-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700 sm:px-5">
            Saving home use case order...
          </div>
        ) : null}

        {!loading && rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No home use cases found"
              description="Add homepage use case cards for the WiiZ Built AI Agents section."
              action={
                <AdminButton onClick={openCreate} disabled={optionsLoading || !canAddMore}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Home Use Case
                </AdminButton>
              }
            />
          </div>
        ) : null}

        {!loading && rows.length > 0 ? (
          <div className="divide-y divide-slate-200">
            <div className="grid grid-cols-[78px_minmax(0,1.6fr)_minmax(0,1fr)_130px_96px] gap-4 bg-slate-50/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-5">
              <div>Order</div>
              <div>Use Case</div>
              <div>Slug</div>
              <div>Date</div>
              <div className="text-right">Actions</div>
            </div>
            {rows.map((row) => (
              <div
                key={row.id}
                draggable={!reordering}
                onDragStart={() => handleDragStart(row.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(row.id)}
                className="grid grid-cols-[78px_minmax(0,1.6fr)_minmax(0,1fr)_130px_96px] items-center gap-4 px-4 py-3 transition hover:bg-slate-50/70 sm:px-5"
              >
                <div className="flex items-center gap-2 text-slate-500">
                  <GripVertical className="h-4 w-4 cursor-grab" />
                  <span className="text-sm font-medium">{row.displayOrder + 1}</span>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-950">{row.useCaseTitle}</div>
                </div>
                <div className="truncate text-sm text-slate-500">{row.useCaseSlug || "-"}</div>
                <div className="text-sm text-slate-500">{formatDate(row.createdAt)}</div>
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                    onClick={() => openEdit(row)}
                    aria-label="Edit home use case"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4 stroke-[1.9]" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-rose-200 bg-white text-rose-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => setDeleteId(row.id)}
                    aria-label="Delete home use case"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 stroke-[1.9]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </AdminCard>

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
