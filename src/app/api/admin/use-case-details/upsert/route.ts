import { promises as fs } from "node:fs";
import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { upsertUseCaseDetail } from "@/src/lib/admin-hierarchy";
import { updateUseCaseDetailFilePath } from "@/src/lib/admin-hierarchy";
import { saveAdminMediaFile } from "@/src/lib/admin-media";
import type { UseCaseDetailUpsertPayload } from "@/src/types/admin-api";

async function parseUseCaseDetailPayload(request: Request): Promise<{
  payload: UseCaseDetailUpsertPayload;
  file: File | null;
}> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const rawPayload = formData.get("payload");
    const file = formData.get("file");

    if (typeof rawPayload !== "string" || !rawPayload.trim()) {
      throw new Error("payload is required.");
    }

    return {
      payload: JSON.parse(rawPayload) as UseCaseDetailUpsertPayload,
      file: file instanceof File ? file : null,
    };
  }

  return {
    payload: (await request.json()) as UseCaseDetailUpsertPayload,
    file: null,
  };
}

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  let savedFile: Awaited<ReturnType<typeof saveAdminMediaFile>> | null = null;

  try {
    const { payload, file } = await parseUseCaseDetailPayload(request);
    const data = await upsertUseCaseDetail(payload);

    if (file) {
      savedFile = await saveAdminMediaFile({
        file,
        folder: "impact",
        rowId: String(data.id),
      });

      await updateUseCaseDetailFilePath(data.id, savedFile.filePath);
    }

    return ok("Use case detail row saved successfully", data);
  } catch (error) {
    if (savedFile) {
      await fs.unlink(savedFile.absolutePath).catch(() => undefined);
    }

    const message = error instanceof Error ? error.message : "Unable to save use case detail row.";

    if (
      message === "payload is required." ||
      message === "Use case not found." ||
      message === "Description is required." ||
      message === "Use case detail row not found." ||
      message === "Only image and video files are allowed." ||
      message === "Unsupported file type." ||
      message === "Image size must be 5 MB or less." ||
      message === "Video size must be 20 MB or less."
    ) {
      return badRequest(message);
    }

    return serverError(message);
  }
}
