"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Home, Layers3, Tag } from "lucide-react";
import { useAdminCms } from "@/src/hooks/use-admin-cms";
import { AdminCard, AdminButton, InlineLoader, SectionHeader, StatusPill } from "@/src/components/admin/admin-ui";

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
      <SectionHeader
        title="Dashboard"
        description="A single control surface for content, structure, pricing, and your visual homepage editor."
        action={
          <Link href="/admin/home">
            <AdminButton>
              Open Home Editor
              <ArrowRight className="ml-2 h-4 w-4" />
            </AdminButton>
          </Link>
        }
      />

      {loading ? <InlineLoader label="Loading dashboard overview..." /> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard key={card.label} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-500">{card.label}</div>
                  <div className="mt-3 text-4xl font-semibold text-slate-950">{card.value}</div>
                  <div className="mt-2 text-sm text-slate-500">{card.note}</div>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Recent Blog Entries</h3>
              <p className="mt-1 text-sm text-slate-500">Quick visibility into the editorial queue.</p>
            </div>
            <Link href="/admin/blog" className="text-sm font-medium text-slate-950">
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            {(data?.blogPosts ?? []).slice(0, 4).map((post) => (
              <div key={post.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-slate-950">{post.title}</div>
                    <div className="mt-1 text-sm text-slate-500">/{post.slug}</div>
                  </div>
                  <StatusPill value={post.status} />
                </div>
                <p className="mt-3 text-sm text-slate-600">{post.shortDescription}</p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-950">Structure Health</h3>
            <p className="mt-1 text-sm text-slate-500">Normalized content entities are kept separate for long-term scale.</p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-950">Industries</div>
              <div className="mt-1 text-sm text-slate-500">Top-level segments own their own SEO and publish state.</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-950">Functions</div>
              <div className="mt-1 text-sm text-slate-500">Each function belongs to one industry and keeps the use-case hierarchy clean.</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-950">Use Cases</div>
              <div className="mt-1 text-sm text-slate-500">Fixed detail sections make the detail page editor predictable and easy to render.</div>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
