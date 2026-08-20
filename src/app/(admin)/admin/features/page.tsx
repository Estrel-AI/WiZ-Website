"use client";

import Image from "next/image";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  ConfirmDialog,
  EmptyState,
  LoadingSkeleton,
  Modal,
  SearchField,
  SectionHeader,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import {
  IMPACT_IMAGE_MAX_SIZE_MB,
  IMPACT_VIDEO_MAX_SIZE_MB,
} from "@/src/lib/admin-media-constraints";
import type {
  ApiResponse,
  HomeFeatureDisplayOrderPayload,
  HomeFeatureListPayload,
  HomeFeatureMediaType,
  HomeFeatureRow,
  HomeFeatureUpsertPayload,
  ListData,
} from "@/src/types/admin-api";

type MediaInputMode = "url" | "upload";

type FeatureFormState = {
  id: number;
  label: string;
  title: string;
  description: string;
  features: string[];
  mediaType: "" | HomeFeatureMediaType;
  mediaUrl: string;
  displayOrder: number;
  isActive: boolean;
};

function createEmptyForm(): FeatureFormState {
  return {
    id: 0,
    label: "",
    title: "",
    description: "",
    features: [""],
    mediaType: "",
    mediaUrl: "",
    displayOrder: 0,
    isActive: true,
  };
}

function isStoredFeatureMediaPath(value: string | null | undefined) {
  return typeof value === "string" && /^feature\/[^/]+$/i.test(value.trim());
}

