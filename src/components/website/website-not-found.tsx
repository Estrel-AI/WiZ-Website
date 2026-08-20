import { ArrowLeft, ArrowRight, Compass, Home, Search } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  {
    href: "/about",
    label: "About WiiZ",
    description: "Learn how we help teams scale agentic AI.",
    icon: Compass,
  },
  {
    href: "/pricing",
    label: "Pricing",
    description: "See plans for enterprise AI adoption.",
    icon: Search,
  },
];

export default function WebsiteNotFound() {
  return (
    <main className="relative overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#b33c6d33_0%,transparent_35%)]" />
      <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-quaternary/20 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <section className="relative px-4 py-16 md:px-6 md:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="mb-4 inline-flex items-center rounded-full border border-secondary/30 bg-secondary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-secondary">
              Error 404
            </span>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-[4.75rem] lg:leading-[1.02]">
              This route drifted
              <br />
              outside the workflow.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
              The page you requested does not exist, may have moved, or is still waiting
              to be deployed. Let&apos;s get you back to a working path.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-tertiary to-quaternary px-7 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-105"
              >
                Go To Homepage
                <Home className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
              >
                Explore About
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-gray-400">
              <ArrowLeft className="h-4 w-4" />
              Try the main navigation above to jump to active website sections.
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-quaternary/20 via-transparent to-secondary/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 shadow-2xl md:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-secondary">
                    Route Status
                  </p>
                  <p className="mt-2 text-6xl font-bold text-white md:text-7xl">404</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Compass className="h-8 w-8 text-secondary" />
                </div>
              </div>

              <div className="space-y-4">
                {quickLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 transition-colors duration-300 hover:bg-white/10"
                    >
                      <div className="rounded-xl bg-white/10 p-3">
                        <Icon className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.label}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 text-gray-400" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
