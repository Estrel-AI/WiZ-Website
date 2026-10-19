"use client";

import {
  Edit3,
  GripVertical,
  Layers3,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  User,
} from "lucide-react";
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
  HomeTestimonialRow,
  ListData,
  SectionHeaderData,
  SectionHeaderUpsertPayload,
} from "@/src/types/admin-api";

const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"];

const DEFAULT_HEADER: SectionHeaderData = {
  id: 0,
  sectionKey: "TESTIMONIAL",
  badgeText: "TESTIMONIAL",
  heading: "What our builders say",
  description: "Real feedback from engineers and developers building practical AI workflows with WiiZ.",
  buttonText: null,
  buttonUrl: null,
  createdAt: "",
  updatedAt: "",
};

function resolveMediaUrl(value: string | null | undefined) {
  if (!value) return "";
  if (value.startsWith("blob:") || value.startsWith("http:") || value.startsWith("https:")) {
    return value;
  }
  return /^(testimonials|trusted-by|hero|blog|feature|impact)\//i.test(value)
    ? `/api/media/${value}`
    : value;
}

type TestimonialFormState = {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
  displayOrder: number;
  isActive: boolean;
};

function createEmptyForm(): TestimonialFormState {
  return {
    id: 0,
    name: "",
    role: "",
    image: "",
    quote: "",
    displayOrder: 0,
    isActive: true,
  };
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

export default function AdminTestimonialsPage() {
  const { showToast } = useAdminToast();

  const [headerSaved, setHeaderSaved] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerDraft, setHeaderDraft] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerSaving, setHeaderSaving] = useState(false);
  const [headerErrors, setHeaderErrors] = useState<Record<string, string>>({});
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [headerDiscardDialog, setHeaderDiscardDialog] = useState(false);

  const [rows, setRows] = useState<HomeTestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const dragRowIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<TestimonialFormState>(createEmptyForm());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    fetch("/api/admin/section-headers/TESTIMONIAL", { cache: "no-store" })
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

  async function loadRows(searchQuery = search) {
    setLoading(true);
    try {
      const url = searchQuery
        ? `/api/admin/testimonials?search=${encodeURIComponent(searchQuery)}`
        : `/api/admin/testimonials`;
      const response = await fetch(url, { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<ListData<HomeTestimonialRow>>;

      if (response.ok && payload.data) {
        setRows(payload.data.result);
      } else {
        throw new Error(payload.error || payload.message || "Failed to load testimonials.");
      }
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load failed",
        description: error instanceof Error ? error.message : "Unable to fetch testimonials.",
      });
    } finally {
      setLoading(false);
    }
  }

  useState(() => {
    void loadRows();
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    void loadRows(value);
  }

  function openCreate() {
    setForm({
      ...createEmptyForm(),
      displayOrder: rows.length + 1,
    });
    setSelectedFile(null);
    setPreview(null);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(row: HomeTestimonialRow) {
    setForm({
      id: row.id,
      name: row.name,
      role: row.role,
      image: row.image ?? "",
      quote: row.quote,
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
    setSelectedFile(null);
    setPreview(row.image ?? null);
    setErrors({});
    setModalOpen(true);
  }

  function handleFileSelect(file: File | null) {
    if (!file) return;
    if (!allowedTypes.includes(file.type) || !/\.(jpe?g|png|svg|webp)$/i.test(file.name)) {
      setErrors((prev) => ({ ...prev, file: "Avatar must be a JPG, JPEG, PNG, SVG, or WEBP image." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "Avatar image must be 5 MB or less." }));
      return;
    }
    setErrors((prev) => ({ ...prev, file: "" }));
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Author name is required.";
    } else if (form.name.trim().length > 20) {
      nextErrors.name = "Maximum 20 characters.";
    }
    if (!form.role.trim()) {
      nextErrors.role = "Role / Designation is required.";
    } else if (form.role.trim().length > 20) {
      nextErrors.role = "Maximum 20 characters.";
    }
    if (!form.quote.trim()) {
      nextErrors.quote = "Testimonial quote is required.";
    } else if (form.quote.trim().length > 250) {
      nextErrors.quote = "Maximum 250 characters.";
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
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id || undefined,
          name: form.name.trim(),
          role: form.role.trim(),
          image: form.image.trim() || undefined,
          quote: form.quote.trim(),
          displayOrder: form.displayOrder || rows.length + 1,
          isActive: form.isActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<{ id: number; action: string }>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to save testimonial.");
      }

      const rowId = payload.data.id;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("rowId", String(rowId));
        uploadData.append("file", selectedFile);

        const uploadResponse = await fetch("/api/admin/testimonials/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadPayload = (await uploadResponse.json()) as ApiResponse<unknown>;
        if (!uploadResponse.ok || !uploadPayload.success) {
          throw new Error(uploadPayload.error || uploadPayload.message || "Failed to upload avatar image.");
        }
      }

      await loadRows(search);
      setModalOpen(false);
      showToast({
        tone: "success",
        title: form.id > 0 ? "Testimonial updated" : "Testimonial created",
        description: "The testimonial and avatar image were saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save testimonial.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${deleteId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as ApiResponse<{ deletedId: number }>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Unable to delete testimonial.");
      }

      setDeleteId(null);
      await loadRows(search);
      showToast({
        tone: "success",
        title: "Testimonial deleted",
        description: "The testimonial was removed successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete testimonial.",
      });
    }
  }

  async function persistRowOrder(nextRows: HomeTestimonialRow[]) {
    setReordering(true);
    try {
      const response = await fetch("/api/admin/testimonials/display-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: nextRows.map((item, index) => ({
            id: item.id,
            displayOrder: index + 1,
          })),
        }),
      });
      const payload = (await response.json()) as ApiResponse<unknown>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to update order.");
      }
      setRows(nextRows.map((item, index) => ({ ...item, displayOrder: index + 1 })));
      showToast({
        tone: "success",
        title: "Order saved",
        description: "Testimonials order updated successfully.",
      });
    } catch (error) {
      await loadRows();
      showToast({
        tone: "error",
        title: "Reorder failed",
        description: error instanceof Error ? error.message : "Unable to reorder testimonials.",
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

  const [statusModalTarget, setStatusModalTarget] = useState<HomeTestimonialRow | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  async function executeStatusToggle() {
    if (!statusModalTarget) return;
    const row = statusModalTarget;
    const nextActive = !row.isActive;
    setStatusUpdating(true);
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          name: row.name,
          role: row.role,
          image: row.image || undefined,
          quote: row.quote,
          displayOrder: row.displayOrder,
          isActive: nextActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<{ id: number }>;
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
        description: `Testimonial from ${row.name} is now ${nextActive ? "active" : "inactive"}.`,
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

function updateHeader<K extends keyof SectionHeaderData>(key: K, value: SectionHeaderData[K]) {
    setHeaderDraft((current) => ({ ...current, [key]: value }));
    setHeaderErrors((current) => ({ ...current, [key]: "" }));
  }

  function validateHeader() {
    const next: Record<string, string> = {};
    if (headerDraft.badgeText && headerDraft.badgeText.length > 60) next.badgeText = "Maximum 60 characters.";
    if (!headerDraft.heading.trim()) next.heading = "Heading is required.";
    if (headerDraft.heading.length > 113) next.heading = "Maximum 113 characters.";
    if (!headerDraft.description || !headerDraft.description.trim()) next.description = "Description is required.";
    if (headerDraft.description && headerDraft.description.length > 154) next.description = "Maximum 154 characters.";
    setHeaderErrors(next);
    return !Object.keys(next).length;
  }

  async function saveHeader() {
    if (!validateHeader()) return;
    setHeaderSaving(true);
    try {
      const body: SectionHeaderUpsertPayload = {
        badgeText: headerDraft.badgeText?.trim() || null,
        heading: headerDraft.heading.trim(),
        description: headerDraft.description?.trim() || null,
      };
      const response = await fetch("/api/admin/section-headers/TESTIMONIAL", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as ApiResponse<{ id: number }>;
      if (!response.ok || !payload.success) throw new Error(payload.error || payload.message);
      const next = { ...headerDraft, id: payload.data?.id ?? headerDraft.id, updatedAt: new Date().toISOString() };
      setHeaderSaved(next);
      setHeaderDraft(next);
      setHeaderModalOpen(false);
      showToast({
        tone: "success",
        title: "Testimonial Header updated",
        description: "The homepage testimonial header was saved successfully.",
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

  const hasHeaderChanges = JSON.stringify(headerSaved) !== JSON.stringify(headerDraft);

  function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function AuthorAvatar({
  name,
  image,
  className = "h-10 w-10 text-xs font-bold",
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const resolvedUrl = resolveMediaUrl(image);

  useEffect(() => {
    setImgError(false);
  }, [image]);

  if (!resolvedUrl || imgError) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#98235f] to-[#60143a] font-bold text-white shadow-xs",
          className,
        )}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={resolvedUrl}
      alt={name}
      onError={() => setImgError(true)}
      className={cn("shrink-0 border border-slate-200 object-cover shadow-xs", className)}
    />
  );
}

  const columns = [
    {
      key: "order",
      label: "Order",
      className: "w-20",
      render: (row: HomeTestimonialRow) => (
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-600">
          <GripVertical className="h-4 w-4 cursor-grab text-slate-400 hover:text-slate-700" />
          <span>#{row.displayOrder}</span>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      sortable: true,
      sortValue: (row: HomeTestimonialRow) => row.name,
      render: (row: HomeTestimonialRow) => (
        <div className="flex items-center gap-3">
          <AuthorAvatar name={row.name} image={row.image} className="h-10 w-10 text-xs font-bold" />
          <div>
            <div className="font-bold text-slate-900">{row.name}</div>
            <div className="text-xs font-medium text-slate-500">{row.role}</div>
          </div>
        </div>
      ),
    },
    {
      key: "quote",
      label: "Quote",
      render: (row: HomeTestimonialRow) => (
        <p className="line-clamp-2 max-w-lg text-xs font-normal leading-relaxed text-slate-600">
          &quot;{row.quote}&quot;
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: HomeTestimonialRow) => (
        <button
          type="button"
          onClick={() => setStatusModalTarget(row)}
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#98235f]/40",
            row.isActive ? "bg-emerald-500" : "bg-slate-300",
          )}
          aria-label={`Set testimonial from ${row.name} ${row.isActive ? "inactive" : "active"}`}
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
      render: (row: HomeTestimonialRow) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            onClick={() => openEdit(row)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
            onClick={() => setDeleteId(row.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
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
            title="Testimonial Header"
            description="Edit Section Badge, Main Heading, Description only"
            action={
              <div className="flex items-center gap-3">
                <AdminButton
                  variant="secondary"
                  onClick={() => setHeaderDiscardDialog(true)}
                  disabled={!hasHeaderChanges || headerSaving}
                >
                  Discard
                </AdminButton>
                <AdminButton onClick={() => void saveHeader()} disabled={headerSaving || !hasHeaderChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  {headerSaving ? "Saving..." : "Save Changes"}
                </AdminButton>
              </div>
            }
          />

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

            <div className="overflow-hidden rounded-[24px] bg-[#1C0D17] p-2 shadow-inner border border-[#2B1826]">
              <OverlayButton
                label="Edit Testimonial Header"
                active={headerModalOpen}
                onClick={() => setHeaderModalOpen(true)}
                className="block w-full rounded-[20px] bg-[#1C0D17] px-6 py-10 font-sans md:px-10 md:py-12"
              >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
                  <div className="flex flex-col items-start">
                    <div className="mb-4 inline-block rounded-full border border-[#5E4A47] bg-[#211A2533] px-3.5 py-1">
                      <span className="text-[12px] font-bold uppercase tracking-widest text-[#E68F17]">
                        {headerDraft.badgeText || "TESTIMONIAL"}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.5rem] leading-tight">
                      {headerDraft.heading || "What our builders say"}
                    </h2>
                    <p className="mt-3 text-base font-light text-[#EBEBEB] md:text-lg">
                      {headerDraft.description ||
                        "Real feedback from engineers and developers building practical AI workflows with WiiZ."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-gradient-to-t from-[#2A0E1C] to-[#00000000] p-6 text-white shadow-2xl">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#98235f] text-xs font-bold text-white shadow-sm">
                        PA
                      </div>
                      <div>
                        <div className="text-base font-semibold text-white">Paarth</div>
                        <div className="text-xs text-white/60">AI Engineer</div>
                      </div>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-white/80">
                      &quot;Using WiiZ has significantly improved the way I build and manage AI workflows. The platform is intuitive yet powerful.&quot;
                    </p>
                  </div>
                </div>
              </OverlayButton>
            </div>
          </AdminCard>
        </div>
      )}

      <Modal
        open={headerModalOpen}
        onClose={() => setHeaderModalOpen(false)}
        title="Edit Testimonial Header"
        description="Update the section badge, main heading, and description."
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
            label="Section Badge"
            maxLength={60}
            value={headerDraft.badgeText || ""}
            onChange={(event) => updateHeader("badgeText", event.target.value)}
            error={headerErrors.badgeText}
            counter={`${(headerDraft.badgeText || "").length}/60 characters (including spaces)`}
            placeholder="TESTIMONIAL"
          />
          <AdminInput
            label="Main Heading"
            maxLength={113}
            value={headerDraft.heading}
            onChange={(event) => updateHeader("heading", event.target.value)}
            error={headerErrors.heading}
            counter={`${(headerDraft.heading || "").length}/113 characters (including spaces)`}
            placeholder="What our builders say"
          />
          <AdminTextarea
            label="Description"
            maxLength={154}
            value={headerDraft.description || ""}
            onChange={(event) => updateHeader("description", event.target.value)}
            error={headerErrors.description}
            counter={`${(headerDraft.description || "").length}/154 characters (including spaces)`}
            placeholder="Real feedback from engineers and developers building practical AI workflows with WiiZ."
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={headerDiscardDialog}
        title="Discard all unsaved changes?"
        description="This will restore the last saved testimonial header content."
        confirmLabel="Discard All"
        onConfirm={handleDiscardHeader}
        onClose={() => setHeaderDiscardDialog(false)}
      />

      <SectionHeader
        title="Testimonials"
        description="Manage customer & builder testimonials. Drag rows to change display order."
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </AdminButton>
        }
      />

      {reordering ? (
        <div className="rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800 shadow-xs">
          Saving testimonial display order...
        </div>
      ) : null}

      <AdminDataTable
        rows={filteredRows}
        columns={columns}
        rowKey={(row) => String(row.id)}
        loading={loading}
        emptyTitle="No testimonials found"
        emptyDescription="Create your first testimonial using the Add Testimonial button."
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
              <div className="max-w-[420px]">
                <SearchField
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search testimonials by name, role, or quote..."
                />
              </div>
            }
            secondaryActions={
              <AdminSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </AdminSelect>
            }
          />
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id > 0 ? "Edit Testimonial" : "Add Testimonial"}
        description="Fill out author name, role, avatar image, quote text, and order."
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : form.id > 0 ? "Update Testimonial" : "Save Testimonial"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Avatar Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/70 shadow-inner overflow-hidden">
                {preview ? (
                  <img src={resolveMediaUrl(preview)} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-slate-400" />
                )}
              </div>
              <div className="w-full flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full cursor-pointer flex-col items-center justify-center rounded-[14px] border-2 border-dashed border-slate-300 bg-white/60 p-4 text-center backdrop-blur-md transition hover:border-[#98235f] hover:bg-white/80"
                >
                  <Upload className="mb-1 h-5 w-5 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedFile ? selectedFile.name : "Click to upload avatar image or drag & drop"}
                  </span>
                  <span className="text-[11px] text-slate-500">JPG, PNG, WEBP, SVG up to 5MB</span>
                </button>
              </div>
            </div>
            {errors.file ? <p className="text-xs font-medium text-rose-600">{errors.file}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label="Author Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              placeholder="e.g. Paarth"
              maxLength={20}
              counter={`${form.name.length}/20`}
            />
            <AdminInput
              label="Role / Designation"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              error={errors.role}
              placeholder="e.g. AI Engineer"
              maxLength={20}
              counter={`${form.role.length}/20`}
            />
          </div>

          <AdminTextarea
            label="Testimonial Quote"
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            error={errors.quote}
            placeholder="Write the full testimonial quote here..."
            maxLength={250}
            counter={`${form.quote.length}/250`}
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
        title="Delete Testimonial?"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmLabel="Delete Testimonial"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}