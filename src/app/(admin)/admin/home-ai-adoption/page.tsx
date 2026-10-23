"use client";

import {
  Edit3,
  GripVertical,
  Image as ImageIcon,
  Layers3,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { ImageUploadField } from "@/src/components/admin/admin-image-upload";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { cn } from "@/src/lib/utils";
import type {
  ApiResponse,
  HomeAiAdoptionCardRow,
  SectionHeaderData,
  SectionHeaderUpsertPayload,
} from "@/src/types/admin-api";

type FormState = {
  id: number;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
  displayOrder: number;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  id: 0,
  title: "",
  description: "",
  image: "",
  ctaText: "Book an Appointment",
  ctaUrl: "/contact",
  displayOrder: 1,
  isActive: true,
};

const DEFAULT_HEADER: SectionHeaderData = {
  id: 0,
  sectionKey: "AI_ADOPTION_HEADER",
  badgeText: null,
  heading: "Accelerating Enterprise AI Adoption",
  description:
    "Empowering business teams, IT governance, system integrators, and product leaders to deploy agentic AI seamlessly.",
  buttonText: null,
  buttonUrl: null,
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

export default function AdminHomeAiAdoptionPage() {
  const { showToast } = useAdminToast();

  const [headerSaved, setHeaderSaved] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerDraft, setHeaderDraft] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerSaving, setHeaderSaving] = useState(false);
  const [headerErrors, setHeaderErrors] = useState<Record<string, string>>({});
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [headerDiscardDialog, setHeaderDiscardDialog] = useState(false);

  const [rows, setRows] = useState<HomeAiAdoptionCardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [pendingStatusRow, setPendingStatusRow] = useState<HomeAiAdoptionCardRow | null>(null);
  const [pendingDeleteRow, setPendingDeleteRow] = useState<HomeAiAdoptionCardRow | null>(null);
  const draggedRowIdRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/section-headers/AI_ADOPTION_HEADER", { cache: "no-store" })
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
      const response = await fetch("/api/admin/home-ai-adoption", { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<HomeAiAdoptionCardRow[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to load AI adoption cards.");
      }
      setRows(payload.data);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Unable to fetch AI adoption cards.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const isHeaderDirty = headerSaved.heading !== headerDraft.heading || headerSaved.description !== headerDraft.description;

  function validateHeader() {
    const newErrors: Record<string, string> = {};
    if (!headerDraft.heading.trim()) {
      newErrors.heading = "Heading is required.";
    }
    setHeaderErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSaveHeader() {
    if (!validateHeader()) {
      setHeaderModalOpen(true);
      return;
    }

    setHeaderSaving(true);
    try {
      const payload: SectionHeaderUpsertPayload = {
        sectionKey: "AI_ADOPTION_HEADER",
        badgeText: null,
        heading: headerDraft.heading.trim(),
        description: headerDraft.description ? headerDraft.description.trim() : null,
        buttonText: null,
        buttonUrl: null,
      };

      const response = await fetch("/api/admin/section-headers/AI_ADOPTION_HEADER", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ApiResponse<SectionHeaderData>;

      if (!response.ok || !data.success || !data.data) {
        throw new Error(data.error || data.message || "Failed to update AI Adoption header.");
      }

      setHeaderSaved(data.data);
      setHeaderDraft(data.data);
      setHeaderModalOpen(false);
      showToast({
        tone: "success",
        title: "Header updated",
        description: "AI Adoption header settings saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not save settings.",
      });
    } finally {
      setHeaderSaving(false);
    }
  }

  function handleDiscardHeader() {
    setHeaderDraft(headerSaved);
    setHeaderErrors({});
    setHeaderDiscardDialog(false);
    showToast({
      tone: "error",
      title: "Changes discarded",
      description: "Restored previous saved content.",
    });
  }

  function openCreateModal() {
    setForm({
      ...EMPTY_FORM,
      displayOrder: rows.length + 1,
    });
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(row: HomeAiAdoptionCardRow) {
    setForm({
      id: row.id,
      title: row.title,
      description: row.description,
      image: row.image,
      ctaText: row.ctaText,
      ctaUrl: row.ctaUrl,
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = "Card title is required.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (!form.image.trim()) nextErrors.image = "Card image is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/home-ai-adoption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id > 0 ? form.id : undefined,
          title: form.title.trim(),
          description: form.description.trim(),
          image: form.image.trim(),
          ctaText: form.ctaText.trim() || "Book an Appointment",
          ctaUrl: form.ctaUrl.trim() || "/contact",
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<HomeAiAdoptionCardRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to save card.");
      }

      showToast({
        tone: "success",
        title: form.id > 0 ? "Card Updated" : "Card Created",
        description: `Adoption card "${payload.data?.title}" saved successfully.`,
      });
      setModalOpen(false);
      await loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Unable to save card.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus() {
    if (!pendingStatusRow) return;
    try {
      const response = await fetch("/api/admin/home-ai-adoption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pendingStatusRow.id,
          title: pendingStatusRow.title,
          description: pendingStatusRow.description,
          image: pendingStatusRow.image,
          ctaText: pendingStatusRow.ctaText,
          ctaUrl: pendingStatusRow.ctaUrl,
          displayOrder: pendingStatusRow.displayOrder,
          isActive: !pendingStatusRow.isActive,
        }),
      });
      const payload = (await response.json()) as ApiResponse<HomeAiAdoptionCardRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Status update failed.");
      }

      showToast({
        tone: "success",
        title: "Status Updated",
        description: `Card "${pendingStatusRow.title}" is now ${!pendingStatusRow.isActive ? "Active" : "Inactive"}.`,
      });
      setPendingStatusRow(null);
      await loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Could not toggle status.",
      });
    }
  }

  async function handleDelete() {
    if (!pendingDeleteRow) return;
    try {
      const response = await fetch(`/api/admin/home-ai-adoption/${pendingDeleteRow.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as ApiResponse<boolean>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to delete card.");
      }

      showToast({
        tone: "success",
        title: "Card Deleted",
        description: `Card "${pendingDeleteRow.title}" removed.`,
      });
      setPendingDeleteRow(null);
      await loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Could not delete card.",
      });
    }
  }

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
      const response = await fetch("/api/admin/home-ai-adoption/display-order", {
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
        description: "Adoption cards display order saved successfully.",
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

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter === "active" && !r.isActive) return false;
      if (statusFilter === "inactive" && r.isActive) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    });
  }, [rows, search, statusFilter]);

  const columns = [
    {
      key: "drag",
      label: "",
      className: "w-10 text-center",
      render: () => (
        <div className="flex cursor-grab items-center justify-center text-slate-400 hover:text-slate-600 active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </div>
      ),
    },
    {
      key: "displayOrder",
      label: "Order",
      className: "w-16 text-center",
      render: (row: HomeAiAdoptionCardRow) => (
        <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-slate-200 bg-slate-100 font-mono text-xs font-semibold text-slate-700">
          {row.displayOrder}
        </span>
      ),
    },
    {
      key: "image",
      label: "Image",
      className: "w-20",
      render: (row: HomeAiAdoptionCardRow) => (
        <div className="relative h-12 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs">
          {row.image ? (
            <Image src={row.image} alt={row.title} fill unoptimized className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <ImageIcon className="h-4 w-4" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Card Title & Description",
      render: (row: HomeAiAdoptionCardRow) => (
        <div className="space-y-0.5 max-w-sm">
          <div className="font-semibold text-slate-900">{row.title}</div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{row.description}</p>
        </div>
      ),
    },
    {
      key: "cta",
      label: "CTA Button",
      render: (row: HomeAiAdoptionCardRow) => (
        <div className="space-y-1">
          <span className="inline-flex rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-[#98235f] border border-pink-200">
            {row.ctaText}
          </span>
          <div className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">
            {row.ctaUrl}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "w-24 text-center",
      render: (row: HomeAiAdoptionCardRow) => (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setPendingStatusRow(row)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-2xs",
              row.isActive ? "bg-emerald-500" : "bg-slate-300",
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                row.isActive ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-24 text-right",
      render: (row: HomeAiAdoptionCardRow) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            aria-label="Edit card"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setPendingDeleteRow(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 cursor-pointer"
            aria-label="Delete card"
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
        <LoadingSkeleton rows={4} />
      ) : (
        <div className="space-y-6">
          <SectionHeader
            title="AI Adoption Section Header Editor"
            description="Manage the heading and description displayed in the 'Accelerating Enterprise AI Adoption' section on the Home Page."
            action={
              <div className="flex items-center gap-3">
                {isHeaderDirty ? (
                  <AdminButton variant="secondary" onClick={() => setHeaderDiscardDialog(true)} disabled={headerSaving}>
                    Discard
                  </AdminButton>
                ) : null}
                <AdminButton onClick={() => void handleSaveHeader()} disabled={headerSaving || !isHeaderDirty}>
                  <Save className="mr-2 h-4 w-4" />
                  {headerSaving ? "Saving..." : "Save Changes"}
                </AdminButton>
              </div>
            }
          />

          <AdminCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#98235f]" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Live Header Preview</h3>
              </div>
              <AdminButton variant="secondary" onClick={() => setHeaderModalOpen(true)} className="text-xs">
                <Edit3 className="mr-1.5 h-4 w-4" />
                Edit Text Content
              </AdminButton>
            </div>

            <OverlayButton label="Click to Edit AI Adoption Header" onClick={() => setHeaderModalOpen(true)}>
              <div className="relative flex flex-col items-center justify-center min-h-[200px] overflow-hidden rounded-2xl border border-white/10 bg-[#1e0f1b] px-6 py-12 text-center shadow-lg">
                <div className="relative z-10 mx-auto max-w-3xl space-y-3">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                    {headerDraft.heading || "Accelerating Enterprise AI Adoption"}
                  </h2>
                  {headerDraft.description ? (
                    <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                      {headerDraft.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </OverlayButton>
          </AdminCard>
        </div>
      )}

      <Modal
        open={headerModalOpen}
        onClose={() => setHeaderModalOpen(false)}
        title="Edit AI Adoption Section Header"
        description="Update the title and optional subheading for the AI Adoption section."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setHeaderModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSaveHeader()} disabled={headerSaving}>
              {headerSaving ? "Saving..." : "Save Header"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Section Heading *"
            value={headerDraft.heading}
            onChange={(e) => setHeaderDraft((prev) => ({ ...prev, heading: e.target.value }))}
            error={headerErrors.heading}
            maxLength={113}
            counter={`${(headerDraft.heading || "").length}/113 characters (including spaces)`}
            placeholder="Accelerating Enterprise AI Adoption"
          />

          <AdminTextarea
            label="Section Description"
            rows={3}
            value={headerDraft.description ?? ""}
            onChange={(e) => setHeaderDraft((prev) => ({ ...prev, description: e.target.value }))}
            maxLength={154}
            counter={`${(headerDraft.description ?? "").length}/154 characters (including spaces)`}
            placeholder="Empowering business teams, IT governance, system integrators..."
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={headerDiscardDialog}
        title="Discard Unsaved Changes?"
        description="Are you sure you want to discard your edits and revert to the saved version?"
        confirmLabel="Discard Changes"
        onConfirm={handleDiscardHeader}
        onClose={() => setHeaderDiscardDialog(false)}
      />

      <SectionHeader
        title="Accelerating Enterprise AI Adoption Cards"
        description="Manage the target audience and adoption cards displayed on the Home Page. Drag rows to reorder items."
        action={
          <AdminButton onClick={openCreateModal}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Adoption Card
          </AdminButton>
        }
      />

      <AdminDataTable
        rows={filteredRows}
        columns={columns}
        rowKey={(row) => String(row.id)}
        loading={loading || reordering}
        emptyTitle="No AI adoption cards found"
        emptyDescription="Create your first adoption card or re-enable existing items."
        pageSize={10}
        rowProps={(row) => ({
          draggable: !reordering,
          onDragStart: () => handleDragStart(row.id),
          onDragOver: (event) => event.preventDefault(),
          onDrop: () => void handleDrop(row.id),
          className: "cursor-grab active:cursor-grabbing hover:bg-slate-50/80 transition-colors",
        })}
        toolbar={
          <AdminTableToolbar
            search={
              <SearchField
                value={search}
                onChange={setSearch}
                placeholder="Search card title or description..."
              />
            }
            secondaryActions={
              <AdminSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                className="w-36"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </AdminSelect>
            }
          />
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id > 0 ? "Edit AI Adoption Card" : "Add New AI Adoption Card"}
        description="Fill in the details for the adoption card."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : form.id > 0 ? "Save Changes" : "Create Card"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Card Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={errors.title}
            maxLength={30}
            counter={`${(form.title || "").length}/30 characters (including spaces)`}
            placeholder="e.g. Enterprise IT & AI Governance"
          />

          <AdminTextarea
            label="Description *"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            error={errors.description}
            maxLength={110}
            counter={`${(form.description || "").length}/110 characters (including spaces)`}
            placeholder="Maintain centralized control, governance, security, and compliance..."
          />

          <ImageUploadField
            label="Card Image *"
            value={form.image}
            folder="impact"
            aspectRatio="wide"
            onChange={(url) => setForm({ ...form, image: url ?? "" })}
            error={errors.image}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminInput
              label="CTA Button Label"
              value={form.ctaText}
              onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
              maxLength={20}
              counter={`${(form.ctaText || "").length}/20 characters (including spaces)`}
              placeholder="Book an Appointment"
            />
            <AdminInput
              label="CTA Button Link"
              value={form.ctaUrl}
              onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
              placeholder="/contact or /partner"
            />
            <AdminSelect
              label="Status"
              value={form.isActive ? "active" : "inactive"}
              onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </AdminSelect>
          </div>
        </div>
      </Modal>

      {pendingStatusRow ? (
        <StatusConfirmModal
          open={Boolean(pendingStatusRow)}
          onClose={() => setPendingStatusRow(null)}
          onConfirm={() => void handleToggleStatus()}
          title={`Change status of "${pendingStatusRow.title}"?`}
          targetStatus={pendingStatusRow.isActive ? "inactive" : "active"}
        />
      ) : null}

      {pendingDeleteRow ? (
        <ConfirmDialog
          open={Boolean(pendingDeleteRow)}
          onClose={() => setPendingDeleteRow(null)}
          onConfirm={() => void handleDelete()}
          title="Delete Adoption Card?"
          description={`Are you sure you want to permanently delete "${pendingDeleteRow.title}"?`}
          confirmLabel="Delete Card"
        />
      ) : null}
    </div>
  );
}