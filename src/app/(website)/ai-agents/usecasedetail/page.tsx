"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "@/src/components/website/theme-toggle";
import type { ApiResponse, HierarchyRow, UseCaseDetailRow, UseCaseDetailType } from "@/src/types/admin-api";

type UseCaseDetailResponse = {
  useCase: HierarchyRow;
  details: UseCaseDetailRow[];
};

type CollapsibleSectionKey = "challenges" | "outcomes" | "artifacts";

function CollapsibleSectionHeading({
  title,
  collapsed,
  onToggle,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <button
        type="button"
        aria-expanded={!collapsed}
        onClick={onToggle}
        className="flex shrink-0 items-center text-left md:pointer-events-none"
      >
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl">
          {title}
        </h2>
      </button>
      <div className="h-px flex-1 bg-[#c1c1c1] dark:bg-[#3a2640]" />
      <button
        type="button"
        aria-label={`${collapsed ? "Expand" : "Collapse"} ${title}`}
        aria-expanded={!collapsed}
        onClick={onToggle}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#d63d75]/15 text-[#771c48] transition-colors hover:bg-[#d63d75]/25 dark:bg-[#d63d75]/20 dark:text-[#ff8fb8] dark:hover:bg-[#d63d75]/30 md:hidden"
      >
        <ChevronDown
          aria-hidden="true"
          className={`size-5 transition-transform duration-200 ${
            collapsed ? "-rotate-90" : ""
          }`}
        />
      </button>
    </div>
  );
}

function findDetail(details: UseCaseDetailRow[], type: UseCaseDetailType) {
  return details.find((item) => item.type === type);
}

