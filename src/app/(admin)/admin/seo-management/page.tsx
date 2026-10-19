"use client";

import {
  Check,
  Globe,
  Pencil,
  Plus,
  Search,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTableToolbar,
  LoadingSkeleton,
  Modal,
  SearchField,
  SectionHeader,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { cn } from "@/src/lib/utils";
import type { ApiResponse, SeoMetadataRow } from "@/src/types/admin-api";

type FormState = {
  id: number;
  pageKey: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

const EMPTY_FORM: FormState = {
  id: 0,
  pageKey: "",
  pageName: "",
  metaTitle: "",
  metaDescription: "",
  keywords: [],
};

export default function AdminSeoManagementPage() {
  const { showToast } = useAdminToast();
  const [rows, setRows] = useState<SeoMetadataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/seo-metadata", { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<SeoMetadataRow[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to load SEO metadata.");
      }
      setRows(payload.data);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Unable to fetch SEO settings.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function openEditModal(row: SeoMetadataRow) {
    const parsedKeywords = row.keywords
      ? row.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    setForm({
      id: row.id,
      pageKey: row.pageKey,
      pageName: row.pageName,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      keywords: parsedKeywords,
    });
    setTagInput("");
    setErrors({});
    setModalOpen(true);
  }

  function handleAddTag() {
    const tag = tagInput.trim();
    if (!tag) return;
    if (form.keywords.includes(tag)) {
      setTagInput("");
      return;
    }
    setForm((prev) => ({
      ...prev,
      keywords: [...prev.keywords, tag],
    }));
    setTagInput("");
  }

  function handleRemoveTag(tagToRemove: string) {
    setForm((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((t) => t !== tagToRemove),
    }));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    if (!form.metaTitle.trim()) nextErrors.metaTitle = "Meta title is required.";
    if (!form.metaDescription.trim()) nextErrors.metaDescription = "Meta description is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/seo-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id > 0 ? form.id : undefined,
          pageKey: form.pageKey,
          pageName: form.pageName,
          metaTitle: form.metaTitle.trim(),
          metaDescription: form.metaDescription.trim(),
          keywords: form.keywords.join(", "),
        }),
      });

      const payload = (await response.json()) as ApiResponse<SeoMetadataRow>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to save SEO metadata.");
      }

      showToast({
        tone: "success",
        title: "SEO Metadata Saved",
        description: `SEO settings for ${form.pageName} updated successfully.`,
      });
      setModalOpen(false);
      await loadData();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Unable to save SEO settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase().trim();
    return rows.filter(
      (r) =>
        r.pageName.toLowerCase().includes(q) ||
        r.pageKey.toLowerCase().includes(q) ||
        r.metaTitle.toLowerCase().includes(q) ||
        r.keywords.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const columns = [
    {
      key: "pageName",
      label: "Page Name & Key",
      render: (row: SeoMetadataRow) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
            <Globe className="h-4 w-4 text-[#98235f]" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.pageName}</div>
            <div className="text-xs text-[#98235f] font-mono bg-pink-50 px-1.5 py-0.5 rounded w-fit">
              key: {row.pageKey}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "metaTitle",
      label: "Meta Title",
      render: (row: SeoMetadataRow) => (
        <div className="max-w-xs space-y-1">
          <div className="text-xs font-semibold text-slate-900 line-clamp-1">{row.metaTitle}</div>
          <div className="text-[11px] text-slate-400 font-mono">{row.metaTitle.length} chars</div>
        </div>
      ),
    },
    {
      key: "metaDescription",
      label: "Meta Description",
      render: (row: SeoMetadataRow) => (
        <div className="max-w-sm space-y-1">
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{row.metaDescription}</p>
          <div className="text-[11px] text-slate-400 font-mono">{row.metaDescription.length} chars</div>
        </div>
      ),
    },
    {
      key: "keywords",
      label: "Keywords",
      render: (row: SeoMetadataRow) => {
        const tags = row.keywords.split(",").map((k) => k.trim()).filter(Boolean);
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700"
              >
                <Tag className="h-2.5 w-2.5 text-slate-400" />
                {tag}
              </span>
            ))}
            {tags.length > 3 ? (
              <span className="text-[10px] text-slate-400 font-semibold align-middle">
                +{tags.length - 3} more
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-24 text-right",
      render: (row: SeoMetadataRow) => (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            aria-label="Edit SEO metadata"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSkeleton rows={6} />;

  const pageSlug = form.pageKey === "home" ? "" : form.pageKey;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="SEO & Metadata Management"
        description="Configure dynamic Meta Title, Meta Description, and Search Keywords for every page across the website."
      />

      <AdminDataTable
        rows={filteredRows}
        columns={columns}
        rowKey={(row) => String(row.id)}
        loading={loading}
        emptyTitle="No SEO settings found"
        emptyDescription="Select a page to edit its meta title, meta description, and keywords."
        pageSize={10}
        toolbar={
          <AdminTableToolbar
            search={
              <SearchField
                value={search}
                onChange={setSearch}
                placeholder="Search page name, meta title, or keywords..."
              />
            }
          />
        }
      />

      {/* Edit SEO Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`SEO Settings: ${form.pageName}`}
        description="Manage Search Engine Meta Information & Target Keywords."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : "Save SEO Metadata"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-5 pt-2">
          {/* SERP Preview Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <span>Google SERP Search Result Preview</span>
              <Search className="h-3.5 w-3.5" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1 font-sans">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Globe className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-medium">https://wiiz.it</span>
                <span className="text-slate-400">› {pageSlug}</span>
              </div>
              <h4 className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer line-clamp-1">
                {form.metaTitle || "Meta Title Placeholder"}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {form.metaDescription || "Meta description snippet will be rendered here for search engines."}
              </p>
            </div>
          </div>

          {/* Meta Title Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Meta Title *
              </label>
              <span
                className={cn(
                  "text-xs font-mono font-medium",
                  form.metaTitle.length > 60 ? "text-amber-600" : "text-slate-400",
                )}
              >
                {form.metaTitle.length} / 60 chars (Recommended: 50-60)
              </span>
            </div>
            <AdminInput
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              error={errors.metaTitle}
              placeholder="e.g. WiiZ | Enterprise AI Orchestration Platform"
            />
          </div>

          {/* Meta Description Textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Meta Description *
              </label>
              <span
                className={cn(
                  "text-xs font-mono font-medium",
                  form.metaDescription.length > 160 ? "text-amber-600" : "text-slate-400",
                )}
              >
                {form.metaDescription.length} / 160 chars (Recommended: 140-160)
              </span>
            </div>
            <textarea
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              rows={3}
              placeholder="Summary of page content for Google search results..."
              className={cn(
                "w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-900 shadow-2xs focus:border-[#98235f] focus:outline-none focus:ring-2 focus:ring-[#98235f]/20 leading-relaxed",
                errors.metaDescription && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
              )}
            />
            {errors.metaDescription ? (
              <p className="text-xs text-rose-500 mt-1">{errors.metaDescription}</p>
            ) : null}
          </div>

          {/* Keywords Tag Manager */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Keywords (Search Tags)
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type keyword and press Enter or comma..."
                  className="flex-1 text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-2xs focus:border-[#98235f] focus:outline-none"
                />
                <AdminButton variant="secondary" onClick={handleAddTag} className="text-xs py-2">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Tag
                </AdminButton>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[36px] items-center p-1">
                {form.keywords.length > 0 ? (
                  form.keywords.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-pink-200 bg-pink-50 px-2.5 py-1 text-xs font-medium text-[#98235f] shadow-2xs"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="rounded-full p-0.5 hover:bg-pink-200/60 text-pink-700 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No keywords added yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
