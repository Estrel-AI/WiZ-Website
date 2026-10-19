"use client";

import {
  Check,
  Cookie,
  FileText,
  Eye,
  RotateCcw,
  Save,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  LoadingSkeleton,
  Modal,
  SectionHeader,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { renderPolicyContent } from "@/src/components/website/policy-content";
import { cn } from "@/src/lib/utils";
import type { ApiResponse, LegalPolicyRow } from "@/src/types/admin-api";

const POLICIES_CONFIG = [
  { key: "privacy", label: "Privacy Policy", icon: Shield, defaultTitle: "Privacy Policy" },
  { key: "cookies", label: "Cookie Policy", icon: Cookie, defaultTitle: "Cookie Policy" },
  { key: "terms", label: "Terms & Conditions", icon: FileText, defaultTitle: "Terms and Conditions" },
];

export default function AdminLegalPoliciesPage() {
  const { showToast } = useAdminToast();
  const [activeTab, setActiveTab] = useState<string>("privacy");
  const [policies, setPolicies] = useState<Record<string, LegalPolicyRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Active policy form state
  const [title, setTitle] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/legal-policies", { cache: "no-store" });
      const payload = (await response.json()) as ApiResponse<LegalPolicyRow[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to load legal policies.");
      }

      const map: Record<string, LegalPolicyRow> = {};
      for (const item of payload.data) {
        map[item.policyKey] = item;
      }
      setPolicies(map);

      // Initialize current tab
      const current = map[activeTab];
      if (current) {
        setTitle(current.title);
        setLastUpdated(current.lastUpdated || "14 May 2026");
        setContent(current.content);
      }
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Unable to fetch legal policies.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function switchTab(key: string) {
    setActiveTab(key);
    const existing = policies[key];
    if (existing) {
      setTitle(existing.title);
      setLastUpdated(existing.lastUpdated || "14 May 2026");
      setContent(existing.content);
    } else {
      const config = POLICIES_CONFIG.find((p) => p.key === key);
      setTitle(config ? config.defaultTitle : "");
      setLastUpdated("14 May 2026");
      setContent("");
    }
    setErrors({});
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!content.trim()) nextErrors.content = "Policy content cannot be empty.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/legal-policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyKey: activeTab,
          title: title.trim(),
          lastUpdated: lastUpdated.trim(),
          content,
        }),
      });

      const payload = (await response.json()) as ApiResponse<LegalPolicyRow>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to save legal policy.");
      }

      showToast({
        tone: "success",
        title: "Policy Saved",
        description: `${payload.data.title} updated successfully.`,
      });

      const savedData = payload.data;
      setPolicies((prev) => ({
        ...prev,
        [activeTab]: savedData,
      }));
    } catch (error) {
      showToast({
        tone: "error",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Unable to save policy.",
      });
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    const existing = policies[activeTab];
    if (existing) {
      setTitle(existing.title);
      setLastUpdated(existing.lastUpdated || "14 May 2026");
      setContent(existing.content);
    }
    setErrors({});
  }

  if (loading) return <LoadingSkeleton rows={8} />;

  const activeConfig = POLICIES_CONFIG.find((p) => p.key === activeTab);
  const ActiveIcon = activeConfig?.icon || FileText;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Legal Policies Management"
        description="Manage dynamic content for Privacy Policy, Cookie Policy, and Terms & Conditions displayed in the website modal popups."
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {POLICIES_CONFIG.map((p) => {
          const Icon = p.icon;
          const isActive = activeTab === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => switchTab(p.key)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition cursor-pointer",
                isActive
                  ? "bg-[#98235f] text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Card */}
      <AdminCard className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C0D17] text-white shadow-xs">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{activeConfig?.label}</h2>
              <p className="text-xs text-slate-500">Key: <code className="font-mono text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded">{activeTab}</code></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AdminButton variant="secondary" onClick={() => setPreviewOpen(true)} className="text-xs">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Live Preview
            </AdminButton>
            <AdminButton variant="secondary" onClick={handleReset} disabled={saving} className="text-xs">
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving} className="text-xs">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Policy"}
            </AdminButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput
            label="Policy Display Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            placeholder="e.g. Privacy Policy"
          />

          <AdminInput
            label="Last Updated Date String"
            value={lastUpdated}
            onChange={(e) => setLastUpdated(e.target.value)}
            placeholder="e.g. 14 May 2026"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Policy Body Content *
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {content.length.toLocaleString()} characters | {content.split("\n\n").length} paragraphs
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            placeholder="Enter policy terms, sections, and paragraphs..."
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs font-mono text-slate-900 shadow-2xs focus:border-[#98235f] focus:outline-none focus:ring-2 focus:ring-[#98235f]/20 leading-relaxed",
              errors.content && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            )}
          />
          {errors.content ? <p className="text-xs text-rose-500 mt-1">{errors.content}</p> : null}
        </div>
      </AdminCard>

      {/* Live Preview Modal */}
      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={`Live Preview: ${title || activeConfig?.label}`}
        description="This is exactly how users will view this policy in the website modal popup."
        size="xl"
        footer={
          <AdminButton onClick={() => setPreviewOpen(false)}>
            <Check className="mr-1.5 h-4 w-4" />
            Close Preview
          </AdminButton>
        }
      >
        <div className="rounded-2xl border border-white/10 bg-[#0F1115] p-6 text-white max-h-[65vh] overflow-y-auto font-sans leading-relaxed">
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          {lastUpdated ? <p className="text-xs text-gray-400 mb-6 font-mono">Last Updated: {lastUpdated}</p> : null}
          <div className="space-y-4 text-sm text-gray-300">
            {renderPolicyContent(content)}
          </div>
        </div>
      </Modal>
    </div>
  );
}