function extractTextItems(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  return value
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderHtml(value: string | null | undefined, fallback: string) {
  return value?.trim() ? value : `<p>${fallback}</p>`;
}

function getImpactMediaUrl(filePath: string | null | undefined) {
  if (!filePath) {
    return null;
  }

  const [folder, fileName] = filePath.split("/");
  if (!folder || !fileName) {
    return null;
  }

  return `/api/media/${folder}/${fileName}`;
}

function isVideoFile(filePath: string | null | undefined) {
  if (!filePath) {
    return false;
  }

  return /\.(mp4|webm|ogv|mov)$/i.test(filePath);
}

export default function UseCaseDetailPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<UseCaseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<CollapsibleSectionKey, boolean>>({
    challenges: false,
    outcomes: false,
    artifacts: false,
  });

  const useCaseId = Number(searchParams.get("useCaseId") ?? 0);
  const industryTitle = searchParams.get("industryTitle") ?? "Use Cases";
  const functionTitle = searchParams.get("functionTitle") ?? "Function";

  function toggleSection(section: CollapsibleSectionKey) {
    setCollapsedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  useEffect(() => {
    if (!Number.isInteger(useCaseId) || useCaseId <= 0) {
      setError("A valid use case id is required.");
      setLoading(false);
      setData(null);
      return;
    }

    const controller = new AbortController();

    async function loadUseCaseDetails() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/use-case-details/${useCaseId}`, {
          signal: controller.signal,
        });
        const result = (await response.json()) as ApiResponse<UseCaseDetailResponse>;

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || result.message || "Unable to load use case details.");
        }

        setData(result.data);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "Unable to load use case details.");
        setData(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadUseCaseDetails();
    return () => controller.abort();
  }, [useCaseId]);

  const sections = useMemo(() => {
    const details = data?.details ?? [];
    const impactDetail = findDetail(details, "Impact");
    const challenges = extractTextItems(findDetail(details, "Challenges")?.description);
    const artifacts = extractTextItems(findDetail(details, "Artifacts")?.description);
    const outcomes = extractTextItems(findDetail(details, "Outcome")?.description);
    const impactHtml = renderHtml(
      impactDetail?.description,
      "Impact details are not available for this use case yet.",
    );
    const impactMediaUrl = getImpactMediaUrl(impactDetail?.filePath);
    const impactMediaIsVideo = isVideoFile(impactDetail?.filePath);

    return {
      challenges,
      artifacts,
      outcomes,
      impactHtml,
      impactMediaUrl,
      impactMediaIsVideo,
    };
  }, [data]);

  return (
    <main>
      <div className="bg-gray-100 text-gray-900 transition-colors duration-300 dark:bg-primary dark:text-slate-300">
        <main className="container mx-auto min-h-screen font-sans p-4 text-gray-600 selection:bg-[#d63d75]/30 dark:text-slate-300 sm:p-6 lg:p-10">
          <div className="mb-6 flex items-center justify-between">
            <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <Link href="/ai-agents" className="cursor-pointer text-gray-500 transition hover:text-gray-900 dark:text-slate-400 dark:hover:text-white">
                AI Agents
              </Link>
              <span className="text-gray-300 dark:text-[#ffffff]">/</span>
              <span className="text-gray-500 dark:text-slate-400">{industryTitle}</span>
              <span className="text-gray-300 dark:text-[#ffffff]">/</span>
              <span className="text-gray-500 dark:text-slate-400">{functionTitle}</span>
              <span className="text-gray-300 dark:text-[#ffffff]">/</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data?.useCase.title ?? "Use Case"}
              </span>
            </nav>
            <ThemeToggle />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="mb-10">
            <span className="mb-4 inline-block rounded-full border border-secondary/80  dark:border-secondary/20 bg-secondary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#771c48] dark:border-[#d63d75]/30 dark:bg-[#d63d75]/10 dark:text-[#ff8fb8] sm:text-xs">
              {functionTitle}
            </span>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">

  {/* Left Content */}
  <div className="w-full lg:max-w-3xl">
    
    <h1 className="mb-4 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
      {loading ? "Loading use case..." : data?.useCase.title ?? "Use Case"}
    </h1>

    <p className="text-sm leading-relaxed text-gray-500 dark:text-slate-400 sm:text-base md:text-lg">
      <span className="font-medium text-gray-900 dark:text-white">
        USE CASE -{" "}
      </span>
      {data?.useCase.description || "Admin-managed use case details are shown below."}
    </p>
  </div>

  {/* Right Card */}
  <div className="w-full md:max-w-md lg:max-w-sm xl:w-80 shrink-0 rounded-3xl bg-gradient-to-br from-[#d63d75] to-[#fac534] p-[1px] shadow-sm dark:shadow-[0_0_30px_rgba(214,61,117,0.2)]">
    
    <div className="h-full rounded-[23px] bg-white px-4 py-3 sm:px-4 sm:py-4 lg:px-6 dark:bg-[#1c1222]">
      
      <span className="mb-3 block text-[16px] font-bold uppercase tracking-widest text-[#771c48] dark:text-[#ff8fb8] sm:text-lg">
        Impact
      </span>

      <div
        className="prose prose-sm max-w-none text-gray-600 dark:prose-invert dark:text-slate-300 sm:prose-base"
        dangerouslySetInnerHTML={{ __html: sections.impactHtml }}
      />
    </div>
  </div>

</div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="min-w-0 lg:col-span-6">
              {/* challenges  */}
              <div className="mb-10 lg:mb-16">
                <CollapsibleSectionHeading
                  title="The Challenges"
                  collapsed={collapsedSections.challenges}
                  onToggle={() => toggleSection("challenges")}
                />
                <div
                  className={`grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 md:grid md:gap-5 ${
                    collapsedSections.challenges ? "hidden md:grid" : "grid"
                  }`}
                >
                  {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
                    ))
                    : sections.challenges.length
                      ? sections.challenges.map((item, index) => (
                        <div key={`${item}-${index}`} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-all duration-300 ease-in-out hover:border-[#b7446f] hover:shadow-sm dark:border-[#3a2640] dark:bg-[#FFFFFF0D] dark:hover:border-[#912059] dark:hover:bg-gradient-to-br dark:hover:from-[#240D1A] dark:hover:via-[#240D1A] dark:hover:to-[#9120595d] dark:hover:shadow-[0_0_15px_rgba(171,56,106,0.2)] dark:hover:scale-[1.02] sm:p-4 group">
                         
                          <p className="text-md leading-relaxed text-gray-600 dark:text-slate-300">{item}</p>
                        </div>
                      ))
                      : (
                        <div className="col-span-full rounded-2xl border border-dashed border-[#b7446f] bg-gray-50 p-6 text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                          Challenge details are not available for this use case yet.
                        </div>
                      )}
                </div>
              </div>
              {/* outcomes  */}
              <div className="xl:col-span-2">
                <CollapsibleSectionHeading
                  title="Outcomes"
                  collapsed={collapsedSections.outcomes}
                  onToggle={() => toggleSection("outcomes")}
                />

                <div
                  className={`grid-cols-1 gap-4 md:grid md:grid-cols-2 md:gap-5 ${
                    collapsedSections.outcomes ? "hidden md:grid" : "grid"
                  }`}
                >
                  {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-36 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
                    ))
                  ) : sections.outcomes.length ? (
                    sections.outcomes.map((item, index) => (
                      <div key={`${item}-${index}`} className="flex h-full flex-col rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-all duration-300 ease-in-out hover:border-[#b7446f] hover:shadow-md dark:border-[#3a2640] dark:bg-[#FFFFFF0D] dark:hover:border-[#912059] dark:hover:bg-gradient-to-br dark:hover:from-[#240D1A] dark:hover:via-[#240D1A] dark:hover:to-[#9120595d] dark:hover:shadow-[0_0_15px_rgba(171,56,106,0.2)] dark:hover:scale-[1.02] md:p-4">
                        {/* <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Outcome</h3> */}
                        <p className="text-md text-gray-600 dark:text-slate-300">{item}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full rounded-2xl border border-dashed border-[#b7446f] bg-gray-50 p-6 text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                      Outcome details are not available for this use case yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="min-w-0 lg:col-span-6">
              {/* image/video  */}
              {sections.impactMediaUrl ? (
                sections.impactMediaIsVideo ? (
                  <video
                    src={sections.impactMediaUrl}
                    controls
                    className="mt-4 mb-10 block h-56 w-full rounded-2xl bg-black object-cover sm:h-72 lg:h-[420px]"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={sections.impactMediaUrl}
                    alt={`${data?.useCase.title ?? "Use case"} impact`}
                    className="mt-4 mb-10 block h-56 w-full rounded-2xl object-cover object-center sm:h-72 lg:h-[420px]"
                  />
                )
              ) : (
                <img
                  src="/images/workflow.png"
                  alt="workflow"
                  className="mt-4 mb-10 block h-56 w-full rounded-2xl object-cover object-center sm:h-72 lg:h-[420px]"
                />
              )}

              {/* Key Artefacts Generated */}
              {loading || sections.artifacts.length ? (
                <div className="space-y-4 xl:col-span-1">
                  <CollapsibleSectionHeading
                    title="Key Artefacts Generated"
                    collapsed={collapsedSections.artifacts}
                    onToggle={() => toggleSection("artifacts")}
                  />

                  <div className={collapsedSections.artifacts ? "hidden space-y-4 md:block" : "space-y-4"}>
                    {loading
                      ? Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
                      ))
                      : sections.artifacts.map((item, index) => (
                        <div key={`${item}-${index}`} className="rounded-r-xl border-y border-r border-l-4 border-gray-200 border-l-[#771c48] bg-gray-50 p-4 transition-all duration-300 ease-in-out hover:border-[#b7446f] hover:shadow-sm dark:border-r-[#3a2640] dark:border-y-[#3a2640] dark:bg-[#FFFFFF0D] dark:hover:border-r-[#912059] dark:hover:border-y-[#912059] dark:hover:bg-gradient-to-br dark:hover:from-[#240D1A] dark:hover:via-[#240D1A] dark:hover:to-[#9120595d] dark:hover:shadow-[0_0_15px_rgba(171,56,106,0.2)] dark:hover:scale-[1.02] sm:p-5">
                          <p className="text-md leading-relaxed text-gray-600 dark:text-slate-300">{item}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}

            </div>
          </div>


          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3 lg:gap-10">


          </div>
        </main>
      </div>
    </main>
  );
}
