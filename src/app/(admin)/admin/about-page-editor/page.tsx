"use client";

import {
  PageSectionOrderEditor,
  type PageSectionMeta,
} from "@/src/components/admin/page-section-order-editor";

const PAGE_KEY = "ABOUT";
const DEFAULT_ORDER = ["VISION", "MISSIONS", "LEADERSHIP", "PRODUCT"];

const SECTIONS: Record<string, PageSectionMeta> = {
  VISION: {
    label: "Vision Header",
    description: "Hero heading, quote, section image, and background image.",
    manageHref: "/admin/our-vision-header",
  },
  MISSIONS: {
    label: "Our Missions",
    description: "Mission points and vision image, displayed beside each other.",
    manageHref: "/admin/our-missions",
  },
  LEADERSHIP: {
    label: "Leadership Team",
    description: "Leadership team member photos, designations, and LinkedIn profiles.",
    manageHref: "/admin/leadership-team",
  },
  PRODUCT: {
    label: "Key Product Team",
    description: "Key product team member photos and designations.",
    manageHref: "/admin/key-product-team",
  },
};

export default function AdminAboutPageEditorPage() {
  return (
    <PageSectionOrderEditor
      pageKey={PAGE_KEY}
      pageLabel="About Page Section Order"
      pageDescription="Drag sections to reorder how they appear on the public About page, then save. The new order goes live after clicking Save Changes."
      defaultOrder={DEFAULT_ORDER}
      sections={SECTIONS}
      liveHint="Sections will render on the public About page in this order. Only sections listed here appear on the page."
    />
  );
}