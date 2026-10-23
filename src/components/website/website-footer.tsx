"use client";

import {
  Dribbble,
  Facebook,
  Figma,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  MessageSquare,
  Music,
  Phone,
  Rss,
  Send,
  Share2,
  Tv,
  Twitter,
  Video,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PolicyModalTrigger from "@/src/components/website/policy-modal-trigger";
import type { ApiResponse, FooterResourceLinkRow, FooterSocialLinkRow } from "@/src/types/admin-api";

function ProductHuntIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1.53 11.15h-2.44v3.32H8.91V7.53h4.62a2.81 2.81 0 0 1 0 5.62Zm-.1-3.58h-2.34v1.54h2.34a.77.77 0 0 0 0-1.54Z"
      />
    </svg>
  );
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  twitter: Twitter,
  x: Twitter,
  github: Github,
  figma: Figma,
  dribbble: Dribbble,
  discord: MessageCircle,
  whatsapp: MessageSquare,
  telegram: Send,
  threads: Share2,
  tiktok: Video,
  twitch: Tv,
  spotify: Music,
  rss: Rss,
  mail: Mail,
  email: Mail,
  phone: Phone,
  globe: Globe,
  producthunt: ProductHuntIcon,
};

const footerExploreLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Partner", href: "/partner" },
  { label: "Pricing", href: "/pricing" },
];

const DEFAULT_RESOURCE_LINKS: FooterResourceLinkRow[] = [
  {
    id: 1,
    title: "Contact",
    slug: "contact",
    url: "/contact",
    displayOrder: 1,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 2,
    title: "Cookie Policy",
    slug: "cookie-policy",
    url: "#cookies",
    displayOrder: 2,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 3,
    title: "Privacy Policy",
    slug: "privacy-policy",
    url: "#privacy",
    displayOrder: 3,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 4,
    title: "Terms and Conditions",
    slug: "terms-and-conditions",
    url: "#terms",
    displayOrder: 4,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
];

const DEFAULT_SOCIAL_LINKS: FooterSocialLinkRow[] = [
  {
    id: 1,
    platformName: "LinkedIn",
    icon: "linkedin",
    url: "https://www.linkedin.com/showcase/estrel-wiiz-it/",
    displayOrder: 1,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 2,
    platformName: "Instagram",
    icon: "instagram",
    url: "https://www.instagram.com/wiiz.it?",
    displayOrder: 2,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 3,
    platformName: "YouTube",
    icon: "youtube",
    url: "https://youtube.com/@wiiz-it?si=Zih4KEVCWIAuvSfD",
    displayOrder: 3,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 4,
    platformName: "Product Hunt",
    icon: "producthunt",
    url: "https://www.producthunt.com/products/wiiz?launch=wiiz-altas-2-0-public-beta",
    displayOrder: 4,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
];

export default function WebsiteFooter() {
  const [socialLinks, setSocialLinks] = useState<FooterSocialLinkRow[]>(DEFAULT_SOCIAL_LINKS);
  const [resourceLinks, setResourceLinks] = useState<FooterResourceLinkRow[]>(DEFAULT_RESOURCE_LINKS);

  useEffect(() => {
    let active = true;

    fetch("/api/footer-social-links")
      .then(async (res) => {
        const payload = (await res.json()) as ApiResponse<FooterSocialLinkRow[]>;
        if (active && payload.success && payload.data && payload.data.length > 0) {
          setSocialLinks(payload.data);
        }
      })
      .catch(() => {});

    fetch("/api/footer-resource-links")
      .then(async (res) => {
        const payload = (await res.json()) as ApiResponse<FooterResourceLinkRow[]>;
        if (active && payload.success && payload.data && payload.data.length > 0) {
          setResourceLinks(payload.data);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="bg-[#0F1115] pt-10 md:pt-16 lg:pt-20 pb-8 md:pb-10 font-sans border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-12 lg:gap-8 mb-16 md:mb-16">
          <div className="lg:col-span-2 md:col-span-3 col-span-2 pr-0 lg:pr-12">
            <Link href="/" className="inline-block mb-0 md:mb-0" aria-label="WiiZ Home">
              <img src="/api/assets/logos/primary-white-logo.png" alt="" className="h-14 lg:h-16 w-auto" />
            </Link>
            <p className="text-[15px] text-gray-300 ml-0 lg:ml-2 leading-relaxed lg:max-w-[340px]">
              WiiZ is the enterprise platform for AI orchestration, governance, and
              agent-based automation.
            </p>
          </div>

          <nav aria-label="Explore Navigation" className="order-1">
            <h3 className="text-[15px] font-semibold text-white mb-2 md:mb-6 tracking-wide">
              Explore
            </h3>
            <ul className="space-y-2">
              {footerExploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-1 col-span-2 order-3 md:order-2" aria-label="Resources Navigation">
            <h3 className="text-[15px] font-semibold text-white mb-2 md:mb-6 tracking-wide">
              Resources
            </h3>
            <ul className="space-y-2 flex justify-start md:gap-0 gap-4 md:flex-col flex-wrap">
              {resourceLinks.map((item) => {
                const lowerUrl = item.url.toLowerCase();
                const lowerSlug = item.slug.toLowerCase();

                if (lowerUrl === "#cookies" || lowerSlug === "cookie-policy") {
                  return (
                    <li key={item.id}>
                      <PolicyModalTrigger
                        policy="cookies"
                        className="text-[15px] text-gray-400 hover:text-white text-left transition-colors duration-200"
                      >
                        {item.title}
                      </PolicyModalTrigger>
                    </li>
                  );
                }

                if (lowerUrl === "#privacy" || lowerSlug === "privacy-policy") {
                  return (
                    <li key={item.id}>
                      <PolicyModalTrigger
                        policy="privacy"
                        className="text-[15px] text-gray-400 hover:text-white text-left transition-colors duration-200"
                      >
                        {item.title}
                      </PolicyModalTrigger>
                    </li>
                  );
                }

                if (lowerUrl === "#terms" || lowerSlug === "terms-and-conditions") {
                  return (
                    <li key={item.id}>
                      <PolicyModalTrigger
                        policy="terms"
                        className="text-[15px] text-gray-400 hover:text-white text-left transition-colors duration-200"
                      >
                        {item.title}
                      </PolicyModalTrigger>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      className="text-[15px] text-gray-400 hover:text-white text-left transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <nav aria-label="Social Media Navigation" className="order-2 md:order-3">
            <h3 className="text-[15px] font-semibold text-white mb-2 md:mb-6 tracking-wide">
              Social
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((item) => {
                const IconComponent = ICON_MAP[item.icon.toLowerCase()] || Globe;
                return (
                  <li key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[15px] text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.platformName}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div className="w-full h-[1px] bg-[#2a2a2a] mb-4 md:mb-8" aria-hidden="true" />
        <div className="flex flex-col sm:flex-row lg:grid lg:grid-cols-3 items-center justify-between text-center gap-3 pb-20 md:pb-0">
          <p className="text-[13px] sm:text-[14px] text-gray-400 tracking-wide sm:text-left">
            &copy; 2026 WiiZ AI Inc. All rights reserved.
          </p>
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
