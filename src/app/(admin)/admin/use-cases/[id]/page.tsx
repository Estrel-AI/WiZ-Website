import { AdminUseCaseEditorPage } from "@/src/components/admin/admin-use-case-editor-page";

export default async function AdminUseCaseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = Number(id);

  return <AdminUseCaseEditorPage useCaseId={Number.isFinite(parsedId) ? parsedId : undefined} />;
}
