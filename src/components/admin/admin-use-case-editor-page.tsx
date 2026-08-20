"use client";

import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  InlineLoader,
  SectionHeader,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import {
  IMPACT_IMAGE_COMPRESSION_QUALITY,
  IMPACT_IMAGE_MAX_SIZE_BYTES,
  IMPACT_IMAGE_MAX_SIZE_MB,
  IMPACT_MEDIA_MAX_HEIGHT,
  IMPACT_MEDIA_MAX_WIDTH,
  IMPACT_VIDEO_MAX_SIZE_BYTES,
  IMPACT_VIDEO_MAX_SIZE_MB,
} from "@/src/lib/admin-media-constraints";
import type { ApiResponse, HierarchyRow, ListData, UseCaseDetailRow, UseCaseDetailType } from "@/src/types/admin-api";

type UseCaseListFields = {
  challenges: string[];
  outcomes: string[];
  artefacts: string[];
};

type FormState = {
  id: string;
  title: string;
  summary: string;
  industryId: string;
  functionId: string;
  impactId: string;
  impactDescription: string;
  challengesId: string;
  outcomesId: string;
  artefactsId: string;
};

const EMPTY_FORM: FormState = {
  id: "",
  title: "",
  summary: "",
  industryId: "",
  functionId: "",
  impactId: "",
  impactDescription: "",
  challengesId: "",
  outcomesId: "",
  artefactsId: "",
};

function stripHtmlToLines(value: string) {
  return value
    .replace(/<li>/gi, "")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .join("\n");
}

function listToLines(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean).join("\n");
}

function linesToList(value: string) {
  const items = value.split("\n").map((item) => item.trim()).filter(Boolean);
  return items.length ? items : [""];
}

