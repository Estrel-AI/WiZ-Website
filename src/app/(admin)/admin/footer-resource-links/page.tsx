"use client";

import {
  FileText,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTableToolbar,
  ConfirmDialog,
  LoadingSkeleton,
  Modal,
  SearchField,
  SectionHeader,
  StatusConfirmModal,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { cn } from "@/src/lib/utils";
import type { ApiResponse, FooterResourceLinkRow } from "@/src/types/admin-api";

type FormState = {
  id: number;
  title: string;
  slug: string;
  url: string;
  displayOrder: number;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  id: 0,
  title: "",
  slug: "",
  url: "",
  displayOrder: 1,
  isActive: true,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminFooterResourceLinksPage() {
  const { showToast } = useAdminToast();
  const [rows, setRows] = useState<FooterResourceLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [statusModalTarget, setStatusModalTarget] = useState<FooterResourceLinkRow | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const draggedRowIdRef = useRef<number | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/footer-resource-links", { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<FooterResourceLinkRow[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to load resource links.");
      }
      setRows(payload.data);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Unable to fetch resource links.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function openAddModal() {
    const nextOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.displayOrder)) + 1 : 1;
    setForm({ ...EMPTY_FORM, displayOrder: nextOrder });
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(row: FooterResourceLinkRow) {
    setForm({
      id: row.id,
      title: row.title,
      slug: row.slug,
      url: row.url,
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = "Page title is required.";
    if (!form.url.trim()) nextErrors.url = "URL / Route is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/footer-resource-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id > 0 ? form.id : undefined,
          title: form.title.trim(),
          slug: form.slug.trim() || slugify(form.title),
          url: form.url.trim(),
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<FooterResourceLinkRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to save resource link.");
      }

      showToast({
        tone: "success",
        title: form.id > 0 ? "Resource Page Updated" : "Resource Page Created",
        description: "Footer resource link saved successfully.",
      });
      setModalOpen(false);
      await loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Unable to save resource link.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/admin/footer-resource-links/${deleteId}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as ApiResponse<boolean>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to delete resource link.");
      }
      showToast({
        tone: "success",
        title: "Resource Page Deleted",
        description: "The resource link has been removed.",
      });
      setDeleteId(null);
      await loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Unable to delete link.",
      });
    }
  }

  async function handleStatusToggleConfirm() {
    if (!statusModalTarget) return;
    setStatusUpdating(true);
    try {
      const response = await fetch("/api/admin/footer-resource-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: statusModalTarget.id,
          title: statusModalTarget.title,
          slug: statusModalTarget.slug,
          url: statusModalTarget.url,
          displayOrder: statusModalTarget.displayOrder,
          isActive: !statusModalTarget.isActive,
        }),
      });
      const payload = (await response.json()) as ApiResponse<FooterResourceLinkRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to update status.");
      }
      showToast({
        tone: "success",
        title: "Status Updated",
        description: `Resource page is now ${!statusModalTarget.isActive ? "Active" : "Inactive"}.`,
      });
      setStatusModalTarget(null);
      await loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Unable to update status.",
      });
    } finally {
      setStatusUpdating(false);
    }
  }

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        !search.trim() ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.slug.toLowerCase().includes(search.toLowerCase()) ||
        r.url.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && r.isActive) ||
        (statusFilter === "inactive" && !r.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  function handleDragStart(id: number) {
    draggedRowIdRef.current = id;
  }

  async function handleDrop(targetId: number) {
    const sourceId = draggedRowIdRef.current;
    if (!sourceId || sourceId === targetId) return;

    const sourceIdx = rows.findIndex((r) => r.id === sourceId);
    const targetIdx = rows.findIndex((r) => r.id === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const nextRows = [...rows];
    const [moved] = nextRows.splice(sourceIdx, 1);
    nextRows.splice(targetIdx, 0, moved);

    const reorderedItems = nextRows.map((r, idx) => ({ ...r, displayOrder: idx + 1 }));
    setRows(reorderedItems);
    setReordering(true);

    try {
      const response = await fetch("/api/admin/footer-resource-links/display-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reorderedItems.map((r) => ({ id: r.id, displayOrder: r.displayOrder })),
        }),
      });
      const payload = (await response.json()) as ApiResponse<boolean>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to update display order.");
      }
      showToast({
        tone: "success",
        title: "Order Updated",
        description: "Footer resource pages display order saved.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Reorder Failed",
        description: error instanceof Error ? error.message : "Unable to reorder items.",
      });
      await loadData();
    } finally {
      setReordering(false);
      draggedRowIdRef.current = null;
    }
  }

  const columns = [
    {
      key: "drag",
      label: "",
      className: "w-10 text-center",
      render: (row: FooterResourceLinkRow) => (
        <div className="flex cursor-grab items-center justify-center text-slate-400 hover:text-slate-600 active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </div>
      ),
    },
    {
      key: "title",
      label: "Page Title",
      render: (row: FooterResourceLinkRow) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.title}</div>
            <div className="text-xs text-slate-500 font-mono">/{row.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: "url",
      label: "URL / Route",
      render: (row: FooterResourceLinkRow) => (
        <span className="text-xs text-slate-700 max-w-xs truncate block font-mono bg-slate-100 px-2.5 py-1 rounded-md w-fit border border-slate-200">
          {row.url}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: FooterResourceLinkRow) => (
        <button
          type="button"
          onClick={() => setStatusModalTarget(row)}
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#98235f]/40",
            row.isActive ? "bg-emerald-500" : "bg-slate-300",
          )}
          aria-label={`Set ${row.title} ${row.isActive ? "inactive" : "active"}`}
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
      render: (row: FooterResourceLinkRow) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            aria-label="Edit resource page"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 cursor-pointer"
            aria-label="Delete resource page"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Footer Resource Links"
        description="Add, edit, delete, activate/deactivate, and reorder resource pages (Privacy Policy, Cookie Policy, Terms, Contact, etc.) in the website footer."
        action={
          <AdminButton onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Resource Page
          </AdminButton>
        }
      />

      <AdminDataTable
        rows={filteredRows}
        columns={columns}
        rowKey={(row) => String(row.id)}
        loading={loading}
        emptyTitle="No resource links found"
        emptyDescription="Create your first resource page link using the Add Resource Page button."
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
                placeholder="Search title, slug, or URL..."
              />
            }
            secondaryActions={
              <AdminSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                className="w-36"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </AdminSelect>
            }
          />
        }
      />

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id > 0 ? "Edit Resource Page" : "Add Resource Page"}
        description="Configure page title, slug, target URL/route, and active status."
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : form.id > 0 ? "Update Page" : "Create Page"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Page Title *"
            value={form.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setForm({
                ...form,
                title: newTitle,
                slug: form.id > 0 ? form.slug : slugify(newTitle),
              });
            }}
            error={errors.title}
            placeholder="e.g. Privacy Policy, Terms & Conditions, Cookie Policy"
          />

          <AdminInput
            label="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            placeholder="privacy-policy"
          />

          <AdminInput
            label="URL / Route *"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            error={errors.url}
            placeholder="e.g. /contact, #privacy, #cookies, #terms, https://..."
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Resource Page?"
        description="Are you sure you want to remove this resource page link from the footer? This action cannot be undone."
        confirmLabel="Delete Page"
        onConfirm={() => void handleDeleteConfirm()}
        onClose={() => setDeleteId(null)}
      />

      {/* Status Toggle Modal */}
      <StatusConfirmModal
        open={Boolean(statusModalTarget)}
        title={`Set "${statusModalTarget?.title}" as ${statusModalTarget?.isActive ? "Inactive" : "Active"}?`}
        targetStatus={statusModalTarget?.isActive ? "inactive" : "active"}
        onConfirm={() => void handleStatusToggleConfirm()}
        onClose={() => setStatusModalTarget(null)}
        loading={statusUpdating}
      />
    </div>
  );
}
