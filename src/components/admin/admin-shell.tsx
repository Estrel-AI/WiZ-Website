"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Home,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  PanelsTopLeft,
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
      { href: "/admin/blog", label: "Blog", icon: BookOpen },
      { href: "/admin/industry", label: "Industry", icon: Layers3 },
      { href: "/admin/features", label: "Features", icon: Sparkles },
      { href: "/admin/home-use-case-cards", label: "Home Use Cases", icon: PanelsTopLeft },
      { href: "/admin/pricing", label: "Pricing", icon: Tag },
      { href: "/admin/home", label: "Home Editor", icon: Home },
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
    pathname === "/admin/industry" ||
    pathname.startsWith("/admin/industry/") ||
    pathname === "/admin/functions" ||
    pathname.startsWith("/admin/functions/") ||
    pathname === "/admin/use-cases" ||
    pathname.startsWith("/admin/use-cases/");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [industryMenuOpen, setIndustryMenuOpen] = useState(isIndustrySection);
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
  }

  return (
    <AdminToastProvider>
      <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
        <div className="flex h-full">
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white text-slate-800 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300",
              collapsed ? "w-[84px]" : "w-[264px]",
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            )}
          >
            <div
              className={cn(
                "relative flex items-center border-b border-slate-200 px-4 py-3.5",
                collapsed ? "justify-center" : "justify-between gap-3",
              )}
            >
              <Link
                href="/admin"
                className={cn(
                  collapsed
                    ? "flex h-11 w-11 items-center justify-center rounded-2xl bg-white p-2"
                    : "flex min-w-0 flex-1 items-center justify-center rounded-2xl py-0.5",
                )}
              >
                <img
                  src={cn(collapsed ? "/images/icon-light.png" : "/images/white-new-logo.png")}
                  alt="WiiZ Logo"
                  className={cn("object-contain", collapsed ? "h-10 w-10" : "h-12 w-auto max-w-[132px]")}
                />
              </Link>
            </div>

            <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
              {adminNavigation.map((section) => (
                <div key={section.title}>
                  {!collapsed ? (
                    <div className="mb-2.5 px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
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
                                  return;
                                }
                                setIndustryMenuOpen((value) => !value);
                              }}
                              className={cn(
                                "group relative flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
                                isIndustrySection
                                  ? "bg-slate-100 text-slate-950"
                                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-950",
                                collapsed && "justify-center px-0",
                              )}
                            >
                              {isIndustrySection && !collapsed ? (
                                <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-slate-900" />
                              ) : null}
                              <Icon className={cn("h-5 w-5 shrink-0", isIndustrySection ? "text-slate-950" : "text-slate-500 group-hover:text-slate-900")} />
                              {!collapsed ? (
                                <>
                                  <span className="flex-1 text-left">Industry</span>
                                  <ChevronDown className={cn("h-4 w-4 transition-transform", industryMenuOpen && "rotate-180")} />
                                </>
                              ) : null}
                            </button>

                            {!collapsed && industryMenuOpen ? (
                              <div className="space-y-1 pl-4">
                                {[
                                  { href: "/admin/industry", label: "Industry" },
                                  { href: "/admin/functions", label: "Functions" },
                                  { href: "/admin/use-cases", label: "Use Cases" },
                                ].map((child) => {
                                  const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={cn(
                                        "flex items-center rounded-xl px-4 py-2 text-sm transition",
                                        childActive
                                          ? "bg-slate-100 text-slate-950"
                                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
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
                            "group relative flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
                            active
                              ? "bg-slate-100 text-slate-950"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-950",
                            collapsed && "justify-center px-0",
                          )}
                        >
                          {active && !collapsed ? (
                            <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-slate-900" />
                          ) : null}
                          <Icon className={cn("h-5 w-5 shrink-0", active ? "text-slate-950" : "text-slate-500 group-hover:text-slate-900")} />
                          {!collapsed ? <span>{item.label}</span> : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="border-t border-slate-200 px-4 py-3.5" />
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
              <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
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
                                <Link href={crumb.href} className="text-slate-600 transition hover:text-slate-900">
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
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                          {userEmail.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-slate-700">Admin</div>
                        <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", accountMenuOpen && "rotate-180")} />
                      </summary>
                      <div className="absolute right-0 top-full z-30 mt-2.5 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
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

