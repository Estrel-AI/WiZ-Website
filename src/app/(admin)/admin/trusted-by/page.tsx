"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTableToolbar,
  ConfirmDialog,
  Modal,
  SearchField,
  SectionHeader,
  StatusConfirmModal,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { useDebounce } from "@/src/hooks/use-debounce";
import { cn } from "@/src/lib/utils";
import type { ApiResponse, ListData, TrustedByLogoRow, TrustedByLogoStatus } from "@/src/types/admin-api";

const PAGE_SIZE = 10;
const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"];

function mediaUrl(value: string) {
  return /^trusted-by\//i.test(value) ? `/api/media/${value}` : value;
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export default function AdminTrustedByPage() {
  const { showToast } = useAdminToast();
  const [rows, setRows] = useState<TrustedByLogoRow[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | TrustedByLogoStatus>("");
  const debouncedSearch = useDebounce(search, 300);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ id: 0, logoImage: "", sortOrder: 1, status: "active" as TrustedByLogoStatus });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragRowIdRef = useRef<number | null>(null);
  const [reordering, setReordering] = useState(false);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/trusted-by-logos/list", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, limit: PAGE_SIZE, search: debouncedSearch, status: statusFilter || null }),
      });
      const payload = await response.json() as ApiResponse<ListData<TrustedByLogoRow>>;
      if (!response.ok || !payload.success || !payload.data) throw new Error(payload.error || payload.message);
      setRows(payload.data.result); setCount(payload.data.count); setError("");
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unable to load logos.";
      setError(message); showToast({ tone: "error", title: "Trusted By unavailable", description: message });
    } finally { setLoading(false); }
  }, [page, debouncedSearch, statusFilter, showToast]);

  useEffect(() => { void loadRows(); }, [loadRows]);

  function openCreate() {
    setForm({ id: 0, logoImage: "", sortOrder: count + 1, status: "active" }); setSelectedFile(null); setPreview(null); setError(""); setModalOpen(true);
  }

  function openEdit(row: TrustedByLogoRow) {
    setForm({ id: row.id, logoImage: row.logoImage, sortOrder: row.sortOrder, status: row.status }); setSelectedFile(null); setPreview(null); setError(""); setModalOpen(true);
  }

  function handleFile(file: File | null) {
    if (!file) return;
    if (!allowedTypes.includes(file.type) || !/\.(jpe?g|png|svg|webp)$/i.test(file.name)) { setError("Logo must be a JPG, JPEG, PNG, SVG, or WEBP image."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Logo image must be 5 MB or less."); return; }
    setError(""); setSelectedFile(file); setPreview(URL.createObjectURL(file));
  }

  async function save() {
    setError("");
    if (!form.id && !selectedFile) { setError("Logo image is required."); return; }
    if (!Number.isInteger(Number(form.sortOrder)) || Number(form.sortOrder) < 0) { setError("Sort order must be a non-negative integer."); return; }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/trusted-by-logos/upsert", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        id: form.id || undefined, logoImage: form.logoImage || `trusted-by/pending-${Date.now()}.png`, sortOrder: Number(form.sortOrder), status: form.status,
      }) });
      const payload = await response.json() as ApiResponse<{ id: number }>;
      if (!response.ok || !payload.success || !payload.data) throw new Error(payload.error || payload.message);
      if (selectedFile) {
        const upload = new FormData(); upload.append("rowId", String(payload.data.id)); upload.append("file", selectedFile);
        const uploadResponse = await fetch("/api/admin/trusted-by-logos/upload", { method: "POST", body: upload });
        const uploadPayload = await uploadResponse.json() as ApiResponse<unknown>;
        if (!uploadResponse.ok || !uploadPayload.success) throw new Error(uploadPayload.error || uploadPayload.message);
      }
      setModalOpen(false); setPage(1); await loadRows(); showToast({ tone: "success", title: form.id ? "Logo updated" : "Logo added", description: "Trusted By logos were saved successfully." });
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Unable to save logo."); }
    finally { setSaving(false); }
  }

  const [statusModalTarget, setStatusModalTarget] = useState<TrustedByLogoRow | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  async function executeStatusToggle() {
    if (!statusModalTarget) return;
    const row = statusModalTarget;
    setStatusUpdating(true);
    try {
      const nextStatus = row.status === "active" ? "inactive" : "active";
      const response = await fetch("/api/admin/trusted-by-logos/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id, status: nextStatus }) });
      const payload = await response.json() as ApiResponse<unknown>;
      if (!response.ok || !payload.success) throw new Error(payload.error || payload.message);
      setStatusModalTarget(null);
      await loadRows();
      showToast({ tone: "success", title: "Status updated", description: `Logo is now ${nextStatus}.` });
    } catch (toggleError) { showToast({ tone: "error", title: "Status update failed", description: toggleError instanceof Error ? toggleError.message : "Unable to update status." }); }
    finally { setStatusUpdating(false); }
  }

  async function remove() {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/admin/trusted-by-logos/${deleteId}`, { method: "DELETE" });
      const payload = await response.json() as ApiResponse<unknown>;
      if (!response.ok || !payload.success) throw new Error(payload.error || payload.message);
      setDeleteId(null); await loadRows(); showToast({ tone: "success", title: "Logo deleted", description: "The logo was moved to inactive status." });
    } catch (deleteError) { showToast({ tone: "error", title: "Delete failed", description: deleteError instanceof Error ? deleteError.message : "Unable to delete logo." }); }
  }

  async function persistRowOrder(nextRows: TrustedByLogoRow[]) {
    setReordering(true);
    try {
      const response = await fetch("/api/admin/trusted-by-logos/display-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: nextRows.map((item, index) => ({ id: item.id, sortOrder: index + 1 })) }) });
      const payload = await response.json() as ApiResponse<unknown>;
      if (!response.ok || !payload.success) throw new Error(payload.error || payload.message);
      setRows(nextRows.map((item, index) => ({ ...item, sortOrder: index + 1 })));
      await loadRows();
      showToast({ tone: "success", title: "Order updated", description: "Trusted By logo order was saved successfully." });
    } catch (moveError) { await loadRows(); showToast({ tone: "error", title: "Reorder failed", description: moveError instanceof Error ? moveError.message : "Unable to reorder logos." }); }
    finally { setReordering(false); dragRowIdRef.current = null; }
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
    setRows(nextRows.map((item, index) => ({ ...item, sortOrder: index + 1 })));
    void persistRowOrder(nextRows);
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Trusted By"
        description="Manage the logos displayed in the homepage Trusted By section."
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Logo
          </AdminButton>
        }
      />

      {reordering ? (
        <div className="rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Saving logo order...
        </div>
      ) : null}

      <AdminDataTable
        rows={rows}
        loading={loading}
        rowKey={(row) => String(row.id)}
        emptyTitle="No logos found"
        emptyDescription="Add a logo or adjust the search and status filters."
        totalCount={count}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={(nextPage) => setPage(nextPage)}
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
                  onChange={(value) => {
                    setPage(1);
                    setSearch(value);
                  }}
                  placeholder="Search logo path"
                />
              </div>
            }
            secondaryActions={
              <AdminSelect
                value={statusFilter}
                onChange={(event) => {
                  setPage(1);
                  setStatusFilter(event.target.value as "" | TrustedByLogoStatus);
                }}
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </AdminSelect>
            }
          />
        }
        columns={[
          {
            key: "order",
            label: "Order",
            render: (row) => (
              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <GripVertical className="h-4 w-4 cursor-grab text-slate-400" />
                <span>{row.sortOrder}</span>
              </div>
            ),
          },
          {
            key: "preview",
            label: "Preview",
            render: (row) => (
              <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-slate-200 bg-white p-2">
                <img src={mediaUrl(row.logoImage)} alt="Trusted By logo" className="max-h-full max-w-full object-contain" />
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <button
                type="button"
                onClick={() => setStatusModalTarget(row)}
                className={cn(
                  "relative inline-flex h-7 w-12 items-center rounded-full transition cursor-pointer",
                  row.status === "active" ? "bg-emerald-500" : "bg-slate-300",
                )}
                aria-label={`Set logo ${row.status === "active" ? "inactive" : "active"}`}
                aria-pressed={row.status === "active"}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 rounded-full bg-white transition",
                    row.status === "active" ? "translate-x-6" : "translate-x-1",
                  )}
                />
              </button>
            ),
          },
          {
            key: "created",
            label: "Created",
            sortable: true,
            sortValue: (row) => row.createdAt,
            render: (row) => <span className="text-sm text-slate-500">{dateLabel(row.createdAt)}</span>,
          },
          {
            key: "actions",
            label: "Actions",
            className: "w-[120px]",
            render: (row) => (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                  aria-label="Edit logo"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(row.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Delete logo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
      />
    <Modal open={modalOpen} onClose={() => !saving && setModalOpen(false)} title={form.id ? "Edit Trusted By Logo" : "Add Trusted By Logo"} footer={<div className="flex justify-end gap-3"><AdminButton variant="secondary" disabled={saving} onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton disabled={saving} onClick={() => void save()}>{saving ? "Saving..." : "Save Logo"}</AdminButton></div>}>
      <div className="space-y-4"><div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"><div className="flex items-center gap-3"><input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.svg,.webp,image/jpeg,image/png,image/svg+xml,image/webp" className="hidden" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} /><AdminButton variant="secondary" onClick={() => inputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Choose Logo</AdminButton><span className="truncate text-sm text-slate-500">{selectedFile?.name || (form.logoImage || "No logo selected")}</span></div><p className="mt-2 text-xs text-slate-500">JPG, JPEG, PNG, SVG, or WEBP, maximum 5 MB.</p>{preview ? <img src={preview} alt="Selected logo preview" className="mt-4 h-20 w-full object-contain" /> : form.logoImage ? <img src={mediaUrl(form.logoImage)} alt="Current logo preview" className="mt-4 h-20 w-full object-contain" /> : null}</div>{error ? <p className="text-sm text-rose-600">{error}</p> : null}</div>
    </Modal>
    <StatusConfirmModal
      open={Boolean(statusModalTarget)}
      targetStatus={statusModalTarget?.status === "active" ? "inactive" : "active"}
      loading={statusUpdating}
      onConfirm={() => void executeStatusToggle()}
      onClose={() => setStatusModalTarget(null)}
    />
    <ConfirmDialog open={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={() => void remove()} title="Delete Trusted By logo?" description="This will deactivate the logo and remove it from the homepage." confirmLabel="Delete" />
    </div>
  );
}
