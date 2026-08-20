"use client";

import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AdminCard,
  AdminButton,
  EmptyState,
  AdminInput,
  AdminSelect,
  AdminTableToolbar,
  AdminTextarea,
  ConfirmDialog,
  InlineLoader,
  LoadingSkeleton,
  Modal,
  SearchField,
  SectionHeader,
  StatusPill,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import type { ApiResponse, ListData, PlanRow } from "@/src/types/admin-api";

type PlanListFilter = "all" | "visible" | "hidden";

type PlanForm = {
  id: number;
  planCode: string;
  shortDescription: string;
  show: boolean;
};

type PlanListFields = {
  highlightedFeatures: string[];
  features: string[];
};

function emptyForm(): PlanForm {
  return {
    id: 0,
    planCode: "",
    shortDescription: "",
    show: true,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function renderFeatureMarkup(value: string, emptyMessage: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : `<ul><li>${emptyMessage}</li></ul>`;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function listToHtml(items: string[]) {
  const filteredItems = items.map((item) => item.trim()).filter(Boolean);
  if (!filteredItems.length) {
    return "";
  }

  return `<ul>${filteredItems.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function extractFeatureItems(value: string, emptyMessage: string) {
  const source = renderFeatureMarkup(value, emptyMessage);
  const liMatches = Array.from(source.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((match) =>
      decodeHtmlEntities(match[1])
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);

  if (liMatches.length) {
    return liMatches;
  }

  const normalized = decodeHtmlEntities(source)
    .replace(/<\/(p|div|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return normalized.length ? normalized : [emptyMessage];
}

function htmlToList(value: string) {
  const items = extractFeatureItems(value, "").filter(Boolean);
  return items.length ? items : [""];
}

function PlanListEditor({
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

function PlanFeatureCard({
  plan,
  onEdit,
  onToggleVisibility,
  onDelete,
}: {
  plan: PlanRow;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#2a0f1f_0%,#341126_100%)] p-6 shadow-[0_24px_60px_rgba(20,6,16,0.45)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-white">{plan.planCode || "Custom Plan"}</h3>
          {plan.shortDescription ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/72">{plan.shortDescription}</p>
          ) : null}
          <p className="mt-1 text-xs tracking-wide text-white/45">Updated {formatDate(plan.updatedAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill value={plan.show ? "visible" : "hidden"} />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/12 bg-white/8 text-white/75 transition hover:border-white/20 hover:bg-white/12 hover:text-white"
            onClick={onToggleVisibility}
            aria-label={plan.show ? "Hide plan" : "Show plan"}
            title={plan.show ? "Hide" : "Show"}
          >
            {plan.show ? <EyeOff className="h-4 w-4 stroke-[1.9]" /> : <Eye className="h-4 w-4 stroke-[1.9]" />}
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/12 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
            onClick={onEdit}
            aria-label="Edit plan"
            title="Edit"
          >
            <Pencil className="h-4 w-4 stroke-[1.9]" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-rose-200 bg-white text-rose-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
            onClick={onDelete}
            aria-label="Delete plan"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 stroke-[1.9]" />
          </button>
        </div>
      </div>

      <div className="pricing-highlighted-preview mb-5">
        {extractFeatureItems(
          plan.highlightedFeatures ?? "",
          "Highlighted features are not available for this plan.",
        ).map((item, index) => (
          <div key={`highlight-${plan.id}-${index}`} className="pricing-highlighted-item">
            {item}
          </div>
        ))}
      </div>

      <div className="mb-4 h-px w-full bg-white/12" />
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white/70">Features</p>
      <div className="pricing-feature-preview flex-1">
        {extractFeatureItems(
          plan.features ?? "",
          "Standard features are not available for this plan.",
        ).map((item, index) => (
          <div key={`feature-${plan.id}-${index}`} className="pricing-feature-item">
            {item}
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-white/75">
          {plan.planCode || "Custom"}
        </span>
        <span className="text-[11px] text-white/40">Admin pricing card</span>
      </div>
    </div>
  );
}

export default function AdminPricingPage() {
  const { showToast } = useAdminToast();
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PlanListFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<PlanForm>(emptyForm());
  const [planListFields, setPlanListFields] = useState<PlanListFields>({
    highlightedFeatures: [""],
    features: [""],
  });
  const requestRef = useRef<AbortController | null>(null);

  const loadPlans = useCallback(async (query: string, nextFilter: PlanListFilter) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/plans/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({
          search: query.trim(),
          hide: nextFilter === "all" ? null : nextFilter === "hidden",
        }),
      });

      const payload = (await response.json()) as ApiResponse<ListData<PlanRow>>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Unable to load plans.");
      }

      setRows(payload.data.result);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      showToast({
        tone: "error",
        title: "Unable to load plans",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [showToast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadPlans(search, filter);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [filter, loadPlans, search]);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  function openCreate() {
    setForm(emptyForm());
    setPlanListFields({
      highlightedFeatures: [""],
      features: [""],
    });
    setModalOpen(true);
  }

  function openEdit(plan: PlanRow) {
    setForm({
      id: plan.id,
      planCode: plan.planCode ?? "",
      shortDescription: plan.shortDescription ?? "",
      show: plan.show,
    });
    setPlanListFields({
      highlightedFeatures: htmlToList(plan.highlightedFeatures ?? ""),
      features: htmlToList(plan.features ?? ""),
    });
    setModalOpen(true);
  }

  function updateListForm(key: keyof PlanListFields, items: string[]) {
    setPlanListFields((current) => ({
      ...current,
      [key]: items,
    }));
  }

  async function handleSave() {
    const planCode = form.planCode.trim();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/plans/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: form.id,
          planCode: planCode || null,
          shortDescription: form.shortDescription.trim() || null,
          highlightedFeatures: listToHtml(planListFields.highlightedFeatures) || null,
          features: listToHtml(planListFields.features) || null,
          show: form.show,
        }),
      });

      const payload = (await response.json()) as ApiResponse<{ id: number; action: "created" | "updated" }>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Unable to save plan.");
      }

      setModalOpen(false);
      setForm(emptyForm());
      setPlanListFields({
        highlightedFeatures: [""],
        features: [""],
      });
      showToast({
        tone: "success",
        title: form.id > 0 ? "Plan updated" : "Plan created",
        description: payload.message,
      });
      await loadPlans(search, filter);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Unable to save plan",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleVisibility(plan: PlanRow) {
    try {
      const response = await fetch(`/api/admin/plans/${plan.id}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ show: !plan.show }),
      });

      const payload = (await response.json()) as ApiResponse<{ id: number; show: boolean }>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Unable to update plan visibility.");
      }

      setRows((current) =>
        current.map((item) => (item.id === plan.id ? { ...item, show: !plan.show } : item)),
      );
      showToast({
        tone: "success",
        title: !plan.show ? "Plan shown" : "Plan hidden",
        description: payload.message,
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Unable to update visibility",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  async function handleDelete() {
    if (!deleteId) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/plans/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const payload = (await response.json()) as ApiResponse<{ deletedId: number }>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Unable to delete plan.");
      }

      setDeleteId(null);
      setRows((current) => current.filter((item) => item.id !== deleteId));
      showToast({
        tone: "success",
        title: "Plan deleted",
        description: payload.message,
      });
    } catch (error) {
      showToast({
        tone: "error",
        title: "Unable to delete plan",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="Pricing" description="" />

      <AdminCard className="overflow-hidden rounded-[10px] border border-slate-200/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <AdminTableToolbar
          search={
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="min-w-0 flex-1">
                <SearchField value={search} onChange={setSearch} placeholder="Search plan code or feature content" />
              </div>
              <div className="sm:w-44">
                <AdminSelect label="" value={filter} onChange={(event) => setFilter(event.target.value as PlanListFilter)} className="h-11 py-0">
                  <option value="all">All Plans</option>
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </AdminSelect>
              </div>
            </div>
          }
          primaryAction={
            <AdminButton onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Plan
            </AdminButton>
          }
          secondaryActions={loading ? <InlineLoader label="Refreshing plans..." /> : null}
        />

        {loading ? <LoadingSkeleton rows={6} /> : null}

        {!loading && rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No plans found"
              description="Create your first plan or adjust the current search and visibility filter."
            />
          </div>
        ) : null}

        {!loading && rows.length > 0 ? (
          <div className="grid gap-6 p-6 xl:grid-cols-2">
            {rows.map((plan) => (
              <PlanFeatureCard
                key={plan.id}
                plan={plan}
                onEdit={() => openEdit(plan)}
                onToggleVisibility={() => {
                  void handleToggleVisibility(plan);
                }}
                onDelete={() => setDeleteId(plan.id)}
              />
            ))}
          </div>
        ) : null}
      </AdminCard>

      <Modal
        open={modalOpen}
        onClose={() => {
          if (saving) {
            return;
          }
          setModalOpen(false);
        }}
        title={form.id > 0 ? "Edit Plan" : "Add Plan"}
        description="Use database-backed pricing plans so the admin portal and frontend stay in sync."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving..." : form.id > 0 ? "Save Changes" : "Save Plan"}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
            <AdminInput
              label="Plan Code"
              value={form.planCode}
              onChange={(event) => setForm((current) => ({ ...current, planCode: event.target.value }))}
              placeholder="starter_monthly"
            />
            <label className="flex items-center justify-between rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <div className="text-sm font-medium text-slate-900">Show Plan</div>
                <div className="mt-1 text-xs text-slate-500">Turn this off to hide the plan from display lists.</div>
              </div>
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, show: !current.show }))}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${form.show ? "bg-slate-950" : "bg-slate-300"}`}
                aria-pressed={form.show}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white transition ${form.show ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </label>
          </div>

          <AdminTextarea
            label="Short Description"
            value={form.shortDescription}
            onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))}
            placeholder="Brief summary shown on the pricing card."
            className="min-h-[110px]"
          />

          <PlanListEditor
            label="Highlighted Features"
            emptyLabel="Highlighted Feature"
            items={planListFields.highlightedFeatures}
            onChange={(items) => updateListForm("highlightedFeatures", items)}
          />

          <PlanListEditor
            label="Features"
            emptyLabel="Feature"
            items={planListFields.features}
            onChange={(items) => updateListForm("features", items)}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
        title="Delete plan?"
        description="This will soft delete the plan and remove it from the active pricing list."
        confirmLabel="Delete"
      />

      <style jsx global>{`
        .pricing-highlighted-preview {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .pricing-highlighted-item {
          position: relative;
          padding-left: 1.55rem;
          color: #f3cb63;
          font-size: 0.98rem;
          font-weight: 500;
          line-height: 1.45;
        }

        .pricing-highlighted-item::before {
          content: "⚡";
          position: absolute;
          left: 0;
          top: 0.02rem;
          color: #f3cb63;
          font-size: 0.92rem;
        }

        .pricing-feature-preview {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .pricing-feature-item {
          position: relative;
          padding-left: 1.9rem;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.98rem;
          line-height: 1.45;
        }

        .pricing-feature-item::before {
          content: "";
          position: absolute;
          left: 0.22rem;
          top: 0.48rem;
          width: 0.5rem;
          height: 0.28rem;
          border-left: 2px solid #39e58f;
          border-bottom: 2px solid #39e58f;
          transform: rotate(-45deg);
        }
      `}</style>
    </div>
  );
}
