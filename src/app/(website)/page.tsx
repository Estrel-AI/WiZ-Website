import type { Metadata } from "next";
import HomePage from "../../components/website/home-page";
import { fetchPublicHomeFeatures } from "@/src/lib/website-home-features";
import { fetchPublicHomeFeatureHeader } from "@/src/lib/website-home-feature-header";
import { fetchPublicHomeUseCaseCards } from "@/src/lib/website-home-use-case-cards";
import { fetchPublicHomeUseCaseHeader } from "@/src/lib/website-home-use-case-header";
import { fetchPublicHomeTestimonials } from "@/src/lib/website-home-testimonials";
import { getWebsiteHomeFaqs } from "@/src/lib/website-home-faqs";
import { fetchPublicSectionHeader } from "@/src/lib/website-section-headers";
import { readWebsiteCmsData } from "@/src/lib/website-cms";
import { fetchPublicHeroSection } from "@/src/lib/website-hero";
import { getWebsitePageSectionKeys } from "@/src/lib/website-page-sections";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

import { fetchPublicHomeAiAdoptionCards } from "@/src/lib/website-home-ai-adoption";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildWebsiteMetadata({
  title: { absolute: "WiiZ | The Operating System for Enterprise Agentic AI" },
  description: "Accelerate AI adoption with WiiZ. Design, deploy, monitor, and govern AI agents from a unified platform with enterprise-grade security, observability, guardrails, and Agentic workflow orchestration.",
  path: "/",
  image: websiteOgImages.home,
});

export default async function WebsiteHomePage() {
  const [
    data,
    heroSection,
    homeFeatures,
    homeFeatureHeader,
    homeUseCases,
    homeUseCaseHeader,
    homeTestimonialHeader,
    homeTestimonials,
    homeFaqHeader,
    homeFaqs,
    homeAiAdoptionHeader,
    homeAiAdoptionCards,
    sectionOrder,
  ] = await Promise.all([
    readWebsiteCmsData(),
    fetchPublicHeroSection().catch(() => null),
    fetchPublicHomeFeatures().catch(() => []),
    fetchPublicHomeFeatureHeader().catch(() => null),
    fetchPublicHomeUseCaseCards().catch(() => []),
    fetchPublicHomeUseCaseHeader().catch(() => null),
    fetchPublicSectionHeader("TESTIMONIAL").catch(() => null),
    fetchPublicHomeTestimonials().catch(() => []),
    fetchPublicSectionHeader("FAQ").catch(() => null),
    getWebsiteHomeFaqs().catch(() => []),
    fetchPublicSectionHeader("AI_ADOPTION_HEADER").catch(() => null),
    fetchPublicHomeAiAdoptionCards().catch(() => []),
    getWebsitePageSectionKeys("HOME").catch(() => [
      "HERO",
      "TRUSTED_BY",
      "FEATURES",
      "USE_CASES",
      "AI_ADOPTION",
      "OPERATIONALIZE",
      "TESTIMONIALS",
      "FAQS",
      "CTA",
    ]),
  ]);

  return (
    <HomePage
      managedContent={data.homePage}
      heroSection={heroSection?.data ?? null}
      homeFeatures={homeFeatures}
      homeFeatureHeader={homeFeatureHeader}
      homeUseCases={homeUseCases}
      homeUseCaseHeader={homeUseCaseHeader}
      homeTestimonialHeader={homeTestimonialHeader}
      homeTestimonials={homeTestimonials}
      homeFaqHeader={homeFaqHeader}
      homeFaqs={homeFaqs}
      homeAiAdoptionHeader={homeAiAdoptionHeader}
      homeAiAdoptionCards={homeAiAdoptionCards}
      sectionOrder={sectionOrder}
    />
  );
}
