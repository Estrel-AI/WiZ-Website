"use client";

import { GripVertical, RotateCcw, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  AdminButton,
  AdminCard,
  LoadingSkeleton,
  SectionHeader,
} from "@/src/components/admin/admin-ui";
import { useAdminToast } from "@/src/components/admin/admin-toast";
import { cn } from "@/src/lib/utils";
import type { ApiResponse, PageSectionRow } from "@/src/types/admin-api";

export type PageSectionMeta = {
  label: string;
  description?: string;
  manageHref?: string;
};

type PageSectionOrderEditorProps = {
  pageKey: string;
  pageLabel: string;
  pageDescription: string;
  defaultOrder: string[];
  sections: Record<string, PageSectionMeta>;
  liveHint?: string;
};

type OrderItem = {
  sectionKey: string;
  displayOrder: number;
};

function orderKey(items: OrderItem[]): string {
  return [...items]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((item) => item.sectionKey)
    .join("|");
}

export function PageSectionOrderEditor({
  pageKey,
  pageLabel,
  pageDescription,
  defaultOrder,
  sections,
  liveHint,
}: PageSectionOrderEditorProps) {
  const { showToast } = useAdminToast();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedOrderKey, setSavedOrderKey] = useState("");
  const dragRowKeyRef = useRef<string | null>(null);

  async function loadSections() {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/page-sections?pageKey=${pageKey}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as ApiResponse<PageSectionRow[]>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error || payload.message || "Failed to load section order.");
      }

      const list = payload.data;
      const nextItems =
        list.length > 0
          ? [...list]
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((row) => ({ sectionKey: row.sectionKey, displayOrder: row.displayOrder }))
          : defaultOrder.map((key, index) => ({ sectionKey: key, displayOrder: index + 1 }));

      setItems(nextItems);
      setSavedOrderKey(orderKey(nextItems));
    } catch (error) {
      showToast({
        tone: "error",
        title: "Load Error",
        description: error instanceof Error ? error.message : "Unable to fetch section order.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSections();
  }, []);

  const orderedItems = [...items].sort((a, b) => a.displayOrder - b.displayOrder);
  const hasChanges = orderKey(orderedItems) !== savedOrderKey;

  function handleDragStart(sectionKey: string) {
    dragRowKeyRef.current = sectionKey;
  }

  function handleDrop(targetKey: string) {
    const sourceKey = dragRowKeyRef.current;
    dragRowKeyRef.current = null;

    if (!sourceKey || sourceKey === targetKey) return;

    const ordered = [...orderedItems];
    const sourceIndex = ordered.findIndex((item) => item.sectionKey === sourceKey);
    const targetIndex = ordered.findIndex((item) => item.sectionKey === targetKey);

    if (sourceIndex < 0 || targetIndex < 0) return;

    const next = [...ordered];
    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);

    setItems(next.map((item, index) => ({ ...item, displayOrder: index + 1 })));
  }

  async function persistOrder(
    orderItems: OrderItem[],
    messages: {
      successTitle: string;
      successDescription: string;
      failureTitle: string;
    },
  ) {
    setSaving(true);
    try {
      const payloadItems = orderItems.map((item, index) => ({
        sectionKey: item.sectionKey,
        displayOrder: index + 1,
      }));

      const response = await fetch("/api/admin/page-sections/display-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey, items: payloadItems }),
      });

      const payload = (await response.json()) as ApiResponse<null>;
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Failed to save section order.");
      }

      setSavedOrderKey(orderKey(orderItems));
      showToast({
        tone: "success",
        title: messages.successTitle,
        description: messages.successDescription,
      });
      return true;
    } catch (error) {
      showToast({
        tone: "error",
        title: messages.failureTitle,
        description: error instanceof Error ? error.message : "Unable to save section order.",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    await persistOrder(orderedItems, {
      successTitle: "Order Saved",
      successDescription: `${pageLabel} updated successfully and now live on the website.`,
      failureTitle: "Save Failed",
    });
  }

  async function handleReset() {
    const resetItems = defaultOrder.map((key, index) => ({
      sectionKey: key,
      displayOrder: index + 1,
    }));
    setItems(resetItems);
    await persistOrder(resetItems, {
      successTitle: "Order Reset",
      successDescription: `${pageLabel} restored to the default order and saved.`,
      failureTitle: "Reset Failed",
    });
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={pageLabel}
        description={pageDescription}
        action={
          <div className="flex items-center gap-3">
            <AdminButton
              variant="secondary"
              onClick={() => void handleReset()}
              disabled={loading || saving}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Default
            </AdminButton>
            <AdminButton onClick={() => void handleSave()} disabled={saving || !hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </AdminButton>
          </div>
        }
      />

      <AdminCard className="p-4 md:p-6">
        {loading ? (
          <LoadingSkeleton rows={6} />
        ) : (
          <div className="space-y-3">
            <div className="hidden sm:grid grid-cols-[60px_1fr_auto] gap-3 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span>Order</span>
              <span>Section</span>
              <span>Manage</span>
            </div>

            {orderedItems.map((item, index) => {
              const meta = sections[item.sectionKey];
              return (
                <div
                  key={item.sectionKey}
                  draggable={!saving}
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    handleDragStart(item.sectionKey);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(item.sectionKey)}
                  className={cn(
                    "grid grid-cols-[40px_1fr_auto] sm:grid-cols-[60px_1fr_auto] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-3 sm:px-4 py-3",
                    "cursor-grab active:cursor-grabbing hover:border-[#98235f]/40 hover:bg-slate-50 transition-colors",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 cursor-grab text-slate-400 hover:text-slate-700" />
                    <span className="font-mono text-xs font-bold text-slate-600">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {meta?.label ?? item.sectionKey}
                    </div>
                    {meta?.description ? (
                      <div className="text-xs text-slate-500">{meta.description}</div>
                    ) : null}
                  </div>

                  <div className="justify-self-end">
                    {meta?.manageHref ? (
                      <a
                        href={meta.manageHref}
                        className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#98235f]"
                      >
                        Edit Content
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      {liveHint ? <p className="text-xs text-slate-500">{liveHint}</p> : null}
    </div>
  );
}