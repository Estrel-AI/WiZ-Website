"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Edit3, Layers3, Sparkles, Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  ConfirmDialog,
  Modal,
  SectionHeader,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import SalesBannerStrip from "@/src/components/website/sales-banner-strip";
import {
  IMPACT_IMAGE_COMPRESSION_QUALITY,
  IMPACT_IMAGE_MAX_SIZE_BYTES,
  IMPACT_IMAGE_MAX_SIZE_MB,
  IMPACT_MEDIA_MAX_HEIGHT,
  IMPACT_MEDIA_MAX_WIDTH,
  IMPACT_VIDEO_MAX_SIZE_BYTES,
  IMPACT_VIDEO_MAX_SIZE_MB,
} from "@/src/lib/admin-media-constraints";
import { cn } from "@/src/lib/utils";
import type { ApiResponse, HeroSectionRow } from "@/src/types/admin-api";

type EditorKey = "salesBar" | "heroSection" | null;

const EMPTY_HERO: HeroSectionRow = {
  id: 0,
  data: {
    salesBarText: "",
    heroHeading: "",
    highlightedHeading: "",
    shortDescription: "",
    buttonText: "",
    buttonText2: "",
    filepath: null,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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
        "group relative rounded-2xl border border-dashed border-white/0 text-left transition focus:outline-none",
        active && "ring-2 ring-secondary/80",
        className,
      )}
    >
      <span className="pointer-events-none absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus:opacity-100">
        <Edit3 className="h-3 w-3" />
        {label}
      </span>
      {children}
    </button>
  );
}

function getHeroImageUrl(filepath: string | null) {
  if (!filepath) {
    return null;
  }

  const [folder, fileName] = filepath.split("/");
  if (!folder || !fileName) {
    return null;
  }

  return `/api/media/${folder}/${fileName}`;
}

function isVideoMedia(path: string | null) {
  if (!path) {
    return false;
  }

  const normalized = path.toLowerCase();
  return normalized.endsWith(".mp4") || normalized.endsWith(".webm") || normalized.endsWith(".mov") || normalized.endsWith(".ogv");
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

async function prepareHeroMediaFile(file: File) {
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

    return { file: compressedFile, wasCompressed: compressedFile !== file };
  }

  if (file.type.startsWith("video/")) {
    if (file.size > IMPACT_VIDEO_MAX_SIZE_BYTES) {
      throw new Error(`Video size must be ${IMPACT_VIDEO_MAX_SIZE_MB} MB or less.`);
    }

    return { file, wasCompressed: false };
  }

  throw new Error("Only image and video files are allowed.");
}

const AdminHomePage = dynamic(async () => AdminHomePageInner, {
  ssr: false,
  loading: () => <div className="text-sm text-slate-500">Loading home hero editor...</div>,
});

export default AdminHomePage;

