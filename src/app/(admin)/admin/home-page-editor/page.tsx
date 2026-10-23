"use client";

import {
  PageSectionOrderEditor,
  type PageSectionMeta,
} from "@/src/components/admin/page-section-order-editor";

const PAGE_KEY = "HOME";
const DEFAULT_ORDER = [
  "HERO",
  "TRUSTED_BY",
  "FEATURES",
  "USE_CASES",
  "AI_ADOPTION",
  "OPERATIONALIZE",
  "TESTIMONIALS",
  "FAQS",
  "CTA",
];

const SECTIONS: Record<string, PageSectionMeta> = {
  HERO: {
    label: "Hero",
    description: "Headline, subheading, buttons, and the hero background media.",
    manageHref: "/admin/home",
  },
  TRUSTED_BY: {
    label: "Trusted By",
    description: "Logo strip of trusted companies.",
    manageHref: "/admin/trusted-by",
  },
  FEATURES: {
    label: "Features",
    description: "Features tabs and media with heading and description.",
    manageHref: "/admin/features",
  },
  USE_CASES: {
    label: "Use Cases",
    description: "Leaderboard of WiiZ built AI agents and the compliance preview.",
    manageHref: "/admin/home-use-cases",
  },
  AI_ADOPTION: {
    label: "AI Adoption Cards",
    description: "Accelerating Enterprise AI Adoption audience cards.",
    manageHref: "/admin/home-ai-adoption",
  },
  OPERATIONALIZE: {
    label: "Operationalize CTA",
    description: "Operationalize Enterprise AI banner with certificate badges.",
  },
  TESTIMONIALS: {
    label: "Testimonials",
    description: "What our builders say carousel and testimonials.",
    manageHref: "/admin/testimonials",
  },
  FAQS: {
    label: "FAQs",
    description: "Frequently asked questions accordion.",
    manageHref: "/admin/faqs",
  },
  CTA: {
    label: "Final CTA",
    description: "Start Building Enterprise AI Agents Today banner.",
  },
};

export default function AdminHomePageEditorPage() {
  return (
    <PageSectionOrderEditor
      pageKey={PAGE_KEY}
      pageLabel="Home Page Section Order"
      pageDescription="Drag sections to reorder how they appear on the public Home page, then save. The new order goes live after clicking Save Changes."
      defaultOrder={DEFAULT_ORDER}
      sections={SECTIONS}
      liveHint="Sections will render on the public Home page in this order. Only sections listed here appear on the page."
    />
  );
}