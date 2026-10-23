"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Home, Layers3, Mail, Tag } from "lucide-react";
import { useAdminCms } from "@/src/hooks/use-admin-cms";
import { AdminCard, InlineLoader, StatusPill } from "@/src/components/admin/admin-ui";

export default function AdminPage() {
  const { data, stats, loading } = useAdminCms();

  const metricCards = [
    { label: "Blog Posts", value: stats?.totalPosts ?? 0, note: `${stats?.publishedPosts ?? 0} published`, icon: BookOpen },
    { label: "Industries", value: stats?.totalIndustries ?? 0, note: `${stats?.totalFunctions ?? 0} functions`, icon: Layers3 },
    { label: "Pricing Plans", value: stats?.visiblePricingPlans ?? 0, note: "Visible on the pricing module", icon: Tag },
    { label: "Home Sections", value: data?.homePage.blocks.length ?? 0, note: "Visual CMS blocks", icon: Home },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#801b54] via-[#98235f] to-[#b32b70] px-6 py-9 shadow-[0_20px_60px_rgba(152,35,95,0.25)] sm:px-9 sm:py-11">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              <Mail className="h-3.5 w-3.5" />
              Admin Console
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">Welcome back</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
              A single control surface for content, structure, pricing, and your visual homepage editor.
            </p>
          </div>
          <Link
            href="/admin/home"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[12px] border border-white/30 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-white/50 hover:bg-white/20 active:scale-[0.98]"
          >
            Open Home Editor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {loading ? <InlineLoader label="Loading dashboard overview..." /> : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard
              key={card.label}
              className="group p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(152,35,95,0.12)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</div>
                  <div className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{card.value}</div>
                  <div className="mt-2 text-xs font-medium text-slate-500">{card.note}</div>
                </div>
                <div className="shrink-0 rounded-2xl border border-[#98235f]/15 bg-gradient-to-br from-[#98235f]/10 to-[#801b54]/5 p-3.5 text-[#98235f] shadow-xs transition-transform duration-200 group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Recent Blog Entries</h3>
              <p className="mt-1 text-sm text-slate-500">Quick visibility into the editorial queue.</p>
            </div>
            <Link href="/admin/blog" className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[#98235f] transition hover:text-[#801b54]">
              Manage
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {(data?.blogPosts ?? []).slice(0, 4).map((post) => (
              <div key={post.id} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200/70 bg-slate-50/40 p-4 transition hover:border-[#98235f]/20 hover:bg-white">
                <div className="flex min-w-0 items-start gap-3.5">
                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#98235f]/10 bg-gradient-to-br from-[#98235f]/10 to-[#801b54]/5 text-[#98235f] sm:flex">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-950">{post.title}</div>
                    <div className="mt-1 truncate font-mono text-xs text-slate-500">/{post.slug}</div>
                    {post.shortDescription ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{post.shortDescription}</p>
                    ) : null}
                  </div>
                </div>
                <StatusPill value={post.status} />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="mb-5 border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-bold text-slate-950">Structure Health</h3>
            <p className="mt-1 text-sm text-slate-500">Normalized content entities are kept separate for long-term scale.</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3.5 rounded-xl border border-slate-200/70 bg-slate-50/40 p-4 transition hover:border-slate-300 hover:bg-white">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#98235f]/10 bg-gradient-to-br from-[#98235f]/10 to-[#801b54]/5 text-[#98235f]">
                <Layers3 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-950">Industries</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-500">Top-level segments own their own SEO and publish state.</div>
              </div>
            </div>
            <div className="flex items-start gap-3.5 rounded-xl border border-slate-200/70 bg-slate-50/40 p-4 transition hover:border-slate-300 hover:bg-white">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#98235f]/10 bg-gradient-to-br from-[#98235f]/10 to-[#801b54]/5 text-[#98235f]">
                <Layers3 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-950">Functions</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-500">Each function belongs to one industry and keeps the use-case hierarchy clean.</div>
              </div>
            </div>
            <div className="flex items-start gap-3.5 rounded-xl border border-slate-200/70 bg-slate-50/40 p-4 transition hover:border-slate-300 hover:bg-white">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#98235f]/10 bg-gradient-to-br from-[#98235f]/10 to-[#801b54]/5 text-[#98235f]">
                <Layers3 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-950">Use Cases</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-500">Fixed detail sections make the detail page editor predictable and easy to render.</div>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}