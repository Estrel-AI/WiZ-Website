"use client";

import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTableToolbar,
  AdminTextarea,
  ConfirmDialog,
  Modal,
  SearchField,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { createId } from "@/src/lib/admin-cms-client";
import {
  IMPACT_IMAGE_COMPRESSION_QUALITY,
  IMPACT_IMAGE_MAX_SIZE_BYTES,
  IMPACT_IMAGE_MAX_SIZE_MB,
  IMPACT_MEDIA_MAX_HEIGHT,
  IMPACT_MEDIA_MAX_WIDTH,
  IMPACT_VIDEO_MAX_SIZE_BYTES,
  IMPACT_VIDEO_MAX_SIZE_MB,
} from "@/src/lib/admin-media-constraints";
import type { ApiResponse, HierarchyRow, ListData } from "@/src/types/admin-api";

export type HierarchyAdminView = "industry" | "function" | "usecase";

type DrawerMode = "industry" | "function" | "usecase" | null;
type FormState = Record<string, string>;

type IndustryDraftRow = {
  id: string;
  title: string;
  industryId: number;
};

type FunctionDraftRow = {
  id: string;
  title: string;
  functionId: number;
};

type FunctionDraftGroup = {
  id: string;
  industryId: number;
  items: FunctionDraftRow[];
};

type UseCaseListFields = {
  challenges: string[];
  outcomes: string[];
  artefacts: string[];
};

const emptyForm = (): FormState => ({
  id: "",
  name: "",
  title: "",
  description: "",
  summary: "",
  industryId: "",
  functionId: "",
  impactId: "",
  impactDescription: "",
  challengesId: "",
  challenges: "",
  outcomesId: "",
  outcomes: "",
  artefactsId: "",
  artefacts: "",
});

const createIndustryDraft = (): IndustryDraftRow => ({
  id: createId("industry-draft"),
  title: "",
  industryId: 0,
});

const createFunctionDraft = (): FunctionDraftRow => ({
  id: createId("function-draft"),
  title: "",
  functionId: 0,
});

const createFunctionDraftGroup = (industryId = 0): FunctionDraftGroup => ({
  id: createId("function-group"),
  industryId,
  items: [createFunctionDraft()],
});

function splitLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function listToLines(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean).join("\n");
}

function listToHtml(value: string) {
  const items = splitLines(value);
  if (!items.length) {
    return "";
  }

  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function formatTableDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function RowActionButtons({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
        onClick={onEdit}
        aria-label="Edit item"
        title="Edit"
      >
        <Pencil className="h-4 w-4 stroke-[1.9]" />
      </button>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-rose-200 bg-white text-rose-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
        onClick={onDelete}
        aria-label="Delete item"
        title="Delete"
      >
        <Trash2 className="h-4 w-4 stroke-[1.9]" />
      </button>
    </div>
  );
}

function getImageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

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
      const element = new Image();
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

  const filledCount = safeItems.filter((item) => item.trim()).length;

  return (
    <div className="rounded-[16px] border border-slate-200 bg-slate-50/70 p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-950">{label}</h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
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
          <div key={`${label}-${index}`} className="flex items-start gap-3 rounded-[14px] border border-slate-200 bg-white p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
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
  );
}

