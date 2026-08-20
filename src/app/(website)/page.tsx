import type { Metadata } from "next";
import HomePage from "../../components/website/home-page";
import { fetchPublicHomeFeatures } from "@/src/lib/website-home-features";
import { fetchPublicHomeUseCaseCards } from "@/src/lib/website-home-use-case-cards";
import { readWebsiteCmsData } from "@/src/lib/website-cms";
import { fetchPublicHeroSection } from "@/src/lib/website-hero";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildWebsiteMetadata({
  title: { absolute: "WiiZ | The Operating System for Enterprise Agentic AI" },
  description: "Accelerate AI adoption with WiiZ. Design, deploy, monitor, and govern AI agents from a unified platform with enterprise-grade security, observability, guardrails, and Agentic workflow orchestration.",
  path: "/",
  image: websiteOgImages.home,
});

export default async function WebsiteHomePage() {
  const [data, heroSection, homeFeatures, homeUseCases] = await Promise.all([
    readWebsiteCmsData(),
    fetchPublicHeroSection().catch(() => null),
    fetchPublicHomeFeatures().catch(() => []),
    fetchPublicHomeUseCaseCards().catch(() => []),
  ]);

  return (
    <HomePage
      managedContent={data.homePage}
      heroSection={heroSection?.data ?? null}
      homeFeatures={homeFeatures}
      homeUseCases={homeUseCases}
    />
  );
}
