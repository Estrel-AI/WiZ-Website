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
  PartnerPathwayRow,
  SectionHeaderData,
  SectionHeaderUpsertPayload,
} from "@/src/types/admin-api";

const DEFAULT_HEADER: SectionHeaderData = {
  id: 0,
  sectionKey: "PARTNER_PATHWAYS",
  badgeText: null,
  heading: "Find Your Partnership Pathway",
  description: "We offer distinct partnership models designed to align with your business goals.",
  buttonText: null,
  buttonUrl: null,
  createdAt: "",
  updatedAt: "",
};

type FormState = {
  id: number;
  title: string;
  description: string;
  points: string[];
  buttonText: string;
  displayOrder: number;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  id: 0,
  title: "",
  description: "",
  points: [""],
  buttonText: "Register Now",
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

export default function AdminPartnerPathwaysPage() {
  const { showToast } = useAdminToast();

  const [headerSaved, setHeaderSaved] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerDraft, setHeaderDraft] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerSaving, setHeaderSaving] = useState(false);
  const [headerErrors, setHeaderErrors] = useState<Record<string, string>>({});
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [headerDiscardDialog, setHeaderDiscardDialog] = useState(false);

  const [rows, setRows] = useState<PartnerPathwayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [statusModalTarget, setStatusModalTarget] = useState<PartnerPathwayRow | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const draggedRowIdRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/section-headers/PARTNER_PATHWAYS", { cache: "no-store" })
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
      const response = await fetch("/api/admin/section-headers/PARTNER_PATHWAYS", {
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
        title: "Pathway Header Updated",
        description: "The partnership pathway section header has been saved successfully.",
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
      const response = await fetch("/api/admin/partner-pathways", { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<PartnerPathwayRow[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to load partner pathways.");
      }
      setRows(payload.data);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load Error",
        description: error instanceof Error ? error.message : "Unable to fetch partner pathways.",
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
    setForm({ ...EMPTY_FORM, points: [""], displayOrder: nextOrder });
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(row: PartnerPathwayRow) {
    setForm({
      id: row.id,
      title: row.title,
      description: row.description,
      points: row.points.length > 0 ? [...row.points] : [""],
      buttonText: row.buttonText || "Register Now",
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
    setErrors({});
    setModalOpen(true);
  }

  function updatePoint(index: number, value: string) {
    const nextPoints = [...form.points];
    nextPoints[index] = value;
    setForm((prev) => ({ ...prev, points: nextPoints }));
  }

  function addPoint() {
    setForm((prev) => ({ ...prev, points: [...prev.points, ""] }));
  }

  function removePoint(index: number) {
    if (form.points.length <= 1) return;
    const nextPoints = form.points.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, points: nextPoints }));
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
    } else if (form.description.trim().length > 150) {
      nextErrors.description = "Maximum 150 characters.";
    }
    if (form.points.some((p) => p.trim().length > 90)) {
      nextErrors.points = "Bullet points must be 90 characters or less.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;

    const filteredPoints = form.points.map((p) => p.trim()).filter(Boolean);

    setSaving(true);
    try {
      const response = await fetch("/api/admin/partner-pathways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id > 0 ? form.id : undefined,
          title: form.title.trim(),
          description: form.description.trim(),
          points: filteredPoints,
          buttonText: form.buttonText.trim() || "Register Now",
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<PartnerPathwayRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to save partner pathway.");
      }

      showToast({
        tone: "success",
        title: form.id > 0 ? "Pathway Updated" : "Pathway Created",
        description: "Partner pathway saved successfully.",
      });

      setModalOpen(false);
      void loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Unable to save pathway.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/partner-pathways/${deleteId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as ApiResponse<null>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to delete pathway.");
      }

      showToast({
        tone: "success",
        title: "Pathway Deleted",
        description: "Partner pathway deleted successfully.",
      });

      setDeleteId(null);
      void loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Unable to delete pathway.",
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

      const response = await fetch("/api/admin/partner-pathways/display-order", {
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
        description: "Partner pathways reordered successfully.",
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
      const response = await fetch("/api/admin/partner-pathways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          title: row.title,
          description: row.description,
          points: row.points,
          buttonText: row.buttonText,
          displayOrder: row.displayOrder,
          isActive: nextActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<PartnerPathwayRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to update status.");
      }

      setRows((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, isActive: nextActive } : item)),
      );

      showToast({
        tone: "success",
        title: "Status Updated",
        description: `Pathway model is now ${nextActive ? "active" : "inactive"}.`,
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
      render: (row: PartnerPathwayRow) => (
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600">
          <GripVertical className="h-4 w-4 cursor-grab text-slate-400 hover:text-slate-700" />
          <span>#{row.displayOrder}</span>
        </div>
      ),
    },
    {
      key: "title",
      label: "Pathway Model",
      sortable: true,
      sortValue: (row: PartnerPathwayRow) => row.title,
      render: (row: PartnerPathwayRow) => (
        <div>
          <div className="text-sm font-semibold text-slate-900">{row.title}</div>
          <div className="text-xs text-slate-500 line-clamp-1">{row.description}</div>
        </div>
      ),
    },
    {
      key: "points",
      label: "Key Features / Points",
      render: (row: PartnerPathwayRow) => (
        <div className="text-xs text-slate-600 font-mono">
          {row.points.length} point{row.points.length === 1 ? "" : "s"} configured
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: PartnerPathwayRow) => (
        <button
          type="button"
          onClick={() => setStatusModalTarget(row)}
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#98235f]/40",
            row.isActive ? "bg-emerald-500" : "bg-slate-300",
          )}
          aria-label={`Set pathway ${row.isActive ? "inactive" : "active"}`}
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
      render: (row: PartnerPathwayRow) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            aria-label="Edit partner pathway"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 cursor-pointer"
            aria-label="Delete partner pathway"
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
            title="Partnership Pathway Header"
            description="Edit the heading and subheading for the 'Find Your Partnership Pathway' section matching the reference design."
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

          {/* Live Preview matching uploaded reference image uploaded_media_1787810959366.png */}
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

            {/* Live Preview matching reference image uploaded_media_1787810959366.png */}
            <div className="overflow-hidden rounded-[20px] bg-[#140b12] p-2 shadow-inner border border-[#2B1425]">
              <OverlayButton
                label="Edit Pathway Header"
                active={headerModalOpen}
                onClick={() => setHeaderModalOpen(true)}
                className="w-full rounded-[16px] bg-[#140b12] px-6 py-12 md:px-12 md:py-16 text-center font-sans flex flex-col items-center justify-center min-h-[240px]"
              >
                <div className="w-full max-w-3xl mx-auto my-auto text-center">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
                    {headerDraft.heading || "Find Your Partnership Pathway"}
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

      {/* Pathway Header Edit Modal */}
      <Modal
        open={headerModalOpen}
        onClose={() => setHeaderModalOpen(false)}
        title="Edit Partnership Pathway Header"
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
            placeholder="Find Your Partnership Pathway"
          />
          <AdminTextarea
            label="Subheading Description"
            rows={3}
            maxLength={250}
            value={headerDraft.description || ""}
            onChange={(event) => updateHeader("description", event.target.value)}
            error={headerErrors.description}
            counter={`${(headerDraft.description || "").length}/250`}
            placeholder="We offer distinct partnership models designed to align with your business goals."
          />
        </div>
      </Modal>

      {/* Pathway Header Discard Confirmation */}
      <ConfirmDialog
        open={headerDiscardDialog}
        title="Discard all unsaved changes?"
        description="This will restore the last saved partnership pathway header content."
        confirmLabel="Discard All"
        onConfirm={handleDiscardHeader}
        onClose={() => setHeaderDiscardDialog(false)}
      />

      <SectionHeader
        title="Partnership Pathways"
        description="Manage partnership models (System Integration, Technology, Education). Drag rows to reorder."
        action={
          <AdminButton onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Pathway Model
          </AdminButton>
        }
      />

      <AdminDataTable
        rows={filteredRows}
        columns={columns}
        rowKey={(row) => String(row.id)}
        loading={loading}
        emptyTitle="No partnership pathways found"
        emptyDescription="Create your first partnership pathway using the Add Pathway Model button."
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
                placeholder="Search pathways..."
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
        title={form.id > 0 ? "Edit Partnership Pathway" : "Add Partnership Pathway"}
        description="Enter title, target audience description, bullet points (one per line), and button label."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : form.id > 0 ? "Update Pathway" : "Create Pathway"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Pathway Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={errors.title}
            maxLength={100}
            counter={`${form.title.length}/100`}
            placeholder="e.g. System Integration Partner"
          />

          <AdminTextarea
            label="Short Description *"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            error={errors.description}
            maxLength={150}
            counter={`${form.description.length}/150`}
            placeholder="e.g. For software reselling and professional services organization."
          />

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Bullet Points
              </label>
              <button
                type="button"
                onClick={addPoint}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#98235f] hover:text-[#7d1c4e] transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Point
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {form.points.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-5 text-right select-none shrink-0">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updatePoint(index, e.target.value)}
                    placeholder={`Bullet point #${index + 1}...`}
                    maxLength={90}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs focus:border-[#98235f] focus:outline-none focus:ring-2 focus:ring-[#98235f]/20"
                  />
                  <span className="w-11 shrink-0 text-right text-[10px] font-medium text-slate-400 select-none">
                    {point.length}/90
                  </span>
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
                    disabled={form.points.length <= 1}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    aria-label="Remove point"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {errors.points ? <span className="mt-1.5 block text-xs font-medium text-rose-600">{errors.points}</span> : null}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Partnership Pathway?"
        description="Are you sure you want to delete this pathway model? This action cannot be undone."
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