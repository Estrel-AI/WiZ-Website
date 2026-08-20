"use client";

import { usePathname } from "next/navigation";
import { AdminShell } from "@/src/components/admin/admin-shell";

export function AdminLayoutFrame({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string | null;
}) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";

  if (isLoginRoute || !userEmail) {
    return <section>{children}</section>;
  }

  return <AdminShell userEmail={userEmail}>{children}</AdminShell>;
}
