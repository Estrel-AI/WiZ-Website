"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Bot,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Home,
  Info,
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Search,
  Share2,
  Sparkles,
  Tag,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { clearAdminAuthToken } from "@/src/services/admin-auth-storage.service";
import { AdminToastProvider } from "@/src/components/admin/admin-toast";

type AdminNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
};

const adminNavigation = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/home-page-editor", label: "Home Page Editor", icon: Home },
      { href: "/admin/about-page-editor", label: "About Page Editor", icon: Info },
      { href: "/admin/partner-page-editor", label: "Partner Page Editor", icon: Handshake },
      { href: "/admin/industry", label: "AI Agents Page", icon: Bot },
      { href: "/admin/pricing-page-editor", label: "Pricing Page Editor", icon: Tag },
      { href: "/admin/blog", label: "Blog", icon: BookOpen },
      { href: "/admin/footer-management", label: "Footer Management", icon: Share2 },
      { href: "/admin/seo-management", label: "SEO Management", icon: Search },
    
    ],
  },
] satisfies AdminNavSection[];

function createBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean).slice(1);
  return [
    { label: "Admin", href: "/admin" },
    ...parts.map((part, index) => ({
      label: part.replace(/-/g, " ").replace(/\b\w/g, (value) => value.toUpperCase()),
      href: `/admin/${parts.slice(0, index + 1).join("/")}`,
    })),
  ];
}

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isIndustrySection =
    pathname === "/admin/ai-agents-header" ||
    pathname.startsWith("/admin/ai-agents-header/") ||
    pathname === "/admin/industry" ||
    pathname.startsWith("/admin/industry/") ||
    pathname === "/admin/functions" ||
    pathname.startsWith("/admin/functions/") ||
    pathname === "/admin/use-cases" ||
    pathname.startsWith("/admin/use-cases/");
  const isHomePageEditorSection =
    pathname === "/admin/home-page-editor" ||
    pathname.startsWith("/admin/home-page-editor/") ||
    pathname === "/admin/home" ||
    pathname.startsWith("/admin/home/") ||
    pathname === "/admin/trusted-by" ||
    pathname.startsWith("/admin/trusted-by/") ||
    pathname === "/admin/home-use-cases" ||
    pathname.startsWith("/admin/home-use-cases/") ||
    pathname === "/admin/features" ||
    pathname.startsWith("/admin/features/") ||
    pathname === "/admin/home-ai-adoption" ||
    pathname.startsWith("/admin/home-ai-adoption/") ||
    pathname === "/admin/testimonials" ||
    pathname.startsWith("/admin/testimonials/") ||
    pathname === "/admin/faqs" ||
    pathname.startsWith("/admin/faqs/");
  const isAboutPageEditorSection =
    pathname === "/admin/about-page-editor" ||
    pathname.startsWith("/admin/about-page-editor/") ||
    pathname === "/admin/our-vision-header" ||
    pathname.startsWith("/admin/our-vision-header/") ||
    pathname === "/admin/our-missions" ||
    pathname.startsWith("/admin/our-missions/") ||
    pathname === "/admin/leadership-team" ||
    pathname.startsWith("/admin/leadership-team/") ||
    pathname === "/admin/key-product-team" ||
    pathname.startsWith("/admin/key-product-team/");
  const isPartnerPageEditorSection =
    pathname === "/admin/partner-page-editor" ||
    pathname.startsWith("/admin/partner-page-editor/") ||
    pathname === "/admin/partner-header" ||
    pathname.startsWith("/admin/partner-header/") ||
    pathname === "/admin/partner-pathways" ||
    pathname.startsWith("/admin/partner-pathways/") ||
    pathname === "/admin/partner-benefits" ||
    pathname.startsWith("/admin/partner-benefits/");
  const isPricingPageEditorSection =
    pathname === "/admin/pricing-page-editor" ||
    pathname.startsWith("/admin/pricing-page-editor/") ||
    pathname === "/admin/pricing" ||
    pathname.startsWith("/admin/pricing/");
  const isFooterSection =
    pathname === "/admin/footer-management" ||
    pathname.startsWith("/admin/footer-management/") ||
    pathname === "/admin/footer-social-links" ||
    pathname.startsWith("/admin/footer-social-links/") ||
    pathname === "/admin/footer-resource-links" ||
    pathname.startsWith("/admin/footer-resource-links/") ||
    pathname === "/admin/legal-policies" ||
    pathname.startsWith("/admin/legal-policies/");

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [industryMenuOpen, setIndustryMenuOpen] = useState(isIndustrySection);
  const [homeEditorMenuOpen, setHomeEditorMenuOpen] = useState(isHomePageEditorSection);
  const [aboutEditorMenuOpen, setAboutEditorMenuOpen] = useState(isAboutPageEditorSection);
  const [partnerEditorMenuOpen, setPartnerEditorMenuOpen] = useState(isPartnerPageEditorSection);
  const [pricingEditorMenuOpen, setPricingEditorMenuOpen] = useState(isPricingPageEditorSection);
  const [footerMenuOpen, setFooterMenuOpen] = useState(isFooterSection);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDetailsElement | null>(null);
  const breadcrumbs = useMemo(() => createBreadcrumbs(pathname), [pathname]);

  useEffect(() => {
    if (!accountMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [accountMenuOpen]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    clearAdminAuthToken();
    router.replace("/admin/login");
    router.refresh();
  }

  function toggleSidebar() {
    setCollapsed((value) => !value);
  }

function handlePrimaryNavigation() {
    setMobileMenuOpen(false);
    setIndustryMenuOpen(false);
    setHomeEditorMenuOpen(false);
    setPricingEditorMenuOpen(false);
  }

  return (
    <AdminToastProvider>
      <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
        <div className="flex h-full">
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-[#381A31] bg-[#39182e] text-slate-200 shadow-[0_12px_40px_rgba(28,13,23,0.35)] transition-all duration-300",
              collapsed ? "w-[84px]" : "w-[264px]",
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            )}
          >
            <div
              className={cn(
                "relative flex items-center border-b border-[#381A31] bg-[#39182e]/60 px-4 py-3.5",
                collapsed ? "justify-center" : "justify-between gap-3",
              )}
            >
              <Link
                href="/admin"
                className={cn(
                  collapsed
                    ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 p-2 transition-transform hover:scale-105"
                    : "flex min-w-0 flex-1 items-center justify-start rounded-2xl py-1 px-1",
                )}
              >
                <img
                  src={collapsed ? "/api/assets/dummy_image/white-icon-light.png" : "/api/assets/dummy_image/white-new-logo.png"}
                  alt="WiiZ Logo"
                  className={cn("object-contain transition-all", collapsed ? "h-9 w-9" : "h-11 w-auto max-w-[160px]")}
                />
              </Link>
            </div>

            <nav className="admin-sidebar-scroll flex-1 space-y-5 overflow-y-auto px-3 py-4 [scrollbar-width:thin] [scrollbar-color:rgba(244, 187, 107, 0.5)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E68F17]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#E68F17]/85">
              {adminNavigation.map((section) => (
                <div key={section.title}>
                  {!collapsed ? (
                    <div className="mb-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffc777f2]">
                      {section.title}
                    </div>
                  ) : null}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname === item.href || pathname.startsWith(`${item.href}/`);

                      if (item.href === "/admin/industry") {
                        return (
                          <div key={item.href} className="space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (collapsed) {
                                  setCollapsed(false);
                                  setIndustryMenuOpen(true);
                                  setHomeEditorMenuOpen(false);
                                  setAboutEditorMenuOpen(false);
                                  setPricingEditorMenuOpen(false);
                                  return;
                                }
                                setIndustryMenuOpen((value) => {
                                  const nextValue = !value;
                                  if (nextValue) {
                                    setHomeEditorMenuOpen(false);
                                    setAboutEditorMenuOpen(false);
                                    setPricingEditorMenuOpen(false);
                                  }
                                  return nextValue;
                                });
                              }}
                              className={cn(
                                "group relative flex w-full items-center gap-3 rounded-2xl border-l-[3px] px-4 py-2.5 text-sm font-medium transition-all duration-150",
                                isIndustrySection
                                  ? "border-l-[#99265e] bg-[#98235f]/15 text-white font-semibold"
                                  : "border-l-transparent text-white hover:bg-white/10 hover:text-white",
                                collapsed && "justify-center px-0",
                              )}
                            >
                              <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isIndustrySection ? "text-[#fff]" : "text-white group-hover:text-pink-200")} />
                              {!collapsed ? (
                                <>
                                  <span className="flex-1 text-left">AI Agents Page</span>
                                  <ChevronDown className={cn("h-4 w-4 transition-transform", isIndustrySection ? "text-white" : "text-white", industryMenuOpen && "rotate-180")} />
                                </>
                              ) : null}
                            </button>

                            {!collapsed && industryMenuOpen ? (
                              <div className="space-y-1 pl-4">
                                {[
                                  { href: "/admin/ai-agents-header", label: "AI Agents Header" },
                                  { href: "/admin/use-cases", label: "Use Cases" },
                                  { href: "/admin/functions", label: "Functions" },
                                  { href: "/admin/industry", label: "Industry" },
                                ].map((child) => {
                                  const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={cn(
                                        "flex items-center rounded-xl px-4 py-2 text-sm transition-all duration-150",
                                        childActive
                                          ? "bg-white/95 text-[#98235f] font-bold shadow-xs border-l-4 border-[#98235f]"
                                          : "text-white hover:bg-white/10 hover:text-slate-100",
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        );
                      }

                        if (item.href === "/admin/home-page-editor") {
                        return (
                          <div key={item.href} className="space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (collapsed) {
                                  setCollapsed(false);
                                  setHomeEditorMenuOpen(true);
                                  setIndustryMenuOpen(false);
                                  setAboutEditorMenuOpen(false);
                                  setPricingEditorMenuOpen(false);
                                  return;
                                }
                                setHomeEditorMenuOpen((value) => {
                                  const nextValue = !value;
                                  if (nextValue) {
                                    setIndustryMenuOpen(false);
                                    setAboutEditorMenuOpen(false);
                                    setPricingEditorMenuOpen(false);
                                  }
                                  return nextValue;
                                });
                              }}
                              className={cn(
                                "group relative flex w-full items-center gap-3 rounded-2xl border-l-[3px] px-4 py-2.5 text-sm font-medium transition-all duration-150",
                                isHomePageEditorSection
                                  ? "border-l-[#99265e] bg-[#98235f]/15 text-white font-semibold"
                                  : "border-l-transparent text-white hover:bg-white/10 hover:text-white",
                                collapsed && "justify-center px-0",
                              )}
                            >
                              <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isHomePageEditorSection ? "text-[#fff]" : "text-white group-hover:text-pink-200")} />
                              {!collapsed ? (
                                <>
                                  <span className="flex-1 text-left">Home Page Editor</span>
                                  <ChevronDown className={cn("h-4 w-4 transition-transform", isHomePageEditorSection ? "text-white" : "text-white", homeEditorMenuOpen && "rotate-180")} />
                                </>
                              ) : null}
                            </button>

                            {!collapsed && homeEditorMenuOpen ? (
                              <div className="space-y-1 pl-4">
                                {[
                                    { href: "/admin/home-page-editor", label: "Section Order" },
                                    { href: "/admin/home", label: "Home Editor" },
                                    { href: "/admin/trusted-by", label: "Trusted By" },
                                    { href: "/admin/features", label: "Features", icon: Sparkles },
                                    { href: "/admin/home-use-cases", label: "Use Cases" },
                                    { href: "/admin/home-ai-adoption", label: "AI Adoption Cards" },
                                    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
                                    { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
                                  ].map((child) => {
                                  const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={cn(
                                        "flex items-center rounded-xl px-4 py-2 text-sm transition-all duration-150",
                                        childActive
                                          ? "bg-white/95 text-[#98235f] font-bold shadow-xs border-l-4 border-[#98235f]"
                                          : "text-white hover:bg-white/10 hover:text-white",
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        );
                      }

                      if (item.href === "/admin/about-page-editor") {
                        return (
                          <div key={item.href} className="space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (collapsed) {
                                  setCollapsed(false);
                                  setAboutEditorMenuOpen(true);
                                  setIndustryMenuOpen(false);
                                  setHomeEditorMenuOpen(false);
                                  setPricingEditorMenuOpen(false);
                                  return;
                                }
                                setAboutEditorMenuOpen((value) => {
                                  const nextValue = !value;
                                  if (nextValue) {
                                    setIndustryMenuOpen(false);
                                    setHomeEditorMenuOpen(false);
                                    setPricingEditorMenuOpen(false);
                                  }
                                  return nextValue;
                                });
                              }}
                              className={cn(
                                "group relative flex w-full items-center gap-3 rounded-2xl border-l-[3px] px-4 py-2.5 text-sm font-medium transition-all duration-150",
                                isAboutPageEditorSection
                                  ? "border-l-[#99265e] bg-[#98235f]/15 text-white font-semibold"
                                  : "border-l-transparent text-white hover:bg-white/10 hover:text-white",
                                collapsed && "justify-center px-0",
                              )}
                            >
                              <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isAboutPageEditorSection ? "text-[#fff]" : "text-white group-hover:text-pink-200")} />
                              {!collapsed ? (
                                <>
                                  <span className="flex-1 text-left">About Page Editor</span>
                                  <ChevronDown className={cn("h-4 w-4 transition-transform", isAboutPageEditorSection ? "text-white" : "text-white", aboutEditorMenuOpen && "rotate-180")} />
                                </>
                              ) : null}
                            </button>

                            {!collapsed && aboutEditorMenuOpen ? (
                                <div className="space-y-1 pl-4">
                                  {[
                                    { href: "/admin/about-page-editor", label: "Section Order" },
                                    { href: "/admin/our-vision-header", label: "Vision Header" },
                                    { href: "/admin/our-missions", label: "Our Missions" },
                                    { href: "/admin/leadership-team", label: "Leadership Team" },
                                    { href: "/admin/key-product-team", label: "Key Product Team" },
                                  ].map((child) => {
                                  const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={cn(
                                        "flex items-center rounded-xl px-4 py-2 text-sm transition-all duration-150",
                                        childActive
                                          ? "bg-white/95 text-[#98235f] font-bold shadow-xs border-l-4 border-[#98235f]"
                                          : "text-white hover:bg-white/10 hover:text-slate-100",
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        );
                      }

                      if (item.href === "/admin/partner-page-editor") {
                        return (
                          <div key={item.href} className="space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (collapsed) {
                                  setCollapsed(false);
                                  setPartnerEditorMenuOpen(true);
                                  setIndustryMenuOpen(false);
                                  setHomeEditorMenuOpen(false);
                                  setAboutEditorMenuOpen(false);
                                  setPricingEditorMenuOpen(false);
                                  return;
                                }
                                setPartnerEditorMenuOpen((value) => {
                                  const nextValue = !value;
                                  if (nextValue) {
                                    setIndustryMenuOpen(false);
                                    setHomeEditorMenuOpen(false);
                                    setAboutEditorMenuOpen(false);
                                    setPricingEditorMenuOpen(false);
                                  }
                                  return nextValue;
                                });
                              }}
                              className={cn(
                                "group relative flex w-full items-center gap-3 rounded-2xl border-l-[3px] px-4 py-2.5 text-sm font-medium transition-all duration-150",
                                isPartnerPageEditorSection
                                  ? "border-l-[#99265e] bg-[#98235f]/15 text-white font-semibold"
                                  : "border-l-transparent text-white hover:bg-white/10 hover:text-white",
                                collapsed && "justify-center px-0",
                              )}
                            >
                              <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isPartnerPageEditorSection ? "text-[#fff]" : "text-white group-hover:text-pink-200")} />
                              {!collapsed ? (
                                <>
                                  <span className="flex-1 text-left">Partner Page Editor</span>
                                  <ChevronDown className={cn("h-4 w-4 transition-transform", isPartnerPageEditorSection ? "text-white" : "text-white", partnerEditorMenuOpen && "rotate-180")} />
                                </>
                              ) : null}
                            </button>

                            {!collapsed && partnerEditorMenuOpen ? (
                              <div className="space-y-1 pl-4">
                                  {[
                                    { href: "/admin/partner-page-editor", label: "Section Order" },
                                    { href: "/admin/partner-header", label: "Partner Header" },
                                    { href: "/admin/partner-pathways", label: "Partnership Pathways" },
                                    { href: "/admin/partner-benefits", label: "Partner Benefits" },
                                  ].map((child) => {
                                  const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={cn(
                                        "flex items-center rounded-xl px-4 py-2 text-sm transition-all duration-150",
                                        childActive
                                          ? "bg-white/95 text-[#98235f] font-bold shadow-xs border-l-4 border-[#98235f]"
                                          : "text-white hover:bg-white/10 hover:text-slate-100",
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        );
                      }

                      if (item.href === "/admin/pricing-page-editor") {
                        return (
                          <div key={item.href} className="space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (collapsed) {
                                  setCollapsed(false);
                                  setPricingEditorMenuOpen(true);
                                  setIndustryMenuOpen(false);
                                  setHomeEditorMenuOpen(false);
                                  setAboutEditorMenuOpen(false);
                                  setPartnerEditorMenuOpen(false);
                                  return;
                                }
                                setPricingEditorMenuOpen((value) => {
                                  const nextValue = !value;
                                  if (nextValue) {
                                    setIndustryMenuOpen(false);
                                    setHomeEditorMenuOpen(false);
                                    setAboutEditorMenuOpen(false);
                                    setPartnerEditorMenuOpen(false);
                                  }
                                  return nextValue;
                                });
                              }}
                              className={cn(
                                "group relative flex w-full items-center gap-3 rounded-2xl border-l-[3px] px-4 py-2.5 text-sm font-medium transition-all duration-150",
                                isPricingPageEditorSection
                                  ? "border-l-[#99265e] bg-[#98235f]/15 text-white font-semibold"
                                  : "border-l-transparent text-white hover:bg-white/10 hover:text-white",
                                collapsed && "justify-center px-0",
                              )}
                            >
                              <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isPricingPageEditorSection ? "text-[#fff]" : "text-white group-hover:text-pink-200")} />
                              {!collapsed ? (
                                <>
                                  <span className="flex-1 text-left">Pricing Page Editor</span>
                                  <ChevronDown className={cn("h-4 w-4 transition-transform", isPricingPageEditorSection ? "text-white" : "text-white", pricingEditorMenuOpen && "rotate-180")} />
                                </>
                              ) : null}
                            </button>

                            {!collapsed && pricingEditorMenuOpen ? (
                              <div className="space-y-1 pl-4">
                                  {[
                                    { href: "/admin/pricing-page-editor", label: "Section Order" },
                                    { href: "/admin/pricing", label: "Pricing Plans" },
                                  ].map((child) => {
                                  const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={cn(
                                        "flex items-center rounded-xl px-4 py-2 text-sm transition-all duration-150",
                                        childActive
                                          ? "bg-white/95 text-[#98235f] font-bold shadow-xs border-l-4 border-[#98235f]"
                                          : "text-white hover:bg-white/10 hover:text-slate-100",
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        );
                      }

                      if (item.href === "/admin/footer-management") {
                        return (
                          <div key={item.href} className="space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (collapsed) {
                                  router.push("/admin/footer-social-links");
                                  setMobileMenuOpen(false);
                                  return;
                                }
                                setFooterMenuOpen((prev) => !prev);
                              }}
                              className={cn(
                                "group relative flex w-full items-center gap-3 rounded-2xl border-l-[3px] px-4 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer",
                                isFooterSection
                                  ? "border-l-[#99265e] bg-[#98235f]/15 text-white font-semibold"
                                  : "border-l-transparent text-white hover:bg-white/10 hover:text-white",
                                collapsed && "justify-center px-0",
                              )}
                            >
                              <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isFooterSection ? "text-[#fff]" : "text-white group-hover:text-pink-200")} />
                              {!collapsed ? (
                                <>
                                  <span className="flex-1 text-left">Footer Management</span>
                                  <ChevronDown className={cn("h-4 w-4 transition-transform", isFooterSection ? "text-white" : "text-white", footerMenuOpen && "rotate-180")} />
                                </>
                              ) : null}
                            </button>

                            {!collapsed && footerMenuOpen ? (
                              <div className="space-y-1 pl-4">
                                {[                                  
                                  { href: "/admin/footer-resource-links", label: "Resource Links" },
                                  { href: "/admin/legal-policies", label: "Legal Policies" },                                
                                  { href: "/admin/footer-social-links", label: "Social Links" },
                                ].map((child) => {
                                  const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={cn(
                                        "flex items-center rounded-xl px-4 py-2 text-sm transition-all duration-150",
                                        childActive
                                          ? "bg-white/95 text-[#98235f] font-bold shadow-xs border-l-4 border-[#98235f]"
                                          : "text-white hover:bg-white/10 hover:text-slate-100",
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handlePrimaryNavigation}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-2xl border-l-[3px] px-4 py-2.5 text-sm font-medium transition-all duration-150",
                            active
                              ? "border-l-[#99265e] bg-[#98235f]/15 text-white font-semibold"
                              : "border-l-transparent text-white hover:bg-white/10 hover:text-white",
                            collapsed && "justify-center px-0",
                          )}
                        >
                          <Icon className={cn("h-5 w-5 shrink-0 transition-colors", active ? "text-[#fff]" : "text-white group-hover:text-pink-200")} />
                          {!collapsed ? <span>{item.label}</span> : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="border-t border-[#381A31] px-3 py-3.5">
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-white/80 transition-all duration-150 hover:bg-white/10 hover:text-white",
                  collapsed && "justify-center px-0",
                )}
                title="Logout"
              >
                <LogOut className="h-5 w-5 shrink-0 text-white/60 transition-colors group-hover:text-pink-200" />
                {!collapsed ? <span>Logout</span> : null}
              </button>
            </div>
          </aside>

          {mobileMenuOpen ? (
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          ) : null}

          <div
            className={cn(
              "flex min-w-0 flex-1 flex-col overflow-hidden transition-[padding-left] duration-300",
              collapsed ? "lg:pl-[84px]" : "lg:pl-[264px]",
            )}
          >
            <div className="flex flex-1 flex-col overflow-y-auto">
              <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5 lg:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleSidebar}
                      className="hidden rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
                    >
                      <ChevronRight className={cn("h-5 w-5 transition-transform", !collapsed && "rotate-180")} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(true)}
                      className="inline-flex rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                    >
                      <Menu className="h-5 w-5" />
                    </button>
                    <div className="min-w-0 text-sm font-medium text-slate-900">
                      <div className="flex flex-wrap items-center gap-2">
                        {breadcrumbs.map((crumb, index) => {
                          const isLast = index === breadcrumbs.length - 1;
                          return (
                            <div key={crumb.href} className="flex items-center gap-2">
                              {index > 0 ? <span className="text-slate-400">/</span> : null}
                              {isLast ? (
                                <span className="font-semibold text-slate-950">{crumb.label}</span>
                              ) : (
                                <Link href={crumb.href} className="text-slate-500 transition hover:text-slate-900">
                                  {crumb.label}
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="hidden items-center gap-2.5 md:flex">
                    <details
                      ref={accountMenuRef}
                      className="relative"
                      open={accountMenuOpen}
                      onToggle={(event) => setAccountMenuOpen((event.currentTarget as HTMLDetailsElement).open)}
                    >
                      <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-full px-2 py-1.5 transition hover:bg-slate-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#801b54] to-[#98235f] text-sm font-semibold text-white shadow-xs">
                          {userEmail.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-slate-700">Admin</div>
                        <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", accountMenuOpen && "rotate-180")} />
                      </summary>
                      <div className="absolute right-0 top-full z-30 mt-2.5 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-black transition hover:bg-slate-50 hover:text-slate-900"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </details>
                  </div>
                </div>
              </header>

              <main className="flex-1 px-4 py-5 sm:px-5 lg:px-6">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </AdminToastProvider>
  );
}

