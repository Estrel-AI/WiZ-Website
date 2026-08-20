"use client";

import { Eye, FileImage, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
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
import type { ApiResponse, BlogRow, ListData } from "@/src/types/admin-api";

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

export default function AdminBlogPage() {
  const { showToast } = useAdminToast();
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
  const requestRef = useRef<AbortController | null>(null);

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
  }

  function openCreate() {
    resetEditor();
    setModalOpen(true);
  }

  function openEdit(post: BlogRow) {
    setErrors({});
    setSelectedFile(null);
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

  return (
    <div className="space-y-8">
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
          <div className="grid gap-5 p-6 xl:grid-cols-2">
            {rows.map((post) => (
              <div
                key={post.id}
                className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusPill value={post.status} />
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        #{post.id}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-slate-950">{post.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">/{post.slug}</p>
                    {post.shortDescription ? (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                        {post.shortDescription}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                      onClick={() => setPreviewPost(post)}
                      aria-label="Preview blog post"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4 stroke-[1.9]" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                      onClick={() => openEdit(post)}
                      aria-label="Edit blog post"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4 stroke-[1.9]" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-rose-200 bg-white text-rose-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => setDeleteId(post.id)}
                      aria-label="Delete blog post"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 stroke-[1.9]" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    <span className="truncate">{post.filepath || "No image linked"}</span>
                  </div>
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </div>
              </div>
            ))}
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
                  Upload an optional image. It will be stored as `backend/blog/{`{id}`}.{`{ext}`}` and the relative path will be saved in the database.
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
          </div>

          <AdminTextarea
            label="Short Description"
            value={form.shortDescription}
            onChange={(event) => updateForm("shortDescription", event.target.value)}
            className="min-h-[130px]"
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
