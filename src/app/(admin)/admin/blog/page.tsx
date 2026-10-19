"use client";

import {
  CalendarDays,
  Edit3,
  Eye,
  FileImage,
  Layers3,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminRichTextEditor } from "@/src/components/admin/admin-rich-text-editor";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  ConfirmDialog,
  Drawer,
  LoadingSkeleton,
  Modal,
  SearchField,
  SectionHeader,
  StatusPill,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { createSlug } from "@/src/lib/admin-cms-client";
import {
  IMPACT_IMAGE_COMPRESSION_QUALITY,
  IMPACT_IMAGE_MAX_SIZE_BYTES,
  IMPACT_IMAGE_MAX_SIZE_MB,
} from "@/src/lib/admin-media-constraints";
import { hasMeaningfulHtml, stripHtml } from "@/src/lib/html-content";
import { cn } from "@/src/lib/utils";
import type {
  ApiResponse,
  BlogRow,
  ListData,
  SectionHeaderData,
  SectionHeaderUpsertPayload,
} from "@/src/types/admin-api";

type BlogFilter = "all" | "draft" | "published";

type BlogFormState = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  status: "draft" | "published";
  filepath: string;
};

const DEFAULT_HEADER: SectionHeaderData = {
  id: 0,
  sectionKey: "BLOG",
  badgeText: "Blog",
  heading: "Ideas, product notes, and practical AI stories from the WiiZ team.",
  description:
    "Explore published posts from the admin panel in a website experience that matches the rest of the product theme.",
  buttonText: null,
  buttonUrl: null,
  createdAt: "",
  updatedAt: "",
};


