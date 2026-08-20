"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type WebsiteCtaButtonProps = {
  href?: string | null;
  fallbackHref: string;
  className?: string;
  children: ReactNode;
};

export function resolveWebsiteCtaHref(
  href: string | null | undefined,
  fallbackHref: string,
) {
  const normalizedHref = href?.trim();

  if (!normalizedHref || normalizedHref === "#") {
    return fallbackHref;
  }

  return normalizedHref;
}

export default function WebsiteCtaButton({
  href,
  fallbackHref,
  className,
  children,
}: WebsiteCtaButtonProps) {
  return (
    <Link
      href={resolveWebsiteCtaHref(href, fallbackHref)}
      className={cn("inline-flex items-center justify-center", className)}
    >
      {children}
    </Link>
  );
}
