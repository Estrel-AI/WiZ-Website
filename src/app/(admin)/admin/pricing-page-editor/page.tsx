"use client";

import {
  PageSectionOrderEditor,
  type PageSectionMeta,
} from "@/src/components/admin/page-section-order-editor";

const PAGE_KEY = "PRICING";
const DEFAULT_ORDER = ["PLANS", "ADDONS", "CTA"];

const SECTIONS: Record<string, PageSectionMeta> = {
  PLANS: {
    label: "Pricing Plans",
    description: "Product Plans & Pricing header, billing toggle, and plan cards.",
    manageHref: "/admin/pricing",
  },
  ADDONS: {
    label: "Add-On Packs",
    description: "Need More Power one-time run packs grid.",
  },
  CTA: {
    label: "CTA Banner",
    description: "Start Building Enterprise AI Agents Today call-to-action banner.",
  },
};

export default function AdminPricingPageEditorPage() {
  return (
    <PageSectionOrderEditor
      pageKey={PAGE_KEY}
      pageLabel="Pricing Page Section Order"
      pageDescription="Drag sections to reorder how they appear on the public Pricing page, then save. The new order goes live after clicking Save Changes."
      defaultOrder={DEFAULT_ORDER}
      sections={SECTIONS}
      liveHint="Sections will render on the public Pricing page in this order. Only sections listed here appear on the page."
    />
  );
}