import WebsiteChatbotIframe from "@/src/components/website/website-chatbot-iframe";
import WebsiteFooter from "@/src/components/website/website-footer";
import WebsiteNavbar from "@/src/components/website/website-navbar";
import WebsiteAnalytics from "@/src/components/website/website-analytics";
import { readWebsiteCmsData } from "@/src/lib/website-cms";
import { fetchPublicHeroSection } from "@/src/lib/website-hero";

export const dynamic = "force-dynamic";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, heroSection] = await Promise.all([
    readWebsiteCmsData(),
    fetchPublicHeroSection().catch(() => null),
  ]);
  const salesBarText = heroSection?.data.salesBarText?.trim() || data.homePage.salesBar.text;

  return (
    <>
      <WebsiteAnalytics />
      <WebsiteNavbar salesBarText={salesBarText} />
      <section>{children}</section>
      <WebsiteChatbotIframe />
      <WebsiteFooter />
    </>
  );
}
