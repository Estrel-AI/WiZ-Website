import { AdminLayoutFrame } from "@/src/components/admin/admin-layout-frame";
import { getAdminSession } from "@/src/lib/admin-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedAdminLayout>{children}</ProtectedAdminLayout>;
}

async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  return <AdminLayoutFrame userEmail={session?.email ?? null}>{children}</AdminLayoutFrame>;
}
