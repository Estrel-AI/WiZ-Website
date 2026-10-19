"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ApiResponse, TrustedByLogoRow } from "@/src/types/admin-api";

function getLogoUrl(value: string) {
  return /^trusted-by\//i.test(value) ? `/api/media/${value}` : value;
}

export function TrustedBySection() {
  const [logos, setLogos] = useState<TrustedByLogoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/trusted-by-logos", { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as ApiResponse<TrustedByLogoRow[]>;
        if (!response.ok || !payload.success || !payload.data) throw new Error(payload.error || payload.message);
        setLogos(payload.data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setFailed(true);
        void error;
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  return (
    <section className="border-y border-gray-200 bg-white flex items-stretch font-sans" aria-label="Trusted By">
      <div className="container mx-auto flex items-center justify-start w-full overflow-hidden relative py-6 md:py-8 lg:py-10">
        <div className="flex-shrink-0 hidden md:flex items-center justify-center w-40 xl:w-64 border-r border-gray-200 bg-white z-10">
          <span className="text-sm md:text-base font-medium text-gray-800 tracking-[0.15em] uppercase">Trusted By</span>
        </div>
        <div className="flex-1 flex items-center overflow-hidden relative min-h-12">
          {loading ? <div className="w-full px-8 text-center text-sm text-gray-400">Loading trusted partners...</div> : null}
          {!loading && failed ? <div className="w-full px-8 text-center text-sm text-gray-400">Trusted partners are temporarily unavailable.</div> : null}
          {!loading && !failed && !logos.length ? <div className="w-full px-8 text-center text-sm text-gray-400">Trusted partners coming soon.</div> : null}
          {!loading && !failed && logos.length ? <>
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="flex animate-scroll whitespace-nowrap items-center w-max">
              {[0, 1].map((copy) => <div key={copy} className="flex items-center space-x-12 md:space-x-10 px-6 md:px-8">
                {logos.map((logo) => <span key={`${copy}-${logo.id}`} className="relative flex h-10 w-36 items-center justify-center md:h-12 md:w-44">
                  <Image src={getLogoUrl(logo.logoImage)} alt="Trusted By partner logo" fill sizes="176px" unoptimized className="object-contain transition-transform" />
                </span>)}
              </div>)}
            </div>
          </> : null}
        </div>
      </div>
    </section>
  );
}
