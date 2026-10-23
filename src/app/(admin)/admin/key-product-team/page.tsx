"use client";

import { GripVertical, Image as ImageIcon, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { ImageUploadField } from "@/src/components/admin/admin-image-upload";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { cn } from "@/src/lib/utils";
import type { AboutTeamMemberRow, ApiResponse } from "@/src/types/admin-api";

type FormState = {
  id: number;
  name: string;
  designation: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  id: 0,
  name: "",
  designation: "",
  image: "",
  displayOrder: 1,
  isActive: true,
};

export default function AdminKeyProductTeamPage() {
  const { showToast } = useAdminToast();
  const [rows, setRows] = useState<AboutTeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [statusModalTarget, setStatusModalTarget] = useState<AboutTeamMemberRow | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const draggedRowIdRef = useRef<number | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/about-team?category=PRODUCT", { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<AboutTeamMemberRow[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to load key product team.");
      }
      setRows(payload.data);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load Error",
        description: error instanceof Error ? error.message : "Unable to fetch product team.",
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

  function openEditModal(row: AboutTeamMemberRow) {
    setForm({
      id: row.id,
      name: row.name,
      designation: row.designation || "",
      image: row.image || "",
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (form.name.trim().length > 60) {
      nextErrors.name = "Maximum 60 characters.";
    }
    if (form.designation && form.designation.trim().length > 85) {
      nextErrors.designation = "Maximum 85 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/media/upload/team", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to upload member photo.");
      }

      const mediaPath = payload.data?.filepath ? `/api/media/${payload.data.filepath}` : payload.data?.url;
      setForm((prev) => ({ ...prev, image: mediaPath }));
      showToast({
        tone: "success",
        title: "Image Uploaded",
        description: "Member photo uploaded successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Unable to upload photo.",
      });
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/about-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id > 0 ? form.id : undefined,
          category: "PRODUCT",
          name: form.name.trim(),
          designation: form.designation.trim() || null,
          image: form.image.trim() || null,
          linkedinUrl: null,
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<AboutTeamMemberRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to save product team member.");
      }

      showToast({
        tone: "success",
        title: form.id > 0 ? "Member Updated" : "Member Added",
        description: "Key product team member saved successfully.",
      });

      setModalOpen(false);
      void loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Unable to save member.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/about-team/${deleteId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as ApiResponse<null>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to delete member.");
      }

      showToast({
        tone: "success",
        title: "Member Deleted",
        description: "Key product team member deleted successfully.",
      });

      setDeleteId(null);
      void loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Unable to delete member.",
      });
    }
  }

  function handleDragStart(id: number) {
    draggedRowIdRef.current = id;
  }

  async function handleDrop(targetId: number) {
    const sourceId = draggedRowIdRef.current;
    draggedRowIdRef.current = null;

    if (!sourceId || sourceId === targetId) return;

    const sourceIndex = rows.findIndex((r) => r.id === sourceId);
    const targetIndex = rows.findIndex((r) => r.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) return;

    const nextRows = [...rows];
    const [moved] = nextRows.splice(sourceIndex, 1);
    nextRows.splice(targetIndex, 0, moved);

    const updatedRows = nextRows.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));

    setRows(updatedRows);
    setReordering(true);

    try {
      const payloadItems = updatedRows.map((r) => ({
        id: r.id,
        displayOrder: r.displayOrder,
      }));

      const response = await fetch("/api/admin/about-team/display-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payloadItems }),
      });

      const payload = (await response.json()) as ApiResponse<null>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to save reordered list.");
      }

      showToast({
        tone: "success",
        title: "Order Saved",
        description: "Key product team reordered successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Reorder Failed",
        description: error instanceof Error ? error.message : "Unable to update display order.",
      });
      void loadData();
    } finally {
      setReordering(false);
    }
  }

  async function handleToggleStatusConfirm() {
    if (!statusModalTarget) return;

    const row = statusModalTarget;
    const nextActive = !row.isActive;

    setStatusUpdating(true);
    try {
      const response = await fetch("/api/admin/about-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          category: "PRODUCT",
          name: row.name,
          designation: row.designation,
          image: row.image,
          linkedinUrl: row.linkedinUrl,
          displayOrder: row.displayOrder,
          isActive: nextActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<AboutTeamMemberRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to update status.");
      }

      setRows((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, isActive: nextActive } : item)),
      );

      showToast({
        tone: "success",
        title: "Status Updated",
        description: `Key product team member is now ${nextActive ? "active" : "inactive"}.`,
      });
      setStatusModalTarget(null);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Status Update Failed",
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
      render: (row: AboutTeamMemberRow) => (
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600">
          <GripVertical className="h-4 w-4 cursor-grab text-slate-400 hover:text-slate-700" />
          <span>#{row.displayOrder}</span>
        </div>
      ),
    },
    {
      key: "member",
      label: "Member",
      sortable: true,
      sortValue: (row: AboutTeamMemberRow) => row.name,
      render: (row: AboutTeamMemberRow) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white flex items-center justify-center">
            {row.image ? (
              <img src={row.image} alt={row.name} className="h-full w-full object-contain object-top" />
            ) : (
              <span className="text-xs font-bold text-slate-500">
                {row.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{row.name}</div>
            {row.designation ? (
              <div className="text-xs text-slate-500">{row.designation}</div>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: AboutTeamMemberRow) => (
        <button
          type="button"
          onClick={() => setStatusModalTarget(row)}
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#98235f]/40",
            row.isActive ? "bg-emerald-500" : "bg-slate-300",
          )}
          aria-label={`Set member ${row.isActive ? "inactive" : "active"}`}
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
      render: (row: AboutTeamMemberRow) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            aria-label="Edit product member"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 cursor-pointer"
            aria-label="Delete product member"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Key Product Team"
        description="Manage product team member photos, names, and optional designations. Drag rows to reorder."
        action={
          <AdminButton onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product Member
          </AdminButton>
        }
      />

      <AdminDataTable
        rows={filteredRows}
        columns={columns}
        rowKey={(row) => String(row.id)}
        loading={loading}
        emptyTitle="No product team members found"
        emptyDescription="Create your first product team member using the Add Product Member button."
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
                placeholder="Search product team..."
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

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id > 0 ? "Edit Product Team Member" : "Add Product Team Member"}
        description="Enter name, photo, and optional designation."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : form.id > 0 ? "Update Member" : "Create Member"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Member Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            maxLength={60}
            counter={`${form.name.length}/60`}
            placeholder="e.g. Yamini Hire"
          />

          <AdminInput
            label="Designation (If Required / Optional)"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            error={errors.designation}
            maxLength={85}
            counter={`${form.designation.length}/85`}
            placeholder="e.g. Senior AI Engineer"
          />

          <ImageUploadField
            label="Member Photo"
            value={form.image}
            folder="team"
            aspectRatio="square"
            onChange={(url) => setForm({ ...form, image: url || "" })}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Key Product Team Member?"
        description="Are you sure you want to delete this team member? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => void handleDeleteConfirm()}
        onClose={() => setDeleteId(null)}
      />

      {/* Status Toggle Modal */}
      <StatusConfirmModal
        open={Boolean(statusModalTarget)}
        targetStatus={statusModalTarget?.isActive ? "inactive" : "active"}
        loading={statusUpdating}
        onConfirm={() => void handleToggleStatusConfirm()}
        onClose={() => setStatusModalTarget(null)}
      />
    </div>
  );
}