function getFeatureMediaPreviewUrl(value: string | null | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  return isStoredFeatureMediaPath(trimmed) ? `/api/media/${trimmed}` : trimmed;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function FeatureListEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const safeItems = items.length ? items : [""];

  function updateItem(index: number, value: string) {
    onChange(safeItems.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function addItem() {
    onChange([...safeItems, ""]);
  }

  function removeItem(index: number) {
    const nextItems = safeItems.filter((_, itemIndex) => itemIndex !== index);
    onChange(nextItems.length ? nextItems : [""]);
  }

  return (
    <div className="rounded-[14px] border border-slate-200 bg-slate-50/70 p-3.5 md:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-950">Feature Items</h4>
          <p className="mt-1 text-sm text-slate-500">Add the bullet points shown inside this feature block.</p>
        </div>
        <AdminButton variant="secondary" className="h-10 px-3.5 py-0" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add More
        </AdminButton>
      </div>

      <div className="space-y-2.5">
        {safeItems.map((item, index) => (
          <div key={`feature-item-${index}`} className="flex items-start gap-3 rounded-[12px] border border-slate-200 bg-white p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
              {index + 1}
            </div>
            <div className="flex-1">
              <AdminInput
                label={safeItems.length === 1 ? "Feature" : `Feature ${index + 1}`}
                value={item}
                onChange={(event) => updateItem(index, event.target.value)}
                placeholder="Enter feature text"
              />
            </div>
            {safeItems.length > 1 ? (
              <AdminButton
                variant="ghost"
                className="mt-6 h-11 px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => removeItem(index)}
                aria-label={`Remove feature item ${index + 1}`}
              >
                <Trash2 className="h-4 w-4 text-rose-600" />
              </AdminButton>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminFeaturesPage() {
  const { showToast } = useAdminToast();
  const [rows, setRows] = useState<HomeFeatureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<FeatureFormState>(createEmptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mediaInputMode, setMediaInputMode] = useState<MediaInputMode>("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const dragRowIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadFeatures = useCallback(async (query: string) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);

    try {
      const payload: HomeFeatureListPayload = {
        search: query.trim(),
      };

      const response = await fetch("/api/admin/home-features/list", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as ApiResponse<ListData<HomeFeatureRow>>;
      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.error || body.message || "Unable to load features.");
      }

      setRows(body.data.result);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      showToast({
        tone: "error",
        title: "Features unavailable",
        description: error instanceof Error ? error.message : "Unable to load features.",
      });
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [showToast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadFeatures(search);
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [loadFeatures, search]);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  function resetEditor() {
    setForm(createEmptyForm());
    setErrors({});
    setMediaInputMode("url");
    setSelectedFile(null);
    setSelectedFilePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function openCreate() {
    setForm({
      ...createEmptyForm(),
      displayOrder: rows.length,
    });
    setErrors({});
    setMediaInputMode("url");
    setSelectedFile(null);
    setSelectedFilePreviewUrl(null);
    setModalOpen(true);
  }

  function openEdit(row: HomeFeatureRow) {
    setForm({
      id: row.id,
      label: row.label,
      title: row.title,
      description: row.description ?? "",
      features: row.features.length ? row.features : [""],
      mediaType: row.mediaType ?? "",
      mediaUrl: row.mediaUrl ?? "",
      displayOrder: row.displayOrder,
      isActive: row.isActive,
    });
    setErrors({});
    setMediaInputMode(isStoredFeatureMediaPath(row.mediaUrl) ? "upload" : "url");
    setSelectedFile(null);
    setSelectedFilePreviewUrl(null);
    setModalOpen(true);
  }

  function updateForm<K extends keyof FeatureFormState>(key: K, value: FeatureFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    if (!selectedFile) {
      setSelectedFilePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setSelectedFilePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  function handleMediaInputModeChange(mode: MediaInputMode) {
    setMediaInputMode(mode);
    setErrors((current) => {
      const next = { ...current };
      delete next.media;
      return next;
    });

    if (mode === "url") {
      setSelectedFile(null);
      setSelectedFilePreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (isStoredFeatureMediaPath(form.mediaUrl)) {
        updateForm("mediaUrl", "");
      }

      return;
    }

    if (form.mediaUrl && !isStoredFeatureMediaPath(form.mediaUrl)) {
      updateForm("mediaUrl", "");
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!(file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      setErrors((current) => ({ ...current, media: "Only image and video files are allowed." }));
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setErrors((current) => {
      const next = { ...current };
      delete next.media;
      return next;
    });
    setSelectedFile(file);
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    const cleanedFeatures = form.features.map((item) => item.trim()).filter(Boolean);

    if (!form.label.trim()) nextErrors.label = "Label is required.";
    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!cleanedFeatures.length) nextErrors.features = "At least one feature is required.";
    if (mediaInputMode === "url" && form.mediaUrl.trim() && !form.mediaType) {
      nextErrors.media = "Media type is required when media URL is provided.";
    }
    if (mediaInputMode === "upload" && (selectedFile || form.mediaUrl.trim()) && !form.mediaType) {
      nextErrors.media = "Media type is required when uploading media.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function uploadFeatureMedia(featureId: number) {
    if (!selectedFile) {
      return form.mediaUrl.trim() || null;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("rowId", String(featureId));
    uploadFormData.append("file", selectedFile);

    setUploading(true);

    try {
      const response = await fetch("/api/admin/home-features/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const payload = (await response.json()) as ApiResponse<{
        rowId: number;
        fileName: string;
        filePath: string;
      }>;

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to upload feature media.");
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
      const response = await fetch("/api/admin/home-features/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id || undefined,
          label: form.label.trim(),
          title: form.title.trim(),
          description: form.description.trim() || null,
          features: form.features.map((item) => item.trim()).filter(Boolean),
          mediaType: form.mediaType || null,
          mediaUrl: mediaInputMode === "url"
            ? form.mediaUrl.trim() || null
            : selectedFile
              ? null
              : form.mediaUrl.trim() || null,
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        } satisfies HomeFeatureUpsertPayload),
      });

      const payload = (await response.json()) as ApiResponse<{ id: number; action: "created" | "updated" }>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to save feature.");
      }

      const uploadedFilePath = mediaInputMode === "upload" && form.mediaType
        ? await uploadFeatureMedia(payload.data.id)
        : null;

      await loadFeatures(search);
      setModalOpen(false);
      resetEditor();
      showToast({
        tone: "success",
        title: form.id > 0 ? "Feature updated" : "Feature created",
        description: uploadedFilePath
          ? "The feature block and media were saved successfully."
          : "The feature block was saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save feature.",
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
      const response = await fetch(`/api/admin/home-features/${deleteId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as ApiResponse<{ deletedId: number }>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Unable to delete feature.");
      }

      setDeleteId(null);
      await loadFeatures(search);
      showToast({
        tone: "success",
        title: "Feature deleted",
        description: "The feature block was removed successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete feature.",
      });
    }
  }

  async function persistRowOrder(nextRows: HomeFeatureRow[]) {
    setReordering(true);

    try {
      const response = await fetch("/api/admin/home-features/display-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: nextRows.map((row, index) => ({
            id: row.id,
            displayOrder: index,
          })),
        } satisfies HomeFeatureDisplayOrderPayload),
      });

      const payload = (await response.json()) as ApiResponse<{ updatedCount: number }>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to update feature order.");
      }

      setRows(nextRows.map((row, index) => ({ ...row, displayOrder: index })));
      showToast({
        tone: "success",
        title: "Order updated",
        description: "Feature order was saved successfully.",
      });
    } catch (error) {
      await loadFeatures(search);
      showToast({
        tone: "error",
        title: "Unable to reorder",
        description: error instanceof Error ? error.message : "Please try again.",
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

    const currentRows = [...rows];
    const fromIndex = currentRows.findIndex((row) => row.id === draggedRowId);
    const toIndex = currentRows.findIndex((row) => row.id === targetRowId);

    if (fromIndex < 0 || toIndex < 0) {
      dragRowIdRef.current = null;
      return;
    }

    const [movedRow] = currentRows.splice(fromIndex, 1);
    currentRows.splice(toIndex, 0, movedRow);
    setRows(currentRows.map((row, index) => ({ ...row, displayOrder: index })));
    void persistRowOrder(currentRows);
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Features"
        description="Manage the homepage feature blocks, feature items, media links, ordering, and visibility from one place."
        action={
          <AdminButton onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Feature
          </AdminButton>
        }
      />

      <AdminCard className="overflow-hidden">
        <div className="border-b border-slate-200/80 bg-slate-50/70 px-5 py-4">
          <div className="min-w-0 flex-1">
            <SearchField value={search} onChange={setSearch} placeholder="Search title, label, description, or media URL" />
          </div>
        </div>

        {loading ? <LoadingSkeleton rows={6} /> : null}
        {reordering ? (
          <div className="border-b border-slate-200 bg-amber-50 px-5 py-3 text-sm text-amber-700">
            Saving feature order...
          </div>
        ) : null}

        {!loading && rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No features found"
              description="Create your first homepage feature block or adjust the current filters."
              action={
                <AdminButton onClick={openCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </AdminButton>
              }
            />
          </div>
        ) : null}

        {!loading && rows.length > 0 ? (
          <div className="divide-y divide-slate-200">
            <div className="grid grid-cols-[88px_minmax(260px,1.2fr)_minmax(320px,1fr)_180px_120px] gap-5 bg-slate-50/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <div>Order</div>
              <div>Content</div>
              <div>Image/Video</div>
              <div>Date</div>
              <div className="text-right">Actions</div>
            </div>
            {rows.map((row) => (
              <div
                key={row.id}
                draggable={!reordering}
                onDragStart={() => handleDragStart(row.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(row.id)}
                className="grid grid-cols-[88px_minmax(260px,1.2fr)_minmax(320px,1fr)_180px_120px] items-center gap-5 px-5 py-4 transition hover:bg-slate-50/70"
              >
                <div className="flex items-center gap-2 text-slate-500">
                  <GripVertical className="h-4 w-4 cursor-grab" />
                  <span className="text-sm font-medium">{row.displayOrder + 1}</span>
                </div>
                <div className="min-w-0 self-center">
                  <div className="truncate text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{row.label}</div>
                  <div className="mt-1 truncate text-sm font-semibold text-slate-950">{row.title}</div>
                </div>
                <div className="min-w-0 self-center">
                  {row.mediaUrl ? (
                    <div className="flex items-center gap-3">
                      {getFeatureMediaPreviewUrl(row.mediaUrl) ? (
                        row.mediaType === "video" ? (
                          <video
                            className="h-14 w-20 shrink-0 rounded-[10px] border border-slate-200 bg-slate-950 object-cover"
                            muted
                            playsInline
                          >
                            <source src={getFeatureMediaPreviewUrl(row.mediaUrl) ?? ""} />
                          </video>
                        ) : (
                          <Image
                            src={getFeatureMediaPreviewUrl(row.mediaUrl) ?? ""}
                            alt={row.title}
                            width={80}
                            height={56}
                            unoptimized
                            className="h-14 w-20 shrink-0 rounded-[10px] border border-slate-200 object-cover"
                          />
                        )
                      ) : null}
                      <div className="min-w-0 truncate text-sm text-slate-500">
                        {getFeatureMediaPreviewUrl(row.mediaUrl) ?? row.mediaUrl}
                      </div>
                    </div>
                  ) : (
                    <div className="truncate text-sm text-slate-500">No media linked</div>
                  )}
                </div>
                <div className="self-center text-sm text-slate-500">{formatDate(row.createdAt)}</div>
                <div className="flex items-center justify-end gap-2 self-center">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                    onClick={() => openEdit(row)}
                    aria-label="Edit feature"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4 stroke-[1.9]" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-rose-200 bg-white text-rose-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => setDeleteId(row.id)}
                    aria-label="Delete feature"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 stroke-[1.9]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </AdminCard>

      <Modal
        open={modalOpen}
        onClose={() => {
          if (saving || uploading) {
            return;
          }
          setModalOpen(false);
        }}
        title={form.id > 0 ? "Edit Feature" : "Add Feature"}
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving || uploading}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving || uploading}>
              {saving || uploading ? "Saving..." : form.id > 0 ? "Save Changes" : "Save Feature"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <AdminInput
              label="Label"
              value={form.label}
              onChange={(event) => updateForm("label", event.target.value)}
              error={errors.label}
              placeholder="ai-agents"
            />
            <AdminInput
              label="Title"
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              error={errors.title}
              placeholder="WiiZ Built AI Agents"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-[200px_minmax(0,1fr)]">
            <AdminSelect
              label="Media Type"
              value={form.mediaType}
              onChange={(event) => updateForm("mediaType", event.target.value as FeatureFormState["mediaType"])}
            >
              <option value="">Select media type</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </AdminSelect>
          </div>
          <div className="space-y-3 rounded-[14px] border border-slate-200 bg-slate-50/70 p-3.5 md:p-4">
            <div className="flex flex-wrap gap-2">
              <AdminButton
                variant={mediaInputMode === "url" ? "primary" : "secondary"}
                className="h-10 px-3.5 py-0"
                onClick={() => handleMediaInputModeChange("url")}
              >
                Use URL
              </AdminButton>
              <AdminButton
                variant={mediaInputMode === "upload" ? "primary" : "secondary"}
                className="h-10 px-3.5 py-0"
                onClick={() => handleMediaInputModeChange("upload")}
              >
                Upload File
              </AdminButton>
            </div>

            {mediaInputMode === "url" ? (
              <AdminInput
                label="Media URL"
                value={form.mediaUrl}
                onChange={(event) => updateForm("mediaUrl", event.target.value)}
                error={errors.media}
                disabled={!form.mediaType}
                placeholder={form.mediaType === "video" ? "https://youtube.com/watch?v=... or https://...mp4" : "https://..."}
              />
            ) : (
              <div className="space-y-3">
                <div className="rounded-[12px] border border-dashed border-slate-300 bg-white p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <AdminButton
                      variant="secondary"
                      className="h-10 px-3.5 py-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Image or Video
                    </AdminButton>
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-500">
                      {selectedFile?.name || (form.mediaUrl ? form.mediaUrl : "No file selected")}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Upload an image up to {IMPACT_IMAGE_MAX_SIZE_MB} MB or a video up to {IMPACT_VIDEO_MAX_SIZE_MB} MB.
                  </p>
                  {errors.media ? <p className="mt-2 text-sm text-rose-600">{errors.media}</p> : null}
                </div>

                {selectedFilePreviewUrl ? (
                  selectedFile?.type.startsWith("video/") ? (
                    <video className="max-h-52 w-full rounded-[12px] border border-slate-200 bg-slate-950 object-cover" controls playsInline>
                      <source src={selectedFilePreviewUrl} type={selectedFile?.type || "video/mp4"} />
                    </video>
                  ) : (
                    <Image
                      src={selectedFilePreviewUrl}
                      alt="Selected feature media preview"
                      width={960}
                      height={420}
                      unoptimized
                      className="max-h-52 w-full rounded-[12px] border border-slate-200 object-cover"
                    />
                  )
                ) : null}

                {!selectedFilePreviewUrl && form.mediaUrl ? (
                  <div className="rounded-[12px] border border-slate-200 bg-white p-3 text-sm text-slate-500">
                    Current uploaded media: {form.mediaUrl}
                  </div>
                ) : null}
              </div>
            )}
          </div>
          {form.mediaType === "video" ? (
            <p className="text-xs text-slate-500">
              URL mode supports direct video files and common embeds like YouTube, Vimeo, Loom, and Google Drive.
            </p>
          ) : null}

          <AdminTextarea
            label="Description"
            value={form.description}
            onChange={(event) => updateForm("description", event.target.value)}
            placeholder="Short supporting copy for this feature block."
          />

          {form.id > 0 ? (
            <label className="flex items-center justify-between rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-2.5">
              <div>
                <div className="text-sm font-medium text-slate-900">Active</div>
                <div className="mt-1 text-xs text-slate-500">Turn this off to hide the feature block without deleting it.</div>
              </div>
              <button
                type="button"
                onClick={() => updateForm("isActive", !form.isActive)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${form.isActive ? "bg-slate-950" : "bg-slate-300"}`}
                aria-pressed={form.isActive}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white transition ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </label>
          ) : null}

          <FeatureListEditor items={form.features} onChange={(items) => updateForm("features", items)} />
          {errors.features ? <p className="text-sm text-rose-600">{errors.features}</p> : null}
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
        title="Delete feature?"
        description="This will hide the feature block from the active list."
        confirmLabel="Delete"
      />
    </div>
  );
}
