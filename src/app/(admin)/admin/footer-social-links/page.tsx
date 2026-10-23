"use client";

import {
  ChevronDown,
  Dribbble,
  Facebook,
  Figma,
  Github,
  Globe,
  GripVertical,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  MessageSquare,
  Music,
  Pencil,
  Phone,
  Plus,
  Rss,
  Send,
  Share2,
  Trash2,
  Tv,
  Twitter,
  Video,
  Youtube,
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
import type { ApiResponse, FooterSocialLinkRow } from "@/src/types/admin-api";

function ProductHuntIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1.53 11.15h-2.44v3.32H8.91V7.53h4.62a2.81 2.81 0 0 1 0 5.62Zm-.1-3.58h-2.34v1.54h2.34a.77.77 0 0 0 0-1.54Z"
      />
    </svg>
  );
}

const ICON_OPTIONS = [
  { value: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { value: "instagram", label: "Instagram", Icon: Instagram },
  { value: "youtube", label: "YouTube", Icon: Youtube },
  { value: "facebook", label: "Facebook", Icon: Facebook },
  { value: "twitter", label: "X / Twitter", Icon: Twitter },
  { value: "github", label: "GitHub", Icon: Github },
  { value: "producthunt", label: "Product Hunt", Icon: ProductHuntIcon },
  { value: "discord", label: "Discord", Icon: MessageCircle },
  { value: "whatsapp", label: "WhatsApp", Icon: MessageSquare },
  { value: "telegram", label: "Telegram", Icon: Send },
  { value: "threads", label: "Threads", Icon: Share2 },
  { value: "tiktok", label: "TikTok", Icon: Video },
  { value: "twitch", label: "Twitch", Icon: Tv },
  { value: "figma", label: "Figma", Icon: Figma },
  { value: "dribbble", label: "Dribbble", Icon: Dribbble },
  { value: "spotify", label: "Spotify", Icon: Music },
  { value: "rss", label: "RSS Feed", Icon: Rss },
  { value: "email", label: "Email / Mail", Icon: Mail },
  { value: "phone", label: "Phone", Icon: Phone },
  { value: "globe", label: "Website / Globe", Icon: Globe },
];

function getIconComponent(iconName: string) {
  const found = ICON_OPTIONS.find((opt) => opt.value === iconName.toLowerCase());
  return found ? found.Icon : Globe;
}

type FormState = {
  id: number;
  platformName: string;
  icon: string;
  url: string;
  displayOrder: number;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  id: 0,
  platformName: "",
  icon: "linkedin",
  url: "",
  displayOrder: 1,
  isActive: true,
};

export default function AdminFooterSocialLinksPage() {
  const { showToast } = useAdminToast();
  const [rows, setRows] = useState<FooterSocialLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [statusModalTarget, setStatusModalTarget] = useState<FooterSocialLinkRow | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  const draggedRowIdRef = useRef<number | null>(null);
  const pageSize = 10;

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/footer-social-links", { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<FooterSocialLinkRow[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to load social links.");
      }
      setRows(payload.data);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Unable to fetch social links.",
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
    setIconSearch("");
    setModalOpen(true);
  }

  function openEditModal(row: FooterSocialLinkRow) {
    setForm({
      id: row.id,
      platformName: row.platformName,
      icon: row.icon,
      url: row.url,
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
    setErrors({});
    setIconSearch("");
    setModalOpen(true);
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    if (!form.platformName.trim()) nextErrors.platformName = "Platform name is required.";
    if (!form.url.trim()) nextErrors.url = "URL is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/footer-social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id > 0 ? form.id : undefined,
          platformName: form.platformName.trim(),
          icon: form.icon,
          url: form.url.trim(),
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        }),
      });

      const payload = (await response.json()) as ApiResponse<FooterSocialLinkRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to save social link.");
      }

      showToast({
        tone: "success",
        title: form.id > 0 ? "Social Link Updated" : "Social Link Created",
        description: "Social link saved successfully.",
      });
      setModalOpen(false);
      await loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Unable to save social link.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/admin/footer-social-links/${deleteId}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as ApiResponse<boolean>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to delete social link.");
      }
      showToast({
        tone: "success",
        title: "Social Link Deleted",
        description: "The social media link has been removed.",
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
      const response = await fetch("/api/admin/footer-social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: statusModalTarget.id,
          platformName: statusModalTarget.platformName,
          icon: statusModalTarget.icon,
          url: statusModalTarget.url,
          displayOrder: statusModalTarget.displayOrder,
          isActive: !statusModalTarget.isActive,
        }),
      });
      const payload = (await response.json()) as ApiResponse<FooterSocialLinkRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to update status.");
      }
      showToast({
        tone: "success",
        title: "Status Updated",
        description: `Social link is now ${!statusModalTarget.isActive ? "Active" : "Inactive"}.`,
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
        r.platformName.toLowerCase().includes(search.toLowerCase()) ||
        r.url.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && r.isActive) ||
        (statusFilter === "inactive" && !r.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const filteredIcons = useMemo(() => {
    if (!iconSearch.trim()) return ICON_OPTIONS;
    const q = iconSearch.toLowerCase().trim();
    return ICON_OPTIONS.filter(
      (opt) => opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q),
    );
  }, [iconSearch]);

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
      const response = await fetch("/api/admin/footer-social-links/display-order", {
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
        description: "Footer social links display order saved.",
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
      render: (row: FooterSocialLinkRow) => (
        <div className="flex cursor-grab items-center justify-center text-slate-400 hover:text-slate-600 active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </div>
      ),
    },
    {
      key: "platformName",
      label: "Platform Name & Icon",
      render: (row: FooterSocialLinkRow) => {
        const IconComponent = getIconComponent(row.icon);
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-[#1C0D17] text-white shadow-xs">
              <IconComponent className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-sm">{row.platformName}</div>
              <div className="text-[11px] text-slate-500 font-mono">icon: {row.icon}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "url",
      label: "URL",
      render: (row: FooterSocialLinkRow) => (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#98235f] font-semibold hover:underline max-w-xs truncate block font-mono bg-pink-50/60 px-2.5 py-1 rounded-md border border-pink-100"
        >
          {row.url}
        </a>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: FooterSocialLinkRow) => (
        <button
          type="button"
          onClick={() => setStatusModalTarget(row)}
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#98235f]/40",
            row.isActive ? "bg-emerald-500" : "bg-slate-300",
          )}
          aria-label={`Set ${row.platformName} ${row.isActive ? "inactive" : "active"}`}
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
      render: (row: FooterSocialLinkRow) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            aria-label="Edit social link"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50 cursor-pointer"
            aria-label="Delete social link"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton rows={6} />;

  const SelectedIconComponent = getIconComponent(form.icon);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Footer Social Media Links"
        description="Add, edit, delete, activate/deactivate, and reorder social media icons with modern platform icon choices."
        action={
          <AdminButton onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Social Link
          </AdminButton>
        }
      />

      <AdminDataTable
        rows={filteredRows}
        columns={columns}
        rowKey={(row) => String(row.id)}
        loading={loading}
        emptyTitle="No social links found"
        emptyDescription="Add your first social media link using the Add Social Link button."
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
                placeholder="Search platform name or URL..."
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
        title={form.id > 0 ? "Edit Social Media Link" : "Add Social Media Link"}
        description="Configure platform name, pick a modern icon, target URL, and status."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : form.id > 0 ? "Update Link" : "Create Link"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <AdminInput
            label="Platform Name *"
            value={form.platformName}
            onChange={(e) => setForm({ ...form, platformName: e.target.value })}
            error={errors.platformName}
            placeholder="e.g. LinkedIn, Instagram, YouTube, X, Product Hunt, GitHub, WhatsApp"
          />

          {/* Compact Click-to-Expand Icon Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Platform Icon *
            </label>

            <button
              type="button"
              onClick={() => setShowIconPicker((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1C0D17] text-white shadow-xs">
                  <SelectedIconComponent className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold text-slate-800">
                  {ICON_OPTIONS.find((o) => o.value === form.icon.toLowerCase())?.label || form.icon}
                </span>
                <span className="text-xs text-slate-400 font-mono">({form.icon})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#98235f] font-semibold">
                <span>{showIconPicker ? "Close Icon Picker" : "Select Icon"}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", showIconPicker && "rotate-180")} />
              </div>
            </button>

            {showIconPicker ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3 space-y-3 shadow-sm animate-in fade-in duration-150">
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Search modern icons (e.g., github, twitter, whatsapp, discord...)"
                  className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-2xs focus:border-[#98235f] focus:outline-none"
                />

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {filteredIcons.map((opt) => {
                    const IconComp = opt.Icon;
                    const isSelected = form.icon.toLowerCase() === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            icon: opt.value,
                            platformName: prev.platformName ? prev.platformName : opt.label,
                          }));
                          setShowIconPicker(false);
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-medium transition cursor-pointer gap-1 text-center",
                          isSelected
                            ? "border-[#98235f] bg-[#98235f] text-white shadow-xs font-bold"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100",
                        )}
                      >
                        <IconComp className={cn("h-4 w-4 shrink-0", isSelected ? "text-white" : "text-slate-800")} />
                        <span className="truncate w-full text-[10px]">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <AdminInput
            label="Platform URL *"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            error={errors.url}
            placeholder="https://..."
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Social Media Link?"
        description="Are you sure you want to remove this social link from the footer? This action cannot be undone."
        confirmLabel="Delete Link"
        onConfirm={() => void handleDeleteConfirm()}
        onClose={() => setDeleteId(null)}
      />

      {/* Status Toggle Modal */}
      <StatusConfirmModal
        open={Boolean(statusModalTarget)}
        title={`Set "${statusModalTarget?.platformName}" as ${statusModalTarget?.isActive ? "Inactive" : "Active"}?`}
        targetStatus={statusModalTarget?.isActive ? "inactive" : "active"}
        onConfirm={() => void handleStatusToggleConfirm()}
        onClose={() => setStatusModalTarget(null)}
        loading={statusUpdating}
      />
    </div>
  );
}