function AdminHomePageInner() {
  const { showToast } = useAdminToast();
  const [activeEditor, setActiveEditor] = useState<EditorKey>(null);
  const [heroSection, setHeroSection] = useState<HeroSectionRow | null>(null);
  const [draftHero, setDraftHero] = useState<HeroSectionRow | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroFileError, setHeroFileError] = useState("");
  const [heroFileProcessing, setHeroFileProcessing] = useState(false);
  const [heroFilePreviewUrl, setHeroFilePreviewUrl] = useState<string | null>(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroSaving, setHeroSaving] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const workingHero = draftHero ?? heroSection ?? EMPTY_HERO;
  const heroHasUnsavedChanges = heroSection !== null && draftHero !== null
    ? JSON.stringify(heroSection.data) !== JSON.stringify(draftHero.data)
    : false;
  const hasUnsavedChanges = heroHasUnsavedChanges || Boolean(heroFile);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    let active = true;

    async function loadHeroSection() {
      setHeroLoading(true);

      try {
        const response = await fetch("/api/admin/hero-section", { cache: "no-store" });
        const payload = (await response.json()) as ApiResponse<HeroSectionRow>;

        if (!active) {
          return;
        }

        if (response.ok && payload.data) {
          setHeroSection(payload.data);
          setDraftHero(null);
        } else {
          setHeroSection(EMPTY_HERO);
        }
        } catch {
        if (active) {
          setHeroSection(EMPTY_HERO);
          showToast({
            tone: "error",
            title: "Unable to load hero section",
            description: "Showing an empty hero draft instead.",
          });
        }
      } finally {
        if (active) {
          setHeroLoading(false);
        }
      }
    }

    void loadHeroSection();
    return () => {
      active = false;
    };
  }, [showToast]);

  useEffect(() => {
    if (!heroFile) {
      setHeroFilePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(heroFile);
    setHeroFilePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [heroFile]);

  const editorDescription = useMemo(() => {
    switch (activeEditor) {
      case "salesBar":
        return "Edit only the sales bar copy for the homepage hero.";
      case "heroSection":
        return "Edit the full hero section and keep changes local until you save the page.";
      default:
        return "Click a hero area to open its editor.";
    }
  }, [activeEditor]);

  function updateHeroDraft(mutator: (draft: HeroSectionRow) => HeroSectionRow) {
    setDraftHero((current) => {
      const source = current ?? structuredClone(heroSection ?? EMPTY_HERO);
      return mutator(structuredClone(source));
    });
  }

  async function handleHeroFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    setHeroFileProcessing(true);
    setHeroFileError("");

    try {
      const prepared = await prepareHeroMediaFile(selectedFile);
      setHeroFile(prepared.file);

      if (prepared.wasCompressed) {
        showToast({
          tone: "success",
          title: "Image optimized",
          description: "The selected image was compressed before saving.",
        });
      }
    } catch (error) {
      setHeroFile(null);
      setHeroFileError(error instanceof Error ? error.message : "Unable to process the selected file.");
    } finally {
      setHeroFileProcessing(false);
    }
  }

  function handleDiscardChanges() {
    setDraftHero(null);
    setHeroFile(null);
    setHeroFileError("");
    setShowDiscardDialog(false);
  }

  function handleRemoveHeroMedia() {
    setHeroFile(null);
    setHeroFileError("");
    updateHeroDraft((draft) => ({
      ...draft,
      data: {
        ...draft.data,
        filepath: null,
      },
    }));
  }

  async function handleSaveChanges() {
    setHeroSaving(true);

    try {
      const requestPayload = {
        id: workingHero.id,
        data: workingHero.data,
      };

      const response = await fetch(
        "/api/admin/hero-section/upsert",
        heroFile
          ? {
              method: "POST",
              body: (() => {
                const formData = new FormData();
                formData.append("data", JSON.stringify(requestPayload));
                formData.append("file", heroFile);
                return formData;
              })(),
            }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestPayload),
            },
      );

      const payload = (await response.json()) as ApiResponse<{ id: number; action: "created" | "updated" }>;
      if (!response.ok || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to save hero section.");
      }

      const nextHero: HeroSectionRow = {
        ...workingHero,
        id: payload.data.id,
        data: {
          ...workingHero.data,
          filepath: heroFile
            ? `hero/${payload.data.id}${heroFile.name.includes(".") ? heroFile.name.slice(heroFile.name.lastIndexOf(".")) : ""}`
            : workingHero.data.filepath,
        },
        updatedAt: new Date().toISOString(),
      };

      setHeroSection(nextHero);
      setDraftHero(null);
      setHeroFile(null);
      setHeroFileError("");
      setActiveEditor(null);
      showToast({
        tone: "success",
        title: "Hero section updated",
        description: "Homepage hero changes were saved successfully.",
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Unable to save hero section",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setHeroSaving(false);
    }
  }

  if (heroLoading) {
    return <div className="text-sm text-slate-500">Loading home hero editor...</div>;
  }

  const heroBackgroundImage = heroFilePreviewUrl ?? getHeroImageUrl(workingHero.data.filepath);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Home Hero Editor"
        description="This page now manages only the API-backed homepage hero and sales bar."
        action={
          <div className="flex items-center gap-3">
            <AdminButton
              variant="secondary"
              onClick={() => setShowDiscardDialog(true)}
              disabled={!hasUnsavedChanges || heroSaving || heroFileProcessing}
            >
              Discard
            </AdminButton>
            <AdminButton
              onClick={() => void handleSaveChanges()}
              disabled={!hasUnsavedChanges || heroSaving || heroFileProcessing}
            >
              {heroFileProcessing ? "Processing Media..." : heroSaving ? "Saving..." : "Save"}
            </AdminButton>
          </div>
        }
      />

      <AdminCard className="overflow-hidden p-3 md:p-4">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.24em] text-slate-600">Hero Preview</div>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">Edit the sales bar and hero section only</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              <Layers3 className="h-4 w-4" />
              API-backed hero
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700">
              <Sparkles className="h-4 w-4" />
              No CMS dependency
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-[#120711] shadow-inner">
          <section className="relative overflow-hidden bg-[#1D0612] font-sans">
            <OverlayButton
              label="Sales Bar"
              active={activeEditor === "salesBar"}
              onClick={() => setActiveEditor("salesBar")}
              className="block w-full rounded-none border-0"
            >
              <SalesBannerStrip text={workingHero.data.salesBarText || "Sales bar text"} />
            </OverlayButton>

            <OverlayButton
              label="Hero Section"
              active={activeEditor === "heroSection"}
              onClick={() => setActiveEditor("heroSection")}
              className="block w-full rounded-none border-0"
            >
              <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-8 md:min-h-[calc(100vh-80px)] md:py-20">
                {heroBackgroundImage ? (
                  <div className="absolute inset-0">
                    {isVideoMedia(heroBackgroundImage) ? (
                      <video className="h-full w-full object-cover opacity-55" autoPlay muted loop playsInline>
                        <source src={heroBackgroundImage} />
                      </video>
                    ) : (
                      <Image
                        src={heroBackgroundImage}
                        alt={workingHero.data.heroHeading || "Hero background"}
                        fill
                        className="object-cover opacity-55"
                        sizes="100vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-[#1D0612]/50" />
                  </div>
                ) : null}
                <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-hero blur-[160px] pointer-events-none" />
                <div className="relative z-10 mx-auto max-w-6xl text-center">
                  <h1 className="mb-3 text-4xl font-bold leading-tight tracking-tight text-white md:mb-6 md:text-6xl md:leading-[1.1] lg:text-[4.5rem] xl:text-[5.5rem]">
                    {workingHero.data.heroHeading || "Hero heading"}
                    <br />
                    <span className="bg-gradient-to-r from-secondary to-[#E68F17] bg-clip-text text-transparent">
                      {workingHero.data.highlightedHeading || "Highlighted heading"}
                    </span>
                  </h1>
                  <p className="mx-auto mb-5 max-w-2xl text-center text-base text-[#FDFDFD] md:mb-10 md:text-xl">
                    {workingHero.data.shortDescription || "Short description"}
                  </p>
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <span className="inline-flex w-fit items-center justify-center rounded-full border border-white/50 bg-transparent px-4 py-2 font-semibold text-white md:rounded-lg md:px-8 md:py-3 md:text-lg">
                      {workingHero.data.buttonText || "Button text"}
                    </span>
                    <span className="inline-flex w-fit items-center justify-center rounded-full bg-gradient-to-r from-quaternary to-[#AD2D45] px-4 py-2 font-semibold text-white md:rounded-lg md:px-8 md:py-3 md:text-lg">
                      {workingHero.data.buttonText2 || "Button text 2"}
                    </span>
                  </div>
                </div>
              </main>
            </OverlayButton>
          </section>
        </div>
      </AdminCard>

      <Modal
        open={Boolean(activeEditor)}
        onClose={() => setActiveEditor(null)}
        title={activeEditor === "salesBar" ? "Edit Sales Bar" : "Edit Hero Section"}
        description={editorDescription}
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600">Changes here stay local until you click the page-level Save button.</div>
            <AdminButton variant="secondary" onClick={() => setActiveEditor(null)} disabled={heroSaving || heroFileProcessing}>
              Close
            </AdminButton>
          </div>
        }
      >
        {activeEditor === "salesBar" ? (
          <div className="space-y-5">
            <AdminTextarea
              label="Sales Bar Text"
              value={workingHero.data.salesBarText}
              onChange={(event) =>
                updateHeroDraft((draft) => ({
                  ...draft,
                  data: { ...draft.data, salesBarText: event.target.value },
                }))
              }
            />
          </div>
        ) : null}

        {activeEditor === "heroSection" ? (
          <div className="space-y-5">
            <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-semibold text-slate-950">Hero Background Media</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Upload an image or video up to {IMPACT_MEDIA_MAX_WIDTH}x{IMPACT_MEDIA_MAX_HEIGHT}. Images are compressed before upload.
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    Current file: {heroFile ? heroFile.name : workingHero.data.filepath || "No file selected"}
                  </p>
                </div>
                <label className="inline-flex min-w-[148px] cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                  <Upload className="mr-2 h-4 w-4" />
                  {heroFile ? "Change File" : "Upload File"}
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={(event) => void handleHeroFileChange(event)} />
                </label>
              </div>
              {heroFile || workingHero.data.filepath ? (
                <div className="mt-4 flex justify-end">
                  <AdminButton variant="secondary" onClick={handleRemoveHeroMedia} disabled={heroFileProcessing || heroSaving}>
                    Remove Background Media
                  </AdminButton>
                </div>
              ) : null}
              {heroFileError ? (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <p className="text-sm font-medium text-rose-700">{heroFileError}</p>
                </div>
              ) : null}
              {heroFileProcessing ? <p className="mt-3 text-sm text-slate-500">Validating and optimizing media...</p> : null}
              {heroBackgroundImage ? (
                <div className="mt-4 overflow-hidden rounded-[18px] border border-slate-200 bg-slate-950">
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <div className="text-sm font-medium text-white">
                      {heroFile ? "Selected media preview" : "Saved backend media preview"}
                    </div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {isVideoMedia(heroBackgroundImage) ? "Video" : "Image"}
                    </div>
                  </div>
                  <div className="relative h-[240px] bg-black">
                    {isVideoMedia(heroBackgroundImage) ? (
                      <video className="h-full w-full object-cover" controls playsInline>
                        <source src={heroBackgroundImage} />
                      </video>
                    ) : (
                      <Image
                        src={heroBackgroundImage}
                        alt="Hero media preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 720px"
                      />
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* <AdminInput
              label="Filepath (background image)"
              value={workingHero.data.filepath ?? ""}
              onChange={(event) =>
                updateHeroDraft((draft) => ({
                  ...draft,
                  data: { ...draft.data, filepath: event.target.value.trim() || null },
                }))
              }
              placeholder="hero/your-file-name.webp"
            /> */}
            <AdminInput
              label="Hero Heading"
              value={workingHero.data.heroHeading}
              onChange={(event) =>
                updateHeroDraft((draft) => ({
                  ...draft,
                  data: { ...draft.data, heroHeading: event.target.value },
                }))
              }
            />
            <AdminInput
              label="Highlighted Heading"
              value={workingHero.data.highlightedHeading}
              onChange={(event) =>
                updateHeroDraft((draft) => ({
                  ...draft,
                  data: { ...draft.data, highlightedHeading: event.target.value },
                }))
              }
            />
            <AdminTextarea
              label="Short Description"
              value={workingHero.data.shortDescription}
              onChange={(event) =>
                updateHeroDraft((draft) => ({
                  ...draft,
                  data: { ...draft.data, shortDescription: event.target.value },
                }))
              }
            />
            <div className="grid gap-5 md:grid-cols-2">
              <AdminInput
                label="Button Text"
                value={workingHero.data.buttonText}
                onChange={(event) =>
                  updateHeroDraft((draft) => ({
                    ...draft,
                    data: { ...draft.data, buttonText: event.target.value },
                  }))
                }
              />
              <AdminInput
                label="Button Text 2"
                value={workingHero.data.buttonText2}
                onChange={(event) =>
                  updateHeroDraft((draft) => ({
                    ...draft,
                    data: { ...draft.data, buttonText2: event.target.value },
                  }))
                }
              />
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={showDiscardDialog}
        title="Discard all unsaved changes?"
        description="This will remove unsaved updates from the home hero draft."
        confirmLabel="Discard all"
        onConfirm={handleDiscardChanges}
        onClose={() => setShowDiscardDialog(false)}
      />
    </div>
  );
}
