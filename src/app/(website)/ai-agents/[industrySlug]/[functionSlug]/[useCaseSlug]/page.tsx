import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readAdminCmsData } from "@/src/lib/admin-cms";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industrySlug: string; functionSlug: string; useCaseSlug: string }>;
}): Promise<Metadata> {
  const { industrySlug, functionSlug, useCaseSlug } = await params;
  const data = await readAdminCmsData();
  const industry = data.industries.find((item) => item.slug === industrySlug);
  const func = data.functions.find((item) => item.slug === functionSlug && item.industryId === industry?.id);
  const useCase = data.useCases.find((item) => item.slug === useCaseSlug && item.functionId === func?.id);

  if (!industry || !func || !useCase) {
    return {
      title: "Use Case Not Found",
    };
  }

  return buildWebsiteMetadata({
    title: useCase.bannerTitle || useCase.title,
    description: useCase.summary || useCase.seo.metaDescription,
    path: `/ai-agents/${industrySlug}/${functionSlug}/${useCaseSlug}`,
    image: useCase.heroImage ? { url: useCase.heroImage } : websiteOgImages.usecase,
  });
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ industrySlug: string; functionSlug: string; useCaseSlug: string }>;
}) {
  const { industrySlug, functionSlug, useCaseSlug } = await params;
  const data = await readAdminCmsData();
  const industry = data.industries.find((item) => item.slug === industrySlug);
  const func = data.functions.find((item) => item.slug === functionSlug && item.industryId === industry?.id);
  const useCase = data.useCases.find((item) => item.slug === useCaseSlug && item.functionId === func?.id);

  if (!industry || !func || !useCase) {
    notFound();
  }

  return (
    <main className="bg-white text-gray-900 dark:bg-primary dark:text-slate-300 transition-colors duration-300">
      <main className="container mx-auto min-h-screen text-gray-600 dark:text-slate-300 font-sans p-4 sm:p-6 lg:p-10 selection:bg-[#d63d75]/30">
        <div className="flex justify-between items-center mb-6">
          <nav className="text-xs sm:text-sm flex flex-wrap items-center gap-2">
            <Link href="/ai-agents" className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition">Use Cases</Link>
            <span className="text-gray-300 dark:text-[#ffffff]">/</span>
            <span className="text-gray-500 dark:text-slate-400">{func.name}</span>
            <span className="text-gray-300 dark:text-[#ffffff]">/</span>
            <span className="text-gray-900 dark:text-white font-medium">Use Case</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-between items-start mb-10 lg:mb-16">
          <div className="max-w-3xl w-full">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 dark:bg-[#d63d75]/10 border border-secondary/20 dark:border-[#d63d75]/30 text-secondary dark:text-[#ff8fb8] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4">{func.name}</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{useCase.bannerTitle}</h1>
            <p className="text-base sm:text-lg text-gray-500 dark:text-slate-400 leading-relaxed"><span className="text-gray-900 dark:text-white font-medium">USE CASE - </span>{useCase.title}</p>
          </div>

          <div className="w-full md:w-auto xl:w-72 bg-gradient-to-br from-[#d63d75] to-[#fac534] p-[1px] rounded-3xl shrink-0 shadow-sm dark:shadow-[0_0_30px_rgba(214,61,117,0.2)]">
            <div className="bg-white dark:bg-[#1c1222] rounded-[23px] px-6 py-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
              <span className="text-[10px] sm:text-xs text-secondary dark:text-[#ff8fb8] font-bold uppercase tracking-widest mb-1">{useCase.impact.label}</span>
              <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">{useCase.impact.value}</div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 max-w-[200px]">{useCase.impact.description}</p>
            </div>
          </div>
        </div>

        <section className="mb-10 lg:mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight shrink-0">{useCase.challenges.title}</h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-[#3a2640]"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {useCase.challenges.items.map((item, index) => (
              <div key={item} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6 dark:border-[#3a2640] dark:bg-[#1c1222]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-black dark:border-[#3a2640] dark:bg-[#2a1b33] dark:text-secondary">{index + 1}</div>
                <p className="text-md text-gray-600 dark:text-slate-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 lg:mb-16">
          <div className="relative h-[260px] overflow-hidden rounded-2xl bg-slate-100">
            <Image src={useCase.heroImage} alt={useCase.title} fill className="object-cover" />
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-10">
          <section className="xl:col-span-1 space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight shrink-0">{useCase.artefacts.title}</h2>
              <div className="h-px flex-1 bg-gray-200 dark:bg-[#3a2640]"></div>
            </div>
            {useCase.artefacts.items.map((item) => (
              <div key={item} className="rounded-r-xl border-y border-r border-gray-200 border-l-4 border-l-secondary bg-gray-50 p-4 sm:p-5 dark:border-y-[#3a2640] dark:border-r-[#3a2640] dark:bg-[#1c1222]">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">{item}</h4>
                <p className="text-md text-gray-500 dark:text-slate-400 leading-relaxed">Editable from the admin use-case detail editor.</p>
              </div>
            ))}
          </section>

          <section className="xl:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight shrink-0">{useCase.outcomes.title}</h2>
              <div className="h-px flex-1 bg-gray-200 dark:bg-[#3a2640]"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {useCase.outcomes.items.map((item) => (
                <div key={item} className="p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-[#3a2640] bg-gray-50 dark:bg-[#FFFFFF0D]">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Outcome</h3>
                  <p className="text-md text-gray-600 dark:text-slate-300">{item}</p>
                </div>
              ))}
              {useCase.detail.items.map((item) => (
                <div key={item} className="p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-[#3a2640] bg-gray-50 dark:bg-[#FFFFFF0D]">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Detail</h3>
                  <p className="text-md text-gray-600 dark:text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </main>
  );
}
