"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ThemeToggle from "@/src/components/website/theme-toggle";
import type { ApiResponse, HierarchyRow, ListData } from "@/src/types/admin-api";

type IndustrySummary = Pick<HierarchyRow, "id" | "title" | "description">;
type IndustryDetailResponse = {
  industry: IndustrySummary;
  functions: Array<{
    id: number;
    title: string;
    description: string | null;
    useCases: Array<{
      id: number;
      title: string;
      description: string | null;
    }>;
  }>;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function FunctionSectionHeading({
  title,
  collapsed,
  onToggle,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-4 flex items-center gap-4 md:mb-6">
      <button
        type="button"
        aria-expanded={!collapsed}
        onClick={onToggle}
        className="flex shrink-0 items-center text-left md:pointer-events-none"
      >
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#d4ba6b] dark:md:text-white md:text-2xl">{title}</h2>
      </button>
      <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
      <button
        type="button"
        aria-label={`${collapsed ? "Expand" : "Collapse"} ${title}`}
        aria-expanded={!collapsed}
        onClick={onToggle}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#d63d75]/15 text-[#771c48] transition-colors hover:bg-[#d63d75]/25 dark:bg-[#d63d75]/20 dark:text-[#ff8fb8] dark:hover:bg-[#d63d75]/30 md:hidden"
      >
        <ChevronDown
          aria-hidden="true"
          className={cn("size-5 transition-transform duration-200", collapsed && "-rotate-90")}
        />
      </button>
    </div>
  );
}

export default function UseCasePage() {
  const [industries, setIndustries] = useState<IndustrySummary[]>([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState<number | null>(null);
  const [selectedIndustryDetail, setSelectedIndustryDetail] = useState<IndustryDetailResponse | null>(null);
  const [activeFunctionId, setActiveFunctionId] = useState<number | null>(null);
  const [collapsedFunctions, setCollapsedFunctions] = useState<Record<number, boolean>>({});
  const [industryLoading, setIndustryLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const industryScrollerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const controller = new AbortController();

    async function loadIndustries() {
      setIndustryLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/industries", { signal: controller.signal });
        const result = (await response.json()) as ApiResponse<ListData<HierarchyRow>>;

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || result.message || "Unable to load industries.");
        }

        const nextIndustries = result.data.result.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
        }));

        setIndustries(nextIndustries);
        setSelectedIndustryId((current) => current ?? nextIndustries[0]?.id ?? null);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "Unable to load industries.");
      } finally {
        setIndustryLoading(false);
      }
    }

    void loadIndustries();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedIndustryId) {
      setSelectedIndustryDetail(null);
      setActiveFunctionId(null);
      setCollapsedFunctions({});
      return;
    }

    const controller = new AbortController();

    async function loadIndustryDetail() {
      setDetailLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/industries/${selectedIndustryId}/functions-usecases`, {
          signal: controller.signal,
        });
        const result = (await response.json()) as ApiResponse<IndustryDetailResponse>;

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || result.message || "Unable to load industry details.");
        }

        setSelectedIndustryDetail(result.data);
        setActiveFunctionId(result.data.functions[0]?.id ?? null);
        setCollapsedFunctions(
          Object.fromEntries(result.data.functions.map((item, index) => [item.id, index !== 0])),
        );
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "Unable to load industry details.");
      } finally {
        setDetailLoading(false);
      }
    }

    void loadIndustryDetail();
    return () => controller.abort();
  }, [selectedIndustryId]);

  const selectedIndustryTitle = selectedIndustryDetail?.industry.title ?? industries.find((item) => item.id === selectedIndustryId)?.title ?? "Industries";

  const functionCountMap = useMemo(() => {
    const map = new Map<number, number>();
    selectedIndustryDetail?.functions.forEach((item) => map.set(item.id, item.useCases.length));
    return map;
  }, [selectedIndustryDetail]);

  function handleFunctionSelect(functionId: number) {
    setActiveFunctionId(functionId);
    setCollapsedFunctions((current) => ({
      ...current,
      [functionId]: false,
    }));
    sectionRefs.current[functionId]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleFunctionSection(functionId: number) {
    setCollapsedFunctions((current) => ({
      ...current,
      [functionId]: !current[functionId],
    }));
  }

  function scrollIndustries() {
    industryScrollerRef.current?.scrollBy({
      left: 220,
      behavior: "smooth",
    });
  }

  return (
    <main>
      <div className="min-h-screen bg-[#f5f6f8] font-sans text-gray-700 transition-colors duration-300 dark:bg-primary dark:text-slate-200">
        <section className="min-h-[30vh] relative mb-10 flex min-h-[48vh] items-center justify-center overflow-hidden border-b border-[#f0c8d8] bg-gradient-to-b from-[#f8fafc] via-[#f3f5f8] to-[#edf2f7] px-4 py-14 dark:border-white/10 dark:bg-gradient-to-b dark:from-[#08060a] dark:via-[#160d14] dark:to-[#240d1a] md:py-20">
          <div className="absolute inset-0 bg-primary dark:hidden" />
          <div className="absolute left-0 top-1/2 h-[100%] w-[240%] -translate-x-1/2 -translate-y-1/2 bg-[url('/texture.svg')] bg-cover bg-center opacity-45 mix-blend-screen pointer-events-none dark:opacity-100 dark:mix-blend-normal md:w-[160%] [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)]" />
          <div className="absolute right-0 top-1/2 h-[100%] w-[240%] translate-x-1/2 -translate-y-1/2 bg-[url('/texture.svg')] bg-cover bg-center opacity-45 mix-blend-screen pointer-events-none dark:opacity-100 dark:mix-blend-normal md:w-[160%] [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)]" />
          <div className="absolute -top-[230px] left-1/2 h-[520px] w-[620px] -translate-x-1/2 rounded-full bg-gradient-about blur-[180px] pointer-events-none dark:bg-gradient-about dark:blur-[200px]" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-[1.1] font-semibold text-white mb-3 md:mb-6 tracking-tight md:px-10 mx-auto">
              Pre-Built Enterprise AI Agents
            </h1>
            <p className="text-base md:text-lg text-[#FDFDFD] max-w-4xl mx-auto md:px-16">
              Explore industries, business functions, and practical AI use cases designed to turn high-value workflows
              into clear implementation paths.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-12 selection:bg-[#d63d75]/30 md:px-6 md:pb-16 lg:px-8 lg:pb-20">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-gray-200 pb-5 dark:border-white/10 md:mb-8">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
              <Link href="/" className="transition hover:text-gray-900 dark:hover:text-white">
                Home
              </Link>
              <span className="text-gray-300 dark:text-slate-600">/</span>
              <span className="font-medium text-gray-900 dark:text-white">AI Agents</span>
              <span className="text-gray-300 dark:text-slate-600">/</span>
              <span className="text-gray-600 dark:text-slate-300">{selectedIndustryTitle}</span>
            </nav>
            <ThemeToggle />
          </div>

          <div className="mb-8 w-full rounded-[2rem] border border-gray-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-gradient-to-br dark:from-[#20131c] dark:via-[#1a1118] dark:to-[#120c12] dark:shadow-[0_30px_80px_rgba(0,0,0,0.28)] lg:mb-10 lg:p-7">
            <div className="mb-0">
              <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                Explore Pre-Built Enterprise AI Agents by Industry
              </h2>
              <p className="mb-5 max-w-3xl text-sm leading-relaxed text-gray-500 dark:text-slate-400 md:text-base">
                Explore use cases by industries, business functions, and practical AI use cases designed to turn high-value workflows into clear implementation paths.
              </p>
              <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                Industries
                <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-white/10 md:hidden" />
              </h3>

              <div className="relative flex w-full items-center">
                <div
                  ref={industryScrollerRef}
                  className="no-scrollbar flex w-full snap-x snap-mandatory flex-nowrap items-center gap-2.5 overflow-x-auto scroll-smooth pb-3 pr-12 md:flex-wrap md:gap-3 md:overflow-visible md:pb-0 md:pr-0"
                >
                  {industryLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-10 w-40 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
                    ))
                  ) : industries.length ? (
                    industries.map((industry) => {
                      const isActive = industry.id === selectedIndustryId;
                      return (
                        <button
                          key={industry.id}
                          type="button"
                          onClick={() => setSelectedIndustryId(industry.id)}
                          className={cn(
                            "snap-start shrink-0 rounded-full border px-5 py-2.5 text-xs font-medium transition-all duration-300 md:text-sm",
                            isActive
                              ? "scale-[1.02] border-secondary/50 bg-gradient-to-r from-[#912059] to-[#d63d75] font-semibold text-white shadow-[0_14px_30px_rgba(214,61,117,0.3)]"
                              : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white",
                          )}
                        >
                          {industry.title}
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-full border border-dashed border-gray-300 px-5 py-2.5 text-sm text-gray-500 dark:border-white/10 dark:text-slate-400">
                      No industries available
                    </div>
                  )}
                </div>

                <div className="pointer-events-none absolute bottom-0 right-0 top-0 flex w-24 items-center justify-end bg-gradient-to-l from-white via-white/85 to-transparent pb-3 dark:from-[#171017] dark:via-[#171017]/85 md:hidden">
                  <button
                    type="button"
                    aria-label="Scroll industries"
                    onClick={scrollIndustries}
                    className="pointer-events-auto mr-1 rounded-full border border-white/20 bg-gradient-to-r from-[#912059] to-[#d63d75] p-1.5 shadow-[0_0_15px_rgba(214,61,117,0.45)] backdrop-blur-sm transition-transform active:scale-95"
                  >
                    <ChevronRight aria-hidden="true" className="h-4 w-4 translate-x-[1px] text-white" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mb-8 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            <aside className="hidden w-full shrink-0 self-start md:block lg:sticky lg:top-[120px] lg:w-64">
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-900 dark:text-white lg:mb-4">Functions</h3>
              <div className="mb-4 flex flex-row gap-2 overflow-x-auto pb-2 no-scrollbar lg:mb-8 lg:flex-col lg:overflow-visible lg:pb-0">
                {detailLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-12 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-white/5" />
                  ))
                ) : selectedIndustryDetail?.functions.length ? (
                  selectedIndustryDetail.functions.map((item) => {
                    const isActive = item.id === activeFunctionId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleFunctionSelect(item.id)}
                        className={cn(
                          "flex shrink-0 cursor-pointer items-center justify-between gap-3 rounded-2xl border p-3 text-left transition lg:shrink",
                          isActive
                            ? "border-secondary/30 bg-secondary/10 text-[#771c48] dark:bg-white/10 dark:text-secondary"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-white/15 dark:hover:bg-white/[0.06] dark:hover:text-white",
                        )}
                      >
                        <span className={cn("text-md whitespace-nowrap lg:whitespace-normal", isActive ? "font-semibold" : "font-medium")}>{item.title}</span>
                        <span className={cn(
                          "hidden rounded-full px-2 py-0.5 text-[11px] lg:inline-block",
                          isActive
                            ? "border border-secondary/30 bg-secondary/10 text-[#771c48] dark:text-secondary"
                            : "border border-gray-200 bg-gray-50 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400",
                        )}>
                          {functionCountMap.get(item.id) ?? 0}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 px-4 py-4 text-sm text-gray-500 dark:border-white/10 dark:text-slate-400">
                    No functions available.
                  </div>
                )}
              </div>
            </aside>

            <section className="flex-1 space-y-10 md:space-y-12">
              {detailLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-4">
                    <div className="h-7 w-60 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-5">
                      {Array.from({ length: 3 }).map((__, cardIndex) => (
                        <div key={cardIndex} className="h-52 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/5" />
                      ))}
                    </div>
                  </div>
                ))
              ) : selectedIndustryDetail?.functions.length ? (
                selectedIndustryDetail.functions.map((func) => (
                  <div
                    key={func.id}
                    ref={(node) => {
                      sectionRefs.current[func.id] = node;
                    }}
                  >
                    <FunctionSectionHeading
                      title={func.title}
                      collapsed={Boolean(collapsedFunctions[func.id])}
                      onToggle={() => toggleFunctionSection(func.id)}
                    />

                    <div className={collapsedFunctions[func.id] ? "hidden md:block" : "block"}>
                      {func.description ? (
                        <p className="mb-4 max-w-3xl text-md leading-relaxed text-gray-500 dark:text-slate-400 md:mb-6">
                          {func.description}
                        </p>
                      ) : null}

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-5">
                        {func.useCases.length ? (
                          func.useCases.map((useCase) => (
                            <div
                              key={useCase.id}
                              className="group flex h-full flex-col rounded-[1.75rem] border border-gray-200 bg-white p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-secondary/30 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-gradient-to-br dark:from-[#22131d] dark:via-[#1b1118] dark:to-[#160d14] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.26)] md:p-6"
                            >
                              <div className="mb-auto">
                                <span className="mb-3 inline-block rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-medium text-gray-600 transition-all group-hover:border-secondary/30 group-hover:bg-secondary/10 group-hover:text-[#771c48] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:group-hover:text-secondary md:mb-4 md:text-[11px]">
                                  {selectedIndustryDetail.industry.title}
                                </span>
                                <h3 className="mb-2 text-base font-bold text-gray-900 transition-colors group-hover:text-[#771c48] dark:text-white dark:group-hover:text-secondary md:text-lg">
                                  {useCase.title}
                                </h3>
                                <p className="mb-4 text-md leading-relaxed text-gray-500 dark:text-slate-400">
                                  {useCase.description || "Use case detail is available from the admin-driven content model."}
                                </p>
                              </div>
                              <Link
                                href={{
                                  pathname: "/ai-agents/usecasedetail",
                                  query: {
                                    useCaseId: String(useCase.id),
                                    industryTitle: selectedIndustryDetail.industry.title,
                                    functionTitle: func.title,
                                  },
                                }}
                                className="mt-2 flex items-center cursor-pointer text-md font-medium text-gray-900 transition-colors group-hover:text-[#771c48] dark:text-white dark:group-hover:text-secondary"
                              >
                                Explore AI Agents
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 ps-1 transition-colors md:h-5 md:w-5">
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                            No use cases available under this function yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                  No functions or use cases are available for this industry yet.
                </div>
              )}

            </section>
          </div>

          <section className="relative mt-10 overflow-hidden rounded-[2rem] border border-gray-200 bg-primary p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-gradient-to-r dark:from-[#1b1218] dark:via-[#28151f] dark:to-[#391525] dark:shadow-[0_30px_90px_rgba(0,0,0,0.32)] md:p-8 lg:mt-12 lg:p-10">
            <div className="absolute left-0 top-1/2 hidden h-[100%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[url('/texture.svg')] bg-cover bg-center opacity-40 pointer-events-none md:block [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)]" />
            <div className="absolute right-0 top-1/2 hidden h-[100%] w-[120%] translate-x-1/2 -translate-y-1/2 bg-[url('/texture.svg')] bg-cover bg-center opacity-40 pointer-events-none md:block [-webkit-mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_55%)]" />
            <div className="absolute -top-24 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-[#b94b83]/25 blur-[140px] pointer-events-none" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">
                  Next Step
                </span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white dark:text-white md:text-3xl">
                 Planning Agentic AI Rollout for your Organization
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white dark:text-slate-300 md:text-base">
                  Explore use cases by industries, business functions, and
                  practical AI use cases designed to turn high-value workflows
                  into clear implementation paths.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-center">
                <Link
                  href="/contact"
                  className="inline-flex min-w-[190px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#771c48] transition-transform duration-300 hover:scale-[1.02]"
                >
                  Talk to our team
                </Link>
                <Link
                  href="/partner"
                  className="inline-flex min-w-[190px] items-center justify-center rounded-full border border-[#771c48]/20 bg-white/60 px-6 py-3 text-sm font-semibold text-[#771c48] transition-colors duration-300 hover:bg-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Become a partner
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