function listToHtml(value: string) {
  const items = value.split("\n").map((item) => item.trim()).filter(Boolean);
  if (!items.length) {
    return "";
  }

  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function findDetail(details: UseCaseDetailRow[], type: UseCaseDetailType) {
  return details.find((item) => item.type === type);
}

function UseCaseListEditor({
  label,
  emptyLabel,
  items,
  onChange,
}: {
  label: string;
  emptyLabel: string;
  items: string[];
  onChange: (nextItems: string[]) => void;
}) {
  const safeItems = items.length ? items : [""];
  const filledCount = safeItems.filter((item) => item.trim()).length;

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
    <AdminCard className="rounded-[18px] border border-slate-200 shadow-none">
      <div className="p-5 md:p-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-950">{label}</h3>
            <p className="mt-1 text-sm text-slate-500">Add each item on its own line field for a cleaner use case structure.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {filledCount} item{filledCount === 1 ? "" : "s"}
            </span>
            <AdminButton variant="secondary" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add More
            </AdminButton>
          </div>
        </div>

        <div className="space-y-3">
          {safeItems.map((item, index) => (
            <div key={`${label}-${index}`} className="flex items-start gap-3 rounded-[16px] border border-slate-200 bg-slate-50/70 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-600 shadow-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <AdminInput
                  label={safeItems.length === 1 ? emptyLabel : `${emptyLabel} ${index + 1}`}
                  value={item}
                  onChange={(event) => updateItem(index, event.target.value)}
                  placeholder={`Enter ${emptyLabel.toLowerCase()}`}
                />
              </div>
              {safeItems.length > 1 ? (
                <AdminButton
                  variant="ghost"
                  className="mt-7 h-[46px] px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => removeItem(index)}
                  aria-label={`Remove ${label} item ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4 text-rose-600" />
                </AdminButton>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </AdminCard>
  );
}

function getImageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read the selected image."));
    };

    image.src = objectUrl;
  });
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

async function prepareImpactMediaFile(file: File) {
  if (file.type.startsWith("image/")) {
    if (file.size > IMPACT_IMAGE_MAX_SIZE_BYTES) {
      throw new Error(`Image size must be ${IMPACT_IMAGE_MAX_SIZE_MB} MB or less.`);
    }

    const { width, height } = await getImageDimensions(file);

    if (width > IMPACT_MEDIA_MAX_WIDTH || height > IMPACT_MEDIA_MAX_HEIGHT) {
      throw new Error(`Image dimensions must be ${IMPACT_MEDIA_MAX_WIDTH}x${IMPACT_MEDIA_MAX_HEIGHT} or smaller.`);
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

  if (file.type.startsWith("video/")) {
    if (file.size > IMPACT_VIDEO_MAX_SIZE_BYTES) {
      throw new Error(`Video size must be ${IMPACT_VIDEO_MAX_SIZE_MB} MB or less.`);
    }

    return {
      file,
      wasCompressed: false,
    };
  }

  throw new Error("Only image and video files are allowed.");
}

async function fetchHierarchy(type: "industry" | "function") {
  const endpoint = type === "industry" ? "/api/admin/industries/list" : "/api/admin/functions/list";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: 1,
      limit: 100,
      sortBy: "updated_at",
      sortOrder: "desc",
    }),
  });

  const result = (await response.json()) as ApiResponse<ListData<HierarchyRow>>;
  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || result.message || `Unable to load ${type} data.`);
  }

  return result.data.result;
}

export function AdminUseCaseEditorPage({ useCaseId }: { useCaseId?: number }) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const isEditMode = typeof useCaseId === "number" && Number.isFinite(useCaseId);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [industries, setIndustries] = useState<HierarchyRow[]>([]);
  const [functions, setFunctions] = useState<HierarchyRow[]>([]);
  const [useCaseListFields, setUseCaseListFields] = useState<UseCaseListFields>({
    challenges: [""],
    outcomes: [""],
    artefacts: [""],
  });
  const [impactFile, setImpactFile] = useState<File | null>(null);
  const [impactFilePath, setImpactFilePath] = useState("");
  const [impactFileProcessing, setImpactFileProcessing] = useState(false);
  const [impactFileError, setImpactFileError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const filteredFunctions = useMemo(
    () => functions.filter((item) => !form.industryId || String(item.parentId) === String(form.industryId)),
    [functions, form.industryId],
  );

  useEffect(() => {
    let active = true;

    async function loadPage() {
      setPageLoading(true);

      try {
        const [industryRows, functionRows] = await Promise.all([
          fetchHierarchy("industry"),
          fetchHierarchy("function"),
        ]);

        if (!active) {
          return;
        }

        setIndustries(industryRows);
        setFunctions(functionRows);

        if (!isEditMode) {
          const initialIndustryId = industryRows[0]?.id;
          const initialFunctionId = functionRows.find((row) => row.parentId === initialIndustryId)?.id ?? functionRows[0]?.id;
          setForm({
            ...EMPTY_FORM,
            industryId: initialIndustryId ? String(initialIndustryId) : "",
            functionId: initialFunctionId ? String(initialFunctionId) : "",
          });
          return;
        }

        const response = await fetch(`/api/admin/use-cases/${useCaseId}/details`);
        const result = (await response.json()) as ApiResponse<{ useCase: HierarchyRow; details: UseCaseDetailRow[] }>;
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || result.message || "Unable to load use case details.");
        }

        const parentFunction = functionRows.find((row) => row.id === result.data?.useCase.parentId);
        const impact = findDetail(result.data.details, "Impact");
        const challenges = findDetail(result.data.details, "Challenges");
        const outcomes = findDetail(result.data.details, "Outcome");
        const artefacts = findDetail(result.data.details, "Artifacts");

        if (!active) {
          return;
        }

        setForm({
          ...EMPTY_FORM,
          id: String(result.data.useCase.id),
          title: result.data.useCase.title,
          summary: result.data.useCase.description ?? "",
          industryId: parentFunction?.parentId ? String(parentFunction.parentId) : "",
          functionId: result.data.useCase.parentId ? String(result.data.useCase.parentId) : "",
          impactId: impact ? String(impact.id) : "",
          impactDescription: impact ? stripHtmlToLines(impact.description) : "",
          challengesId: challenges ? String(challenges.id) : "",
          outcomesId: outcomes ? String(outcomes.id) : "",
          artefactsId: artefacts ? String(artefacts.id) : "",
        });
        setImpactFilePath(impact?.filePath ?? "");
        setUseCaseListFields({
          challenges: linesToList(challenges ? stripHtmlToLines(challenges.description) : ""),
          outcomes: linesToList(outcomes ? stripHtmlToLines(outcomes.description) : ""),
          artefacts: linesToList(artefacts ? stripHtmlToLines(artefacts.description) : ""),
        });
      } catch (error) {
        showToast({
          tone: "error",
          title: "Unable to load editor",
          description: error instanceof Error ? error.message : "Unable to load use case editor.",
        });
      } finally {
        if (active) {
          setPageLoading(false);
        }
      }
    }

    void loadPage();

    return () => {
      active = false;
    };
  }, [isEditMode, showToast, useCaseId]);

  function updateForm(key: keyof FormState, value: string) {
    if (key === "industryId") {
      const nextFunctionId = functions.find((item) => String(item.parentId) === value)?.id;
      setForm((current) => ({
        ...current,
        industryId: value,
        functionId: nextFunctionId ? String(nextFunctionId) : "",
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateListForm(key: keyof UseCaseListFields, items: string[]) {
    setUseCaseListFields((current) => ({
      ...current,
      [key]: items,
    }));
  }

  async function handleImpactFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setImpactFile(null);
      setImpactFileError("");
      return;
    }

    setImpactFileProcessing(true);
    setImpactFileError("");

    try {
      const prepared = await prepareImpactMediaFile(file);
      setImpactFile(prepared.file);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to use the selected media.";
      setImpactFile(null);
      setImpactFileError(message);
      event.target.value = "";
      showToast({
        tone: "error",
        title: "Invalid media",
        description: message,
      });
    } finally {
      setImpactFileProcessing(false);
    }
  }

  async function handleSave() {
    if (!form.title.trim()) {
      showToast({ tone: "error", title: "Title required", description: "Enter a use case title before saving." });
      return;
    }

    if (!Number(form.functionId)) {
      showToast({ tone: "error", title: "Function required", description: "Select a parent function before saving." });
      return;
    }

    const usecaseDetails = [
      { id: Number(form.impactId || 0), type: "Impact" as const, description: form.impactDescription.trim() },
      { id: Number(form.challengesId || 0), type: "Challenges" as const, description: listToHtml(listToLines(useCaseListFields.challenges)) },
      { id: Number(form.outcomesId || 0), type: "Outcome" as const, description: listToHtml(listToLines(useCaseListFields.outcomes)) },
      { id: Number(form.artefactsId || 0), type: "Artifacts" as const, description: listToHtml(listToLines(useCaseListFields.artefacts)) },
    ].filter((item) => item.description);

    setSaving(true);

    try {
      const requestPayload = {
        id: Number(form.id || 0),
        functionId: Number(form.functionId),
        title: form.title.trim(),
        description: form.summary.trim() || null,
        usecaseDetails,
      };

      const response = await fetch(
        "/api/admin/use-cases/upsert",
        impactFile
          ? {
              method: "POST",
              body: (() => {
                const formData = new FormData();
                formData.append("payload", JSON.stringify(requestPayload));
                formData.append("file", impactFile);
                return formData;
              })(),
            }
          : {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestPayload),
            },
      );

      const result = (await response.json()) as ApiResponse<{ id: number }>;
      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Unable to save use case.");
      }

      showToast({
        tone: "success",
        title: isEditMode ? "Use case updated" : "Use case created",
        description: "The use case and its linked details were saved successfully.",
      });
      router.push("/admin/use-cases");
      router.refresh();
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save use case.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (pageLoading) {
    return <InlineLoader label="Loading use case editor..." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={isEditMode ? "Edit Use Case" : "Create Use Case"}
        description=""
        action={
          <div className="flex flex-wrap items-center gap-3">
            <AdminButton variant="secondary" onClick={() => router.push("/admin/use-cases")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Use Cases
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving || impactFileProcessing}>
              {impactFileProcessing ? "Processing Media..." : saving ? "Saving..." : isEditMode ? "Update Use Case" : "Save Use Case"}
            </AdminButton>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <AdminCard className="rounded-[18px] border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-950">General Information</h2>
              <p className="mt-1 text-sm text-slate-500">Define the core relationship between industry, function, and use case summary.</p>
            </div>
            <div className="space-y-5 p-6">
              <AdminInput label="Use Case Title" value={form.title} onChange={(event) => updateForm("title", event.target.value)} />
              <div className="grid gap-5 md:grid-cols-2">
                <AdminSelect label="Industry" value={form.industryId} onChange={(event) => updateForm("industryId", event.target.value)}>
                  <option value="" disabled>Select industry</option>
                  {industries.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </AdminSelect>
                <AdminSelect label="Function" value={form.functionId} onChange={(event) => updateForm("functionId", event.target.value)}>
                  <option value="" disabled>Select function</option>
                  {filteredFunctions.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </AdminSelect>
              </div>
              <AdminTextarea label="Summary / Intro" value={form.summary} onChange={(event) => updateForm("summary", event.target.value)} />
            </div>
          </AdminCard>

          <AdminCard className="rounded-[18px] border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-950">Impact Narrative</h2>
              <p className="mt-1 text-sm text-slate-500">Capture the key impact statement shown for the use case.</p>
            </div>
            <div className="p-6">
              <AdminTextarea label="Impact" value={form.impactDescription} onChange={(event) => updateForm("impactDescription", event.target.value)} />
            </div>
          </AdminCard>

          <UseCaseListEditor
            label="Challenges"
            emptyLabel="Challenge"
            items={useCaseListFields.challenges}
            onChange={(items) => updateListForm("challenges", items)}
          />
          <UseCaseListEditor
            label="Outcomes"
            emptyLabel="Outcome"
            items={useCaseListFields.outcomes}
            onChange={(items) => updateListForm("outcomes", items)}
          />
          <UseCaseListEditor
            label="Key Artefacts Generated"
            emptyLabel="Artefact"
            items={useCaseListFields.artefacts}
            onChange={(items) => updateListForm("artefacts", items)}
          />
        </div>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <AdminCard className="rounded-[18px] border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-950">Impact Media</h2>
              <p className="mt-1 text-sm text-slate-500">Upload an image or video to support the impact section.</p>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-[16px] border border-dashed border-slate-300 bg-slate-50/70 p-4">
                <p className="text-sm font-medium text-slate-700">
                  Current file: {impactFile ? impactFile.name : impactFilePath || "No file selected"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Max size: {IMPACT_IMAGE_MAX_SIZE_MB} MB for images or {IMPACT_VIDEO_MAX_SIZE_MB} MB for videos. Max dimensions: {IMPACT_MEDIA_MAX_WIDTH}x{IMPACT_MEDIA_MAX_HEIGHT}.
                </p>
              </div>
              <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                <Upload className="mr-2 h-4 w-4" />
                {impactFile ? "Change File" : "Upload File"}
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(event) => void handleImpactFileChange(event)}
                />
              </label>
              {impactFileError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <p className="text-sm font-medium text-rose-700">{impactFileError}</p>
                </div>
              ) : null}
              {impactFileProcessing ? <InlineLoader label="Validating and optimizing media..." /> : null}
            </div>
          </AdminCard>

        </div>
      </div>
    </div>
  );
}