function createEmptyForm(): BlogFormState {
  return {
    id: 0,
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    status: "published",
    filepath: "",
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function mediaUrl(filepath: string | null) {
  if (!filepath) return null;
  const [folder, fileName] = filepath.split("/");
  if (!folder || !fileName) return null;
  return `/api/media/${folder}/${fileName}`;
}

async function compressImageFile(file: File) {
  const compressibleTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
  if (!compressibleTypes.has(file.type)) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new window.Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Unable to process the selected image."));
      element.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const compressedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", IMPACT_IMAGE_COMPRESSION_QUALITY);
    });

    if (!compressedBlob || compressedBlob.size >= file.size) {
      return file;
    }

    const baseName = file.name.includes(".") ? file.name.slice(0, file.name.lastIndexOf(".")) : file.name;
    return new File([compressedBlob], `${baseName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function prepareBlogImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed for blog uploads.");
  }

  const compressedFile = await compressImageFile(file);

  if (compressedFile.size > IMPACT_IMAGE_MAX_SIZE_BYTES) {
    throw new Error(`Image size must be ${IMPACT_IMAGE_MAX_SIZE_MB} MB or less.`);
  }

  return {
    file: compressedFile,
    wasCompressed: compressedFile !== file,
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

export default function AdminBlogPage() {
  const { showToast } = useAdminToast();

  const [headerSaved, setHeaderSaved] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerDraft, setHeaderDraft] = useState<SectionHeaderData>(DEFAULT_HEADER);
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerSaving, setHeaderSaving] = useState(false);
  const [headerErrors, setHeaderErrors] = useState<Record<string, string>>({});
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [headerDiscardDialog, setHeaderDiscardDialog] = useState(false);

  const [rows, setRows] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BlogFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogRow | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogFormState>(createEmptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/section-headers/BLOG", { cache: "no-store" })
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

  const loadBlogs = useCallback(async (query: string, nextFilter: BlogFilter) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/blog/list", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: query.trim(),
          status: nextFilter === "all" ? null : nextFilter,
        }),
      });

      const payload = (await response.json()) as ApiResponse<ListData<BlogRow>>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to load blog posts.");
      }

      setRows(payload.data.result);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      showToast({
        tone: "error",
        title: "Blog unavailable",
        description: error instanceof Error ? error.message : "Unable to load blog posts.",
      });
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [showToast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadBlogs(search, filter);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [filter, loadBlogs, search]);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  const publishedCount = useMemo(
    () => rows.filter((item) => item.status === "published").length,
    [rows],
  );
  const draftCount = rows.length - publishedCount;

  function updateHeader<K extends keyof SectionHeaderData>(key: K, value: SectionHeaderData[K]) {
    setHeaderDraft((current) => ({ ...current, [key]: value }));
    setHeaderErrors((current) => ({ ...current, [key]: "" }));
  }

function validateHeader() {
  const next: Record<string, string> = {};
  if (headerDraft.badgeText && headerDraft.badgeText.length > 80) next.badgeText = "Maximum 80 characters.";
  if (!headerDraft.heading.trim()) next.heading = "Heading is required.";
  if (headerDraft.heading.length > 180) next.heading = "Maximum 180 characters.";
  if (headerDraft.description && headerDraft.description.length > 250) next.description = "Maximum 250 characters.";
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
      const response = await fetch("/api/admin/section-headers/BLOG", {
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
        title: "Blog Header Updated",
        description: "The Blog page header has been saved successfully.",
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

  function updateForm<K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetEditor() {
    setForm(createEmptyForm());
    setErrors({});
    setSelectedFile(null);
    setImageError(null);
  }

  function openCreate() {
    resetEditor();
    setModalOpen(true);
  }

  function openEdit(post: BlogRow) {
    setErrors({});
    setSelectedFile(null);
    setImageError(null);
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      shortDescription: post.shortDescription ?? "",
      content: post.content,
      status: post.status,
      filepath: post.filepath ?? "",
    });
    setModalOpen(true);
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!hasMeaningfulHtml(form.content)) nextErrors.content = "Content is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function uploadBlogImage(blogId: number) {
    if (!selectedFile) {
      return form.filepath;
    }

    const preparedFile = await prepareBlogImageFile(selectedFile);
    const uploadFormData = new FormData();
    uploadFormData.append("rowId", String(blogId));
    uploadFormData.append("file", preparedFile.file);

    setUploading(true);

    try {
      const response = await fetch("/api/admin/blog/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const payload = (await response.json()) as ApiResponse<{
        rowId: number;
        fileName: string;
        filePath: string;
      }>;

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to upload blog image.");
      }

      if (preparedFile.wasCompressed) {
        showToast({
          tone: "success",
          title: "Image compressed",
          description: "The selected image was compressed before upload.",
        });
      }

      return payload.data.filePath;
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/blog/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: form.id,
          title: form.title.trim(),
          slug: createSlug(form.title),
          shortDescription: form.shortDescription.trim() || null,
          content: form.content.trim(),
          filepath: form.filepath.trim() || null,
          status: form.status,
        }),
      });

      const payload = (await response.json()) as ApiResponse<{ id: number; action: "created" | "updated" }>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to save blog post.");
      }

      const nextFilePath = await uploadBlogImage(payload.data.id);
      if (nextFilePath && nextFilePath !== form.filepath) {
        setForm((current) => ({ ...current, filepath: nextFilePath }));
      }

      await loadBlogs(search, filter);
      setModalOpen(false);
      resetEditor();
      showToast({
        tone: "success",
        title: form.id > 0 ? "Blog updated" : "Blog created",
        description: selectedFile
          ? "Blog post and image were saved successfully."
          : "Blog post was saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save blog post.",
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
      const response = await fetch(`/api/admin/blog/${deleteId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as ApiResponse<{ deletedId: number }>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Unable to delete blog post.");
      }

      setDeleteId(null);
      setRows((current) => current.filter((item) => item.id !== deleteId));
      showToast({
        tone: "success",
        title: "Blog deleted",
        description: payload.message,
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete blog post.",
      });
    }
  }

  const hasHeaderChanges = JSON.stringify(headerSaved) !== JSON.stringify(headerDraft);

  return (
    <div className="space-y-8">
      {headerLoading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <div className="space-y-6">
          <SectionHeader
            title="Blog Header"
            description="Edit Section Badge, Main Heading, and Subheading for the Blog page."
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
                label="Edit Blog Header"
                active={headerModalOpen}
                onClick={() => setHeaderModalOpen(true)}
                className="block w-full rounded-[20px] bg-[#1C0D17] px-6 py-10 font-sans text-center md:px-10 md:py-14"
              >
                {headerDraft.badgeText ? (
                  <div className="mb-6 inline-block rounded-full border border-[#5E4A47] bg-[#211A2533] px-3.5 py-1 shadow-sm">
                    <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#E68F17]">
                      {headerDraft.badgeText}
                    </span>
                  </div>
                ) : null}
                <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.5rem] leading-tight md:leading-[1.15] mx-auto text-center">
                  {headerDraft.heading || "Ideas, product notes, and practical AI stories from the WiiZ team."}
                </h1>
                {headerDraft.description ? (
                  <p className="mt-4 text-base md:text-lg font-light text-[#EBEBEB] max-w-2xl mx-auto text-center leading-relaxed">
                    {headerDraft.description}
                  </p>
                ) : null}
              </OverlayButton>
            </div>
          </AdminCard>
        </div>
      )}

      <Modal
        open={headerModalOpen}
        onClose={() => setHeaderModalOpen(false)}
        title="Edit Blog Header"
        description="Update the section badge, main heading, and subheading."
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
            maxLength={80}
            value={headerDraft.badgeText || ""}
            onChange={(event) => updateHeader("badgeText", event.target.value)}
            error={headerErrors.badgeText}
            counter={`${(headerDraft.badgeText || "").length}/80`}
            placeholder="Blog"
          />
          <AdminInput
            label="Main Heading"
            maxLength={180}
            value={headerDraft.heading}
            onChange={(event) => updateHeader("heading", event.target.value)}
            error={headerErrors.heading}
            counter={`${headerDraft.heading.length}/180`}
            placeholder="Ideas, product notes, and practical AI stories from the WiiZ team."
          />
          <AdminTextarea
            label="Subheading / Description"
            maxLength={250}
            value={headerDraft.description || ""}
            onChange={(event) => updateHeader("description", event.target.value)}
            error={headerErrors.description}
            counter={`${(headerDraft.description || "").length}/250`}
            placeholder="Explore published posts from the admin panel in a website experience that matches the rest of the product theme."
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={headerDiscardDialog}
        title="Discard all unsaved changes?"
        description="This will restore the last saved blog header content."
        confirmLabel="Discard All"
        onConfirm={handleDiscardHeader}
        onClose={() => setHeaderDiscardDialog(false)}
      />

      <SectionHeader
        title="Blog"
        description="Manage simple blog posts from MySQL with title, content, status, and an optional image path."
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Blog
          </AdminButton>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminCard className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Total Posts</div>
          <div className="mt-3 text-3xl font-semibold text-slate-950">{rows.length}</div>
        </AdminCard>
        <AdminCard className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Published</div>
          <div className="mt-3 text-3xl font-semibold text-emerald-700">{publishedCount}</div>
        </AdminCard>
        <AdminCard className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Drafts</div>
          <div className="mt-3 text-3xl font-semibold text-amber-700">{draftCount}</div>
        </AdminCard>
      </div>

      <AdminCard className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <SearchField value={search} onChange={setSearch} placeholder="Search title, slug, content" />
            </div>
            <div className="flex items-center gap-3">
              <AdminSelect
                label=""
                value={filter}
                onChange={(event) => setFilter(event.target.value as BlogFilter)}
                className="h-11 py-0"
              >
                <option value="all">All posts</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </AdminSelect>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading blog posts...</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-950">No blog posts found</h3>
            <p className="mt-2 text-sm text-slate-500">Create your first blog post or change the current filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 p-6 xl:grid-cols-2">
            {rows.map((post) => {
              const imageUrl = mediaUrl(post.filepath);
              return (
                <div
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-[24px] border border-[#3A1B32] bg-[linear-gradient(135deg,#180913_0%,#240d1a_55%,#3e1730_100%)] text-white shadow-[0_12px_36px_rgba(24,9,19,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#E68F17]/50 hover:shadow-[0_20px_45px_rgba(24,9,19,0.5)]"
                >
                  <div className="relative h-64 w-full overflow-hidden bg-[#180913] border-b border-[#3A1B32]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,#b94f83_0%,#4f1737_45%,#180913_100%)] p-6 text-white">
                        <div className="text-center">
                          <FileImage className="mx-auto h-8 w-8 text-[#E68F17] opacity-90" />
                          <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                            WiiZ Blog Post
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="absolute left-3.5 top-3.5 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur-md border border-white/15 shadow-sm">
                      <StatusPill value={post.status} />
                      <span className="font-mono text-[11px] font-bold text-white/70">#{post.id}</span>
                    </div>

                    <div className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-xl bg-black/60 p-1.5 backdrop-blur-md border border-white/15 shadow-sm">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/20 hover:text-white"
                        onClick={() => setPreviewPost(post)}
                        aria-label="Preview blog post"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/20 hover:text-white"
                        onClick={() => openEdit(post)}
                        aria-label="Edit blog post"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-400 transition hover:bg-rose-500/20 hover:text-rose-300"
                        onClick={() => setDeleteId(post.id)}
                        aria-label="Delete blog post"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E68F17]">
                      <CalendarDays className="h-3.5 w-3.5 text-[#E68F17]" />
                      <span>{formatDate(post.updatedAt)}</span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold leading-snug text-white transition-colors group-hover:text-[#E68F17]">
                      {post.title}
                    </h3>

                    <div className="mt-1 text-xs font-mono text-white/40 truncate">
                      /{post.slug}
                    </div>

                    <p className="mt-3.5 line-clamp-3 text-sm leading-relaxed text-white/70">
                      {post.shortDescription || stripHtml(post.content).slice(0, 160)}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/50">
                      <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                        <FileImage className="h-3.5 w-3.5 shrink-0 text-white/40" />
                        <span className="truncate">{post.filepath ? post.filepath.split("/")[1] || post.filepath : "No cover image"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewPost(post)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E68F17] transition hover:text-amber-300"
                      >
                        Explore post &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      <Modal
        open={modalOpen}
        onClose={() => {
          if (saving || uploading) {
            return;
          }
          setModalOpen(false);
          resetEditor();
        }}
        title={form.id > 0 ? "Edit Blog Post" : "Add Blog Post"}
        description="A lightweight blog editor backed by the MySQL blog_posts table."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                resetEditor();
              }}
              disabled={saving || uploading}
            >
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving || uploading}>
              {saving || uploading ? "Saving..." : form.id > 0 ? "Save Changes" : "Save Blog"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-6">
          <AdminInput
            label="Title"
            value={form.title}
            onChange={(event) => updateForm("title", event.target.value)}
            error={errors.title}
            maxLength={70}
            counter={`${form.title.length}/70 characters (including spaces)`}
          />

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <AdminSelect
              label="Status"
              value={form.status}
              onChange={(event) => updateForm("status", event.target.value as "draft" | "published")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </AdminSelect>
            <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Image Path
              </div>
              <div className="mt-2 break-all text-sm text-slate-700">
                {form.filepath || "No file saved yet"}
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-950">Blog Image</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Upload an optional image. It will be stored as `assets/blog/{`{id}`}.{`{ext}`}` and the relative path will be saved in the database.
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  All image formats and sizes accepted (under {IMPACT_IMAGE_MAX_SIZE_MB} MB).
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Upload className="mr-2 h-4 w-4" />
                {selectedFile ? "Change File" : "Upload File"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    event.target.value = "";
                    if (!file) {
                      setSelectedFile(null);
                      setImageError(null);
                      return;
                    }
                    if (!file.type.startsWith("image/")) {
                      setSelectedFile(null);
                      setImageError("Only image files are allowed.");
                      return;
                    }
                    if (file.size > IMPACT_IMAGE_MAX_SIZE_BYTES) {
                      setSelectedFile(null);
                      setImageError(`Image size must be ${IMPACT_IMAGE_MAX_SIZE_MB} MB or less.`);
                      return;
                    }
                    setImageError(null);
                    setSelectedFile(file);
                  }}
                />
              </label>
            </div>
            {selectedFile ? (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
                Selected file: {selectedFile.name}
              </div>
            ) : null}
            {imageError ? (
              <p className="mt-2 text-sm font-medium text-rose-600" role="alert">
                {imageError}
              </p>
            ) : null}
          </div>

          <AdminTextarea
            label="Short Description"
            value={form.shortDescription}
            onChange={(event) => updateForm("shortDescription", event.target.value)}
            className="min-h-[130px]"
            maxLength={141}
            counter={`${form.shortDescription.length}/141 characters (including spaces)`}
          />

          <AdminRichTextEditor
            label="Content"
            value={form.content}
            onChange={(value) => updateForm("content", value)}
            error={errors.content}
            placeholder="Write the blog content with headings, lists, links, and rich formatting."
          />
        </div>
      </Modal>

      <Drawer
        open={Boolean(previewPost)}
        onClose={() => setPreviewPost(null)}
        title={previewPost?.title ?? "Preview"}
        description="Quick content preview for the selected blog post."
      >
        {previewPost ? (
          <article className="space-y-5">
            <div className="flex items-center gap-3">
              <StatusPill value={previewPost.status} />
              <span className="text-sm text-slate-500">Updated {formatDate(previewPost.updatedAt)}</span>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="font-medium text-slate-800">Stored image path</div>
              <div className="mt-2 break-all">{previewPost.filepath || "No image linked"}</div>
            </div>
            {previewPost.shortDescription ? (
              <p className="text-lg leading-8 text-slate-700">{previewPost.shortDescription}</p>
            ) : null}
            <div
              className="rounded-[24px] bg-slate-50 p-5 text-sm leading-7 text-slate-700 [&>*+*]:mt-4 [&_.ql-align-center]:text-center [&_.ql-align-justify]:text-justify [&_.ql-align-right]:text-right [&_a]:text-slate-900 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_p]:min-h-[1.75rem] [&_ul]:list-disc [&_ul]:space-y-2"
              dangerouslySetInnerHTML={{ __html: previewPost.content }}
            />
            {!stripHtml(previewPost.content) ? (
              <div className="text-sm text-slate-500">No content preview available.</div>
            ) : null}
          </article>
        ) : null}
      </Drawer>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
        title="Delete blog post?"
        description="This will soft delete the blog post and remove it from the active list."
        confirmLabel="Delete"
      />
    </div>
  );
}