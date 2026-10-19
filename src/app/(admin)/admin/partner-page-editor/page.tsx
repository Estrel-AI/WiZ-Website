"use client";

import {
  PageSectionOrderEditor,
  type PageSectionMeta,
} from "@/src/components/admin/page-section-order-editor";

const PAGE_KEY = "PARTNER";
const DEFAULT_ORDER = ["BANNER", "PATHWAY", "BENEFITS", "FORM", "FIND_PARTNER"];

const SECTIONS: Record<string, PageSectionMeta> = {
  BANNER: {
    label: "Partner Header",
    description: "Become a Partner hero, description, buttons, and banner image.",
    manageHref: "/admin/partner-header",
  },
  PATHWAY: {
    label: "Partnership Pathways",
    description: "Find Your Partnership Pathway cards and heading.",
    manageHref: "/admin/partner-pathways",
  },
  BENEFITS: {
    label: "Partner Benefits",
    description: "Grow Your Business with WiiZ Ecosystem benefit cards.",
    manageHref: "/admin/partner-benefits",
  },
  FORM: {
    label: "Partner Form",
    description: "Partner Program Application form with program selection.",
  },
  FIND_PARTNER: {
    label: "Find a Partner",
    description: "Find a Partner logos grid.",
  },
};

export default function AdminPartnerPageEditorPage() {
  return (
    <PageSectionOrderEditor
      pageKey={PAGE_KEY}
      pageLabel="Partner Page Section Order"
      pageDescription="Drag sections to reorder how they appear on the public Partner page, then save. The new order goes live after clicking Save Changes."
      defaultOrder={DEFAULT_ORDER}
      sections={SECTIONS}
      liveHint="Sections will render on the public Partner page in this order. Only sections listed here appear on the page."
    />
  );
}