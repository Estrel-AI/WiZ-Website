"use client";

import {
  AUTH_EVENT_NAME,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  HUB_LOGIN_URL,
} from "@/src/features/auth/website-auth";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SalesBannerStrip from "@/src/components/website/sales-banner-strip";

const navLinks = [
  { label: "Home", href: "/", title: "WiiZ" },
  { label: "About", href: "/about", title: "Learn more about us" },
  { label: "Partner", href: "/partner", title: "Partner with us" },
  { label: "AI Agents", href: "/ai-agents", title: "Explore AI Agents" },
  { label: "Pricing", href: "/pricing", title: "View pricing plans" },
  { label: "Contact", href: "/contact", title: "Contact Us" },
  { label: "Blog", href: "/blog", title: "Read our blog" },
];

const isNavLinkActive = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

type WebsiteNavbarProps = {
  salesBarText?: string | null;
};

export default function WebsiteNavbar({ salesBarText }: WebsiteNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem(AUTH_TOKEN_KEY)));
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener(AUTH_EVENT_NAME, syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener(AUTH_EVENT_NAME, syncAuthState);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    setMobileMenuOpen(false);
  };

    return (
    <>
      {salesBarText?.trim() ? <SalesBannerStrip text={salesBarText} /> : null}

      <nav className="sticky top-0 z-50 shadow-sm font-sans">
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between md:h-18">
              <Link href="/" className="flex flex-shrink-0 items-center cursor-pointer">
                <img src="/images/white-new-logo.png" alt="WiZ Logo" className="lg:h-16 h-12 w-auto" />
              </Link>
              <div className="hidden lg:flex items-center space-x-4 md:space-x-8">
                {navLinks.map((nav) => (
                  <Link
                    key={nav.label}
                    href={nav.href}
                    title={nav.title}
                    className={`md:text-base text-sm font-semibold transition ${isNavLinkActive(pathname, nav.href) ? "text-tertiary border-b-2 border-tertiary pb-1" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    {nav.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <button                             
                    type="button"
                    onClick={handleSignOut}
                    className="bg-gradient-to-r from-tertiary to-quaternary rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-105 hover:bg-opacity-90 md:text-base"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <a
                      key="register"
                      href="/register"
                      title="Create an account"
                      className={`md:text-base text-sm font-bold transition ${pathname === "/register" ? "text-tertiary border-b-2 border-tertiary pb-1" : "text-gray-600 hover:opacity-80"}`}
                    >
                      Sign up
                    </a>
                    <div className="group relative">
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 bg-gradient-to-r from-tertiary to-quaternary rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-105 hover:bg-opacity-90 md:text-base ${pathname === "/login" ? "ring-2 ring-tertiary/30" : ""}`}
                      >
                        Login
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                      </button>
                      <div className="invisible absolute right-0 top-full z-30 mt-3 w-48 translate-y-2 rounded-2xl border border-gray-100 bg-white p-2 opacity-0 shadow-[0_20px_45px_rgba(15,23,42,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        {/* <Link
                          href="/login"
                          title="Log in with username and password"
                          className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                        >
                          Website Login
                        </Link> */}
                        <Link
                          href="https://hub.wiiz.it"
                          target="_blank"
                          rel="noreferrer"
                          title="Log in to the hub"
                          className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                        >
                          WiiZ for Developer
                        </Link>
                          <Link
                          href="https://wbs.wiiz.it"
                          target="_blank"
                          rel="noreferrer"
                          title="Log in to the hub"
                          className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                        >
                          WiiZ for Business
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="lg:hidden flex items-center">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 z-[70] flex h-full w-full transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-80 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <Link
            href="/"
            className="flex flex-shrink-0 items-center cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/images/white-new-logo.png" alt="WiZ Logo" className="h-12 w-auto" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-6 overflow-y-auto p-6">
          {navLinks.map((nav) => (
            <Link
              key={nav.label}
              href={nav.href}
              title={nav.title}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-semibold transition ${isNavLinkActive(pathname, nav.href) ? "text-tertiary" : "text-gray-800 hover:text-gray-500"}`}
            >
              {nav.label}
            </Link>
          ))}
          <hr className="border-gray-100" />
          <a
            href="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-bold text-tertiary transition hover:opacity-80"
          >
            Sign Up
          </a>
          <div className="space-y-3">
            {/* <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-full border border-gray-200 px-6 py-3 text-center text-base font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              Website Login
            </Link> */}
            
            <Link
              href="https://hub.wiiz.it"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block bg-gradient-to-r from-tertiary to-quaternary rounded-full px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-opacity-90"
            >
               WiiZ for Developer
            </Link>
              <Link
              href="https://wbs.wiiz.it"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block bg-gradient-to-r from-tertiary to-quaternary rounded-full px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-opacity-90"
            >
               WiiZ for Business
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Back to top"
        onClick={scrollToTop}
        className={`fixed bottom-20 right-4 z-40 group flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#912059] via-[#b54176] to-[#d87aaa] text-white shadow-[0_14px_35px_rgba(145,32,89,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(145,32,89,0.45)] md:bottom-24 md:right-6 md:h-12 md:w-12 ${showScrollTop ? "translate-y-0 pointer-events-auto opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute -inset-2 -z-10 rounded-[1.25rem] bg-quaternary/20 blur-xl" />
        <svg className="relative h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" d="M12 19V5m0 0l-6 6m6-6l6 6" />
        </svg>
      </button>
    </>
  );
}