export function AdminHierarchyManager({ view }: { view: HierarchyAdminView }) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [industrySearch, setIndustrySearch] = useState("");
  const [functionSearch, setFunctionSearch] = useState("");
  const [useCaseSearch, setUseCaseSearch] = useState("");
  const [mode, setMode] = useState<DrawerMode>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [deleteState, setDeleteState] = useState<{ type: DrawerMode; id: string | number } | null>(null);
  const [industryRows, setIndustryRows] = useState<HierarchyRow[]>([]);
  const [functionRows, setFunctionRows] = useState<HierarchyRow[]>([]);
  const [useCaseRows, setUseCaseRows] = useState<HierarchyRow[]>([]);
  const [industryLoading, setIndustryLoading] = useState(view === "industry");
  const [functionLoading, setFunctionLoading] = useState(view === "function");
  const [useCaseLoading, setUseCaseLoading] = useState(view === "usecase");
  const [industrySaving, setIndustrySaving] = useState(false);
  const [functionSaving, setFunctionSaving] = useState(false);
  const [useCaseSaving, setUseCaseSaving] = useState(false);
  const [industryDrawerOpen, setIndustryDrawerOpen] = useState(false);
  const [functionDrawerOpen, setFunctionDrawerOpen] = useState(false);
  const [industryDrafts, setIndustryDrafts] = useState<IndustryDraftRow[]>([createIndustryDraft()]);
  const [functionDraftGroups, setFunctionDraftGroups] = useState<FunctionDraftGroup[]>([createFunctionDraftGroup()]);
  const [useCaseListFields, setUseCaseListFields] = useState<UseCaseListFields>({
    challenges: [""],
    outcomes: [""],
    artefacts: [""],
  });
  const [impactFile, setImpactFile] = useState<File | null>(null);
  const [impactFilePath, setImpactFilePath] = useState("");
  const [impactFileProcessing, setImpactFileProcessing] = useState(false);
  const [impactFileError, setImpactFileError] = useState("");
  const [industryDrawerMode, setIndustryDrawerMode] = useState<"create" | "edit">("create");
  const [functionDrawerMode, setFunctionDrawerMode] = useState<"create" | "edit">("create");
  const industryAbortRef = useRef<AbortController | null>(null);
  const functionAbortRef = useRef<AbortController | null>(null);
  const useCaseAbortRef = useRef<AbortController | null>(null);

  const industries = useMemo(() => industryRows, [industryRows]);
  const functions = useMemo(() => functionRows, [functionRows]);
  const useCases = useMemo(() => useCaseRows, [useCaseRows]);

  function updateForm(key: string, value: string) {
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

  const loadIndustries = useCallback(async (searchValue = "", signal?: AbortSignal) => {
    setIndustryLoading(true);

    try {
      const response = await fetch("/api/admin/industries/list", {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: 1,
          limit: 100,
          search: searchValue,
          sortBy: "updated_at",
          sortOrder: "desc",
        }),
      });

      const result = (await response.json()) as ApiResponse<ListData<HierarchyRow>>;
      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || result.message || "Unable to load industries.");
      }

      setIndustryRows(result.data.result);
      return result.data.result;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return [];
      }

      showToast({
        tone: "error",
        title: "Industries unavailable",
        description: error instanceof Error ? error.message : "Unable to load industries.",
      });
      return [];
    } finally {
      setIndustryLoading(false);
    }
  }, [showToast]);

  const loadFunctions = useCallback(async (searchValue = "", signal?: AbortSignal) => {
    setFunctionLoading(true);

    try {
      const response = await fetch("/api/admin/functions/list", {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: 1,
          limit: 100,
          search: searchValue,
          sortBy: "updated_at",
          sortOrder: "desc",
        }),
      });

      const result = (await response.json()) as ApiResponse<ListData<HierarchyRow>>;
      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || result.message || "Unable to load functions.");
      }

      setFunctionRows(result.data.result);
      return result.data.result;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return [];
      }

      showToast({
        tone: "error",
        title: "Functions unavailable",
        description: error instanceof Error ? error.message : "Unable to load functions.",
      });
      return [];
    } finally {
      setFunctionLoading(false);
    }
  }, [showToast]);

  const loadUseCases = useCallback(async (searchValue = "", signal?: AbortSignal) => {
    setUseCaseLoading(true);

    try {
      const response = await fetch("/api/admin/use-cases/list", {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: 1,
          limit: 100,
          search: searchValue,
          sortBy: "updated_at",
          sortOrder: "desc",
        }),
      });

      const result = (await response.json()) as ApiResponse<ListData<HierarchyRow>>;
      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || result.message || "Unable to load use cases.");
      }

      setUseCaseRows(result.data.result);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      showToast({
        tone: "error",
        title: "Use cases unavailable",
        description: error instanceof Error ? error.message : "Unable to load use cases.",
      });
    } finally {
      setUseCaseLoading(false);
    }
  }, [showToast]);

  const ensureIndustriesLoaded = useCallback(async () => {
    if (industryRows.length) {
      return industryRows;
    }
    return loadIndustries();
  }, [industryRows, loadIndustries]);

  useEffect(() => {
    if (view !== "industry") {
      return () => {
        industryAbortRef.current?.abort();
      };
    }

    const timeoutId = window.setTimeout(() => {
      industryAbortRef.current?.abort();
      const controller = new AbortController();
      industryAbortRef.current = controller;
      void loadIndustries(industrySearch.trim(), controller.signal);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      industryAbortRef.current?.abort();
    };
  }, [industrySearch, loadIndustries, view]);

  useEffect(() => {
    if (view !== "function") {
      return () => {
        functionAbortRef.current?.abort();
      };
    }

    const timeoutId = window.setTimeout(() => {
      functionAbortRef.current?.abort();
      const controller = new AbortController();
      functionAbortRef.current = controller;
      void loadFunctions(functionSearch.trim(), controller.signal);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      functionAbortRef.current?.abort();
    };
  }, [functionSearch, loadFunctions, view]);

  useEffect(() => {
    if (view !== "usecase") {
      return () => {
        useCaseAbortRef.current?.abort();
      };
    }

    const timeoutId = window.setTimeout(() => {
      useCaseAbortRef.current?.abort();
      const controller = new AbortController();
      useCaseAbortRef.current = controller;
      void loadUseCases(useCaseSearch.trim(), controller.signal);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      useCaseAbortRef.current?.abort();
    };
  }, [useCaseSearch, loadUseCases, view]);

  function updateIndustryDraft(id: string, title: string) {
    setIndustryDrafts((current) => current.map((row) => (row.id === id ? { ...row, title } : row)));
  }

  function openIndustryCreateDrawer() {
    setIndustryDrawerMode("create");
    setIndustryDrafts([createIndustryDraft()]);
    setIndustryDrawerOpen(true);
  }

  function openIndustryEditDrawer(industry: HierarchyRow) {
    setIndustryDrawerMode("edit");
    setIndustryDrafts([
      {
        id: createId("industry-draft"),
        title: industry.title,
        industryId: industry.id,
      },
    ]);
    setIndustryDrawerOpen(true);
  }

  function addIndustryDraft() {
    setIndustryDrafts((current) => [...current, createIndustryDraft()]);
  }

  function updateFunctionGroupIndustry(groupId: string, industryId: number) {
    setFunctionDraftGroups((current) => current.map((group) => (group.id === groupId ? { ...group, industryId } : group)));
  }

  async function openFunctionCreateDrawer() {
    const nextIndustries = await ensureIndustriesLoaded();
    setFunctionDrawerMode("create");
    setFunctionDraftGroups([createFunctionDraftGroup(nextIndustries[0]?.id ?? 0)]);
    setFunctionDrawerOpen(true);
  }

  async function openFunctionEditDrawer(item: HierarchyRow) {
    await ensureIndustriesLoaded();
    setFunctionDrawerMode("edit");
    setFunctionDraftGroups([
      {
        id: createId("function-group"),
        industryId: item.parentId ?? 0,
        items: [
          {
            id: createId("function-draft"),
            title: item.title,
            functionId: item.id,
          },
        ],
      },
    ]);
    setFunctionDrawerOpen(true);
  }

  function updateFunctionDraft(groupId: string, rowId: string, value: string) {
    setFunctionDraftGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map((row) => (row.id === rowId ? { ...row, title: value } : row)),
            }
          : group,
      ),
    );
  }

  function addFunctionGroup() {
    setFunctionDraftGroups((current) => [...current, createFunctionDraftGroup(industryRows[0]?.id ?? 0)]);
  }

  function removeFunctionGroup(groupId: string) {
    setFunctionDraftGroups((current) =>
      current.length === 1 ? [createFunctionDraftGroup(industryRows[0]?.id ?? 0)] : current.filter((group) => group.id !== groupId),
    );
  }

  function addFunctionDraft(groupId: string) {
    setFunctionDraftGroups((current) =>
      current.map((group) => (group.id === groupId ? { ...group, items: [...group.items, createFunctionDraft()] } : group)),
    );
  }

  function removeFunctionDraft(groupId: string, rowId: string) {
    setFunctionDraftGroups((current) =>
      current.map((group) => {
        if (group.id !== groupId) {
          return group;
        }

        return {
          ...group,
          items: group.items.length === 1 ? [createFunctionDraft()] : group.items.filter((row) => row.id !== rowId),
        };
      }),
    );
  }

  function removeIndustryDraft(id: string) {
    setIndustryDrafts((current) => (current.length === 1 ? [createIndustryDraft()] : current.filter((row) => row.id !== id)));
  }

  async function handleIndustryBulkSave() {
    const items = industryDrafts
      .map((row) => ({
        id: row.industryId,
        title: row.title.trim(),
        description: null as string | null,
      }))
      .filter((row) => row.title);

    if (!items.length) {
      showToast({
        tone: "error",
        title: "Industry name required",
        description: "Add at least one industry name before saving.",
      });
      return;
    }

    setIndustrySaving(true);

    try {
      const response = await fetch("/api/admin/industries/bulk-upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const result = (await response.json()) as ApiResponse<Array<{ id: number; action: "created" | "updated" }>>;
      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Unable to save industries.");
      }

      await loadIndustries(industrySearch.trim());
      setIndustryDrafts([createIndustryDraft()]);
      setIndustryDrawerMode("create");
      setIndustryDrawerOpen(false);
      showToast({
        tone: "success",
        title: industryDrawerMode === "edit" ? "Industry updated" : "Industries saved",
        description:
          industryDrawerMode === "edit"
            ? "The selected industry has been updated successfully."
            : `${items.length} industry${items.length > 1 ? " entries" : " entry"} saved successfully.`,
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save industries.",
      });
    } finally {
      setIndustrySaving(false);
    }
  }

  async function handleFunctionBulkSave() {
    const payload = functionDraftGroups
      .map((group) => ({
        industryId: Number(group.industryId),
        items: group.items
          .map((row) => ({
            id: row.functionId,
            title: row.title.trim(),
            description: null as string | null,
          }))
          .filter((row) => row.title),
      }))
      .filter((group) => group.items.length);

    if (!payload.length) {
      showToast({
        tone: "error",
        title: "Function title required",
        description: "Add at least one function title before saving.",
      });
      return;
    }

    if (payload.some((group) => group.industryId <= 0)) {
      showToast({
        tone: "error",
        title: "Industry required",
        description: "Select a parent industry for every function group before saving.",
      });
      return;
    }

    setFunctionSaving(true);

    try {
      const response = await fetch("/api/admin/functions/bulk-upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ApiResponse<Array<{ id: number; action: "created" | "updated" }>>;
      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Unable to save functions.");
      }

      await loadFunctions(functionSearch.trim());
      setFunctionDraftGroups([createFunctionDraftGroup(industryRows[0]?.id ?? 0)]);
      setFunctionDrawerMode("create");
      setFunctionDrawerOpen(false);
      const totalItems = payload.reduce((sum, group) => sum + group.items.length, 0);
      showToast({
        tone: "success",
        title: functionDrawerMode === "edit" ? "Function updated" : "Functions saved",
        description:
          functionDrawerMode === "edit"
            ? "The selected function has been updated successfully."
            : `${totalItems} function${totalItems > 1 ? " entries" : " entry"} saved successfully.`,
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save functions.",
      });
    } finally {
      setFunctionSaving(false);
    }
  }

  function openUseCase(item?: HierarchyRow) {
    router.push(item ? `/admin/use-cases/${item.id}` : "/admin/use-cases/new");
  }

  async function handleSave() {
    if (mode !== "usecase") {
      return;
    }

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

    setUseCaseSaving(true);

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

      const result = (await response.json()) as ApiResponse<{
        useCase: { id: number; action: "created" | "updated" };
        useCaseDetails: Array<{ id: number; action: "created" | "updated" }>;
      }>;
      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Unable to save use case.");
      }

      await loadUseCases(useCaseSearch.trim());
      if (impactFile && result.data) {
        const impactDetailIndex = usecaseDetails.findIndex((item) => item.type === "Impact");
        const impactDetailResult = result.data.useCaseDetails[impactDetailIndex];
        if (impactDetailResult) {
          setImpactFilePath(`impact/${impactDetailResult.id}${impactFile.name.includes(".") ? impactFile.name.slice(impactFile.name.lastIndexOf(".")) : ""}`);
        }
      }
      setMode(null);
      setImpactFile(null);
      setUseCaseListFields({
        challenges: [""],
        outcomes: [""],
        artefacts: [""],
      });
      showToast({
        tone: "success",
        title: Number(form.id || 0) > 0 ? "Use case updated" : "Use case created",
        description: "The use case and its linked details were saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save use case.",
      });
    } finally {
      setUseCaseSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteState?.type) {
      return;
    }

    const { type, id } = deleteState;

    if (type === "industry") {
      const response = await fetch("/api/admin/industries/bulk", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [Number(id)] }),
      });

      const result = (await response.json()) as ApiResponse<{ deletedIds: number[] }>;
      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Unable to delete industry.");
      }

      await loadIndustries(industrySearch.trim());
    }

    if (type === "function") {
      const response = await fetch("/api/admin/functions/bulk", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [Number(id)] }),
      });

      const result = (await response.json()) as ApiResponse<{ deletedIds: number[] }>;
      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Unable to delete function.");
      }

      await loadFunctions(functionSearch.trim());
    }

    if (type === "usecase") {
      const response = await fetch(`/api/admin/use-cases/${Number(id)}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as ApiResponse<{ deletedId?: number; deletedIds?: number[] }>;
      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Unable to delete use case.");
      }

      await loadUseCases(useCaseSearch.trim());
    }

    setDeleteState(null);
    showToast({ tone: "success", title: "Entry deleted", description: "The selected item has been removed." });
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8">
        {view === "industry" ? (
          <section>
            <h3 className="mb-4 text-xl font-semibold text-slate-950">Industries</h3>
            <AdminDataTable
              rows={industries}
              loading={industryLoading}
              rowKey={(row) => String(row.id)}
              emptyTitle="No industries yet"
              emptyDescription="Create an industry to start structuring use cases."
              toolbar={
                <AdminTableToolbar
                  search={<div className="max-w-[520px]"><SearchField value={industrySearch} onChange={setIndustrySearch} placeholder="Search industry" /></div>}
                  primaryAction={
                    <AdminButton className="h-11 rounded-2xl bg-blue-600 px-5 hover:bg-blue-500" onClick={openIndustryCreateDrawer}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Industry
                    </AdminButton>
                  }
                />
              }
              columns={[
                { key: "serial", label: "S. No.", render: (row) => <div className="font-medium text-slate-600">{industries.findIndex((item) => item.id === row.id) + 1}</div> },
                { key: "name", label: "Name", sortable: true, sortValue: (row) => row.title, render: (row) => <div className="font-medium text-slate-950">{row.title}</div> },
                { key: "date", label: "Date", sortable: true, sortValue: (row) => row.updatedAt, render: (row) => <span className="text-sm text-slate-500">{formatTableDate(row.updatedAt)}</span> },
                {
                  key: "actions",
                  label: "Actions",
                  className: "w-[120px]",
                  render: (row) => (
                    <RowActionButtons
                      onEdit={() => openIndustryEditDrawer(row)}
                      onDelete={() => setDeleteState({ type: "industry", id: row.id })}
                    />
                  ),
                },
              ]}
            />
          </section>
        ) : null}

        {view === "function" ? (
          <section>
            <h3 className="mb-4 text-xl font-semibold text-slate-950">Functions</h3>
            <AdminDataTable
              rows={functions}
              loading={functionLoading}
              rowKey={(row) => String(row.id)}
              emptyTitle="No functions yet"
              emptyDescription="Functions help organize use cases under each industry."
              toolbar={
                <AdminTableToolbar
                  search={<div className="max-w-[520px]"><SearchField value={functionSearch} onChange={setFunctionSearch} placeholder="Search function" /></div>}
                  primaryAction={
                    <AdminButton className="h-11 rounded-2xl bg-blue-600 px-5 hover:bg-blue-500" onClick={() => void openFunctionCreateDrawer()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Function
                    </AdminButton>
                  }
                />
              }
              columns={[
                { key: "serial", label: "S. No.", render: (_row, index) => <span className="text-sm text-slate-500">{index + 1}</span> },
                { key: "name", label: "Name", sortable: true, sortValue: (row) => row.title, render: (row) => <div className="font-medium text-slate-950">{row.title}</div> },
                { key: "industry", label: "Industry", render: (row) => row.parentTitle ?? "-" },
                { key: "date", label: "Date", sortable: true, sortValue: (row) => row.updatedAt, render: (row) => <span className="text-sm text-slate-500">{formatTableDate(row.updatedAt)}</span> },
                {
                  key: "actions",
                  label: "Actions",
                  className: "w-[120px]",
                  render: (row) => (
                    <RowActionButtons
                      onEdit={() => void openFunctionEditDrawer(row)}
                      onDelete={() => setDeleteState({ type: "function", id: row.id })}
                    />
                  ),
                },
              ]}
            />
          </section>
        ) : null}

        {view === "usecase" ? (
          <section>
            <h3 className="mb-4 text-xl font-semibold text-slate-950">Use Cases</h3>
            <AdminDataTable
              rows={useCases}
              loading={useCaseLoading}
              rowKey={(row) => String(row.id)}
              emptyTitle="No use cases yet"
              emptyDescription="Use cases define the actual detail pages and structured outcomes."
              toolbar={
                <AdminTableToolbar
                  search={<div className="max-w-[520px]"><SearchField value={useCaseSearch} onChange={setUseCaseSearch} placeholder="Search use case" /></div>}
                  primaryAction={
                    <AdminButton className="h-11 rounded-2xl bg-blue-600 px-5 hover:bg-blue-500" onClick={() => openUseCase()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Use Case
                    </AdminButton>
                  }
                />
              }
              columns={[
                { key: "serial", label: "S. No.", render: (_row, index) => <span className="text-sm text-slate-500">{index + 1}</span> },
                { key: "title", label: "Name", sortable: true, sortValue: (row) => row.title, render: (row) => <div className="font-medium text-slate-950">{row.title}</div> },
                { key: "function", label: "Function", render: (row) => row.parentTitle ?? "-" },
                { key: "date", label: "Date", sortable: true, sortValue: (row) => row.updatedAt, render: (row) => <span className="text-sm text-slate-500">{formatTableDate(row.updatedAt)}</span> },
                {
                  key: "actions",
                  label: "Actions",
                  className: "w-[120px]",
                  render: (row) => (
                    <RowActionButtons
                      onEdit={() => void openUseCase(row)}
                      onDelete={() => setDeleteState({ type: "usecase", id: row.id })}
                    />
                  ),
                },
              ]}
            />
          </section>
        ) : null}
      </div>

      <Modal
        open={industryDrawerOpen}
        onClose={() => {
          setIndustryDrawerOpen(false);
          setIndustryDrawerMode("create");
          setIndustryDrafts([createIndustryDraft()]);
        }}
        title={industryDrawerMode === "edit" ? "Edit Industry" : "Add Industries"}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {industryDrawerMode === "create" ? (
                <AdminButton variant="secondary" onClick={addIndustryDraft}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add More
                </AdminButton>
              ) : null}
            </div>
            <div className="flex items-center justify-end gap-3">
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setIndustryDrawerOpen(false);
                  setIndustryDrawerMode("create");
                  setIndustryDrafts([createIndustryDraft()]);
                }}
              >
                Cancel
              </AdminButton>
              <AdminButton disabled={industrySaving} onClick={() => void handleIndustryBulkSave()}>
                {industrySaving
                  ? industryDrawerMode === "edit"
                    ? "Updating..."
                    : "Saving..."
                  : industryDrawerMode === "edit"
                    ? "Update Industry"
                    : "Save Industries"}
              </AdminButton>
            </div>
          </div>
        }
      >
        <div className="space-y-3">
          {industryDrafts.map((row, index) => (
            <div key={row.id} className="flex items-end gap-3 rounded-[16px] border border-slate-200 bg-slate-50/60 p-3">
              <div className="flex-1">
                <AdminInput
                  value={row.title}
                  onChange={(event) => updateIndustryDraft(row.id, event.target.value)}
                  placeholder={`Industry name ${index + 1}`}
                />
              </div>
              {industryDrawerMode === "create" && industryDrafts.length > 1 ? (
                <AdminButton
                  variant="ghost"
                  className="h-[46px] px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => removeIndustryDraft(row.id)}
                >
                  <Trash2 className="h-4 w-4 text-rose-600" />
                </AdminButton>
              ) : null}
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={functionDrawerOpen}
        onClose={() => {
          setFunctionDrawerOpen(false);
          setFunctionDrawerMode("create");
          setFunctionDraftGroups([createFunctionDraftGroup(industryRows[0]?.id ?? 0)]);
        }}
        title={functionDrawerMode === "edit" ? "Edit Function" : "Add Functions"}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {functionDrawerMode === "create" ? (
                <AdminButton variant="secondary" onClick={addFunctionGroup}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Industry Group
                </AdminButton>
              ) : null}
            </div>
            <div className="flex items-center justify-end gap-3">
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setFunctionDrawerOpen(false);
                  setFunctionDrawerMode("create");
                  setFunctionDraftGroups([createFunctionDraftGroup(industryRows[0]?.id ?? 0)]);
                }}
              >
                Cancel
              </AdminButton>
              <AdminButton disabled={functionSaving} onClick={() => void handleFunctionBulkSave()}>
                {functionSaving
                  ? functionDrawerMode === "edit"
                    ? "Updating..."
                    : "Saving..."
                  : functionDrawerMode === "edit"
                    ? "Update Function"
                    : "Save Functions"}
              </AdminButton>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {functionDraftGroups.map((group) => (
            <div key={group.id} className="space-y-3 rounded-[16px] border border-slate-200 bg-slate-50/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <AdminSelect
                    label="Parent Industry"
                    value={group.industryId ? String(group.industryId) : ""}
                    onChange={(event) => updateFunctionGroupIndustry(group.id, Number(event.target.value))}
                    disabled={functionDrawerMode === "edit"}
                  >
                    <option value="" disabled>
                      Select industry
                    </option>
                    {industryRows.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </AdminSelect>
                </div>
                {functionDrawerMode === "create" ? (
                  <AdminButton
                    variant="ghost"
                    className="mt-7 h-[46px] px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => removeFunctionGroup(group.id)}
                  >
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  </AdminButton>
                ) : null}
              </div>

              <div className="space-y-3">
                {group.items.map((row, index) => (
                  <div key={row.id} className="flex items-end gap-3 rounded-[16px] border border-slate-200 bg-white p-3">
                    <div className="flex-1">
                      <AdminInput
                        value={row.title}
                        onChange={(event) => updateFunctionDraft(group.id, row.id, event.target.value)}
                        placeholder={`Function name ${index + 1}`}
                      />
                    </div>
                    {functionDrawerMode === "create" && group.items.length > 1 ? (
                      <AdminButton
                        variant="ghost"
                        className="h-[46px] px-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => removeFunctionDraft(group.id, row.id)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </AdminButton>
                    ) : null}
                  </div>
                ))}
              </div>

              {functionDrawerMode === "create" ? (
                <AdminButton variant="secondary" onClick={() => addFunctionDraft(group.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Function
                </AdminButton>
              ) : null}
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={Boolean(mode)}
        onClose={() => setMode(null)}
        title="Use Case Editor"
        description="Edit structured content in-place with validation-friendly fixed fields."
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setMode(null)}>
              Cancel
            </AdminButton>
            <AdminButton disabled={useCaseSaving || impactFileProcessing} onClick={() => void handleSave()}>
              {impactFileProcessing ? "Processing Media..." : useCaseSaving ? "Saving..." : "Save Use Case"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-5">
          {mode === "usecase" ? (
            <>
              <div className="grid gap-4 md:grid-cols-1">
                <AdminInput label="Use Case Title" value={form.title || ""} onChange={(event) => updateForm("title", event.target.value)} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <AdminSelect label="Industry" value={form.industryId || ""} onChange={(event) => updateForm("industryId", event.target.value)}>
                  <option value="" disabled>Select industry</option>
                  {industryRows.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </AdminSelect>
                <AdminSelect label="Function" value={form.functionId || ""} onChange={(event) => updateForm("functionId", event.target.value)}>
                  <option value="" disabled>Select function</option>
                  {functionRows.filter((item) => !form.industryId || String(item.parentId) === String(form.industryId)).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                </AdminSelect>
              </div>
              <AdminTextarea label="Summary / Intro" value={form.summary || ""} onChange={(event) => updateForm("summary", event.target.value)} />
              <AdminTextarea label="Impact" value={form.impactDescription || ""} onChange={(event) => updateForm("impactDescription", event.target.value)} />
              <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-semibold text-slate-950">Impact Media</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Upload an image or video up to {IMPACT_MEDIA_MAX_WIDTH}x{IMPACT_MEDIA_MAX_HEIGHT}. Images are compressed before upload.
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-700">
                      Current file: {impactFile ? impactFile.name : impactFilePath || "No file selected"}
                    </p>
                  </div>
                  <label className="inline-flex min-w-[148px] cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                    <Upload className="mr-2 h-4 w-4" />
                    {impactFile ? "Change File" : "Upload File"}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(event) => void handleImpactFileChange(event)}
                    />
                  </label>
                </div>
                {impactFileError ? (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                    <p className="text-sm font-medium text-rose-700">{impactFileError}</p>
                  </div>
                ) : null}
                {impactFileProcessing ? (
                  <p className="mt-3 text-sm text-slate-500">
                    Validating and optimizing media...
                  </p>
                ) : null}
              </div>
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
            </>
          ) : null}
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteState)}
        onClose={() => setDeleteState(null)}
        onConfirm={() => void handleDelete()}
        title="Delete selected item?"
        description="Deleting a parent entity also removes its dependent child records from this content store."
        confirmLabel="Delete"
      />
    </div>
  );
}
