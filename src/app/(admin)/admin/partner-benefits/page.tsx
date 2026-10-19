"use client";

import { Edit3, GripVertical, Layers3, Pencil, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { ImageUploadField } from "@/src/components/admin/admin-image-upload";
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
  PartnerBenefitRow,
  SectionHeaderData,
  SectionHeaderUpsertPayload,
} from "@/src/types/admin-api";

const DEFAULT_HEADER: SectionHeaderData = {
  id: 0,
  sectionKey: "PARTNER_BENEFITS",
  badgeText: null,
  heading: "Grow Your Business with WiiZ Ecosystem",
  description: "Join our partner network to deliver state-of-the-art AI solutions.",
  buttonText: null,
  buttonUrl: null,
  createdAt: "",
  updatedAt: "",
};

type FormState = {
  id: number;
  title: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  id: 0,
  title: "",
  description: "",
  image: "",
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
      <span className="pointer-events-none absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full bg-black/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus:opacity-100 shadow-md">
        <Edit3 className="h-3.5 w-3.5 text-[#E68F17]" />
        {label}
      </span>
      {children}
    </button>
  );
}

export default function AdminPartnerBenefitsPage() {
  const { showToast } = useAdminToast();

  const [headerSaved, setHeaderSaved] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerDraft, setHeaderDraft] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerSaving, setHeaderSaving] = useState(false);
  const [headerErrors, setHeaderErrors] = useState<Record<string, string>>({});
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [headerDiscardDialog, setHeaderDiscardDialog] = useState(false);

  const [rows, setRows] = useState<PartnerBenefitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [statusModalTarget, setStatusModalTarget] = useState<PartnerBenefitRow | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const draggedRowIdRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/section-headers/PARTNER_BENEFITS", { cache: "no-store" })
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

  function updateHeader<K extends keyof SectionHeaderData>(key: K, value: SectionHeaderData[K]) {
    setHeaderDraft((current) => ({ ...current, [key]: value }));
    setHeaderErrors((current) => ({ ...current, [key]: "" }));
  }

  function validateHeader() {
    const next: Record<string, string> = {};
    if (!headerDraft.heading.trim()) next.heading = "Heading is required.";
    if (headerDraft.heading.length > 100) next.heading = "Maximum 100 characters.";
    if (headerDraft.description && headerDraft.description.length > 250) next.description = "Maximum 250 characters.";
    setHeaderErrors(next);
    return !Object.keys(next).length;
  }

  async function saveHeader() {
    if (!validateHeader()) return;
    setHeaderSaving(true);
    try {
      const body: SectionHeaderUpsertPayload = {
        badgeText: null,
        heading: headerDraft.heading.trim(),
        description: headerDraft.description?.trim() || null,
        buttonText: null,
        buttonUrl: null,
      };
      const response = await fetch("/api/admin/section-headers/PARTNER_BENEFITS", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as ApiResponse<SectionHeaderData>;
      if (!response.ok || !payload.success) throw new Error(payload.error || payload.message);
      const next = payload.data ? payload.data : { ...headerDraft, updatedAt: new Date().toISOString() };
      setHeaderSaved(next);
      setHeaderDraft(next);
      setHeaderModalOpen(false);
      showToast({
        tone: "success",
        title: "Benefits Header Updated",
        description: "The partner benefits section header has been saved successfully.",
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

  function handleDiscardHeader() {
    setHeaderDraft(headerSaved);
    setHeaderErrors({});
    setHeaderDiscardDialog(false);
  }

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/partner-benefits", { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<PartnerBenefitRow[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to load partner benefits.");
      }
      setRows(payload.data);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load Error",
        description: error instanceof Error ? error.message : "Unable to fetch partner benefits.",
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

  function openEditModal(row: PartnerBenefitRow) {
    setForm({
      id: row.id,
      title: row.title,
      description: row.description,
      image: row.image,
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) {
      nextErrors.title = "Title is required.";
    } else if (form.title.trim().length > 100) {
      nextErrors.title = "Maximum 100 characters.";
    }
    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    } else if (form.description.trim().length > 300) {
      nextErrors.description = "Maximum 300 characters.";
    }
    if (!form.image.trim()) nextErrors.image = "Benefit Image is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/partner-benefits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id > 0 ? form.id : undefined,
          title: form.title.trim(),
          description: form.description.trim(),
          image: form.image.trim(),
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<PartnerBenefitRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to save partner benefit.");
      }

      showToast({
        tone: "success",
        title: form.id > 0 ? "Benefit Updated" : "Benefit Created",
        description: "Partner benefit saved successfully.",
      });

      setModalOpen(false);
      void loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Unable to save benefit.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/partner-benefits/${deleteId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as ApiResponse<null>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to delete benefit.");
      }

      showToast({
        tone: "success",
        title: "Benefit Deleted",
        description: "Partner benefit deleted successfully.",
      });

      setDeleteId(null);
      void loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Unable to delete benefit.",
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

      const response = await fetch("/api/admin/partner-benefits/display-order", {
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
        description: "Partner benefits reordered successfully.",
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
      const response = await fetch("/api/admin/partner-benefits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          title: row.title,
          description: row.description,
          image: row.image,
          displayOrder: row.displayOrder,
          isActive: nextActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<PartnerBenefitRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to update status.");
      }

      setRows((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, isActive: nextActive } : item)),
      );

      showToast({
        tone: "success",
        title: "Status Updated",
        description: `Benefit item is now ${nextActive ? "active" : "inactive"}.`,
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

  const isHeaderDirty = JSON.stringify(headerSaved) !== JSON.stringify(headerDraft);

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
      render: (row: PartnerBenefitRow) => (
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600">
          <GripVertical className="h-4 w-4 cursor-grab text-slate-400 hover:text-slate-700" />
          <span>#{row.displayOrder}</span>
        </div>
      ),
    },
    {
      key: "image",
      label: "Benefit Image",
      className: "w-24",
      render: (row: PartnerBenefitRow) => (
        <div className="h-12 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-900 shadow-xs">
          <img src={row.image} alt={row.title} className="h-full w-full object-cover" />
        </div>
      ),
    },
    {
      key: "title",
      label: "Benefit Title",
      sortable: true,
      sortValue: (row: PartnerBenefitRow) => row.title,
      render: (row: PartnerBenefitRow) => (
        <div>
          <div className="text-sm font-semibold text-slate-900">{row.title}</div>
          <div className="text-xs text-slate-500 line-clamp-1">{row.description}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: PartnerBenefitRow) => (
        <button
          type="button"
          onClick={() => setStatusModalTarget(row)}
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#98235f]/40",
            row.isActive ? "bg-emerald-500" : "bg-slate-300",
          )}
          aria-label={`Set benefit ${row.isActive ? "inactive" : "active"}`}
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
      render: (row: PartnerBenefitRow) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            aria-label="Edit partner benefit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 cursor-pointer"
            aria-label="Delete partner benefit"
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
        <LoadingSkeleton rows={6} />
      ) : (
        <div className="space-y-6">
          <SectionHeader
            title="Partner Benefits Header"
            description="Edit the heading and subheading for the Partner Benefits section matching reference screenshot."
            action={
              <div className="flex items-center gap-3">
                <AdminButton
                  variant="secondary"
                  onClick={() => setHeaderDiscardDialog(true)}
                  disabled={!isHeaderDirty || headerSaving}
                >
                  Discard
                </AdminButton>
                <AdminButton onClick={() => void saveHeader()} disabled={headerSaving || !isHeaderDirty}>
                  <Save className="mr-2 h-4 w-4" />
                  {headerSaving ? "Saving..." : "Save Changes"}
                </AdminButton>
              </div>
            }
          />

          {/* Live Preview matching uploaded reference image uploaded_media_1787811868801.png */}
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

            {/* Live Preview matching reference image uploaded_media_1787811868801.png */}
            <div className="overflow-hidden rounded-[20px] bg-[#140b12] p-2 shadow-inner border border-[#2B1425]">
              <OverlayButton
                label="Edit Benefits Header"
                active={headerModalOpen}
                onClick={() => setHeaderModalOpen(true)}
                className="w-full rounded-[16px] bg-[#140b12] px-6 py-12 md:px-12 md:py-16 text-center font-sans flex flex-col items-center justify-center min-h-[240px]"
              >
                <div className="w-full max-w-3xl mx-auto my-auto text-center">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
                    {headerDraft.heading || "Grow Your Business with WiiZ Ecosystem"}
                  </h2>
                  {headerDraft.description ? (
                    <p className="text-base md:text-lg text-slate-300 font-normal max-w-2xl mx-auto">
                      {headerDraft.description}
                    </p>
                  ) : null}
                </div>
              </OverlayButton>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Benefits Header Edit Modal */}
      <Modal
        open={headerModalOpen}
        onClose={() => setHeaderModalOpen(false)}
        title="Edit Partner Benefits Header"
        description="Update section heading and subheading text."
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Changes stay local until you click Save Changes.
            </div>
            <AdminButton variant="secondary" onClick={() => setHeaderModalOpen(false)}>
              Close
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Section Heading *"
            maxLength={100}
            value={headerDraft.heading}
            onChange={(event) => updateHeader("heading", event.target.value)}
            error={headerErrors.heading}
            counter={`${headerDraft.heading.length}/100`}
            placeholder="Grow Your Business with WiiZ Ecosystem"
          />
          <AdminTextarea
            label="Subheading Description"
            rows={3}
            maxLength={250}
            value={headerDraft.description || ""}
            onChange={(event) => updateHeader("description", event.target.value)}
            error={headerErrors.description}
            counter={`${(headerDraft.description || "").length}/250`}
            placeholder="Join our partner network to deliver state-of-the-art AI solutions."
          />
        </div>
      </Modal>

      {/* Benefits Header Discard Confirmation */}
      <ConfirmDialog
        open={headerDiscardDialog}
        title="Discard all unsaved changes?"
        description="This will restore the last saved partner benefits header content."
        confirmLabel="Discard All"
        onConfirm={handleDiscardHeader}
        onClose={() => setHeaderDiscardDialog(false)}
      />

      <SectionHeader
        title="Partner Benefits"
        description="Manage partner benefits with images, descriptions, and display order. Drag rows to reorder."
        action={
          <AdminButton onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Benefit Card
          </AdminButton>
        }
      />

      <AdminDataTable
        rows={filteredRows}
        columns={columns}
        rowKey={(row) => String(row.id)}
        loading={loading}
        emptyTitle="No partner benefits found"
        emptyDescription="Create your first benefit card using the Add Benefit Card button."
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
                placeholder="Search benefits..."
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
        title={form.id > 0 ? "Edit Partner Benefit" : "Add Partner Benefit"}
        description="Enter title, description, and upload a feature image."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : form.id > 0 ? "Update Benefit" : "Create Benefit"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Benefit Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={errors.title}
            maxLength={100}
            counter={`${form.title.length}/100`}
            placeholder="e.g. Revenue Growth"
          />

          <AdminTextarea
            label="Description *"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            error={errors.description}
            maxLength={300}
            counter={`${form.description.length}/300`}
            placeholder="Unlock new recurring revenue streams and scale your business sustainably."
          />

          <ImageUploadField
            label="Benefit Image *"
            value={form.image}
            folder="trusted-by"
            aspectRatio="wide"
            error={errors.image}
            onChange={(url) => setForm({ ...form, image: url || "" })}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Partner Benefit?"
        description="Are you sure you want to delete this benefit card? This action cannot be undone."
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