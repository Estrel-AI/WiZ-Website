import { promises as fs } from "node:fs";
import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { upsertUseCase, updateUseCaseDetailFilePath } from "@/src/lib/admin-hierarchy";
import { saveAdminMediaFile } from "@/src/lib/admin-media";
import type { UseCaseUpsertPayload } from "@/src/types/admin-api";

async function parseUseCasePayload(request: Request): Promise<{
  payload: UseCaseUpsertPayload;
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
      payload: JSON.parse(rawPayload) as UseCaseUpsertPayload,
      file: file instanceof File ? file : null,
    };
  }

  return {
    payload: (await request.json()) as UseCaseUpsertPayload,
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
    const { payload, file } = await parseUseCasePayload(request);
    const data = await upsertUseCase(payload);

    if (file) {
      const impactDetailIndex = (payload.usecaseDetails ?? []).findIndex(
        (detail) => detail.type === "Impact" && detail.description.trim(),
      );

      if (impactDetailIndex < 0) {
        throw new Error("Impact detail is required when uploading impact media.");
      }

      const impactDetailResult = data.useCaseDetails[impactDetailIndex];
      if (!impactDetailResult) {
        throw new Error("Impact detail row not found after saving.");
      }

      savedFile = await saveAdminMediaFile({
        file,
        folder: "impact",
        rowId: String(impactDetailResult.id),
      });

      await updateUseCaseDetailFilePath(impactDetailResult.id, savedFile.filePath);
    }

    return ok("Use case saved successfully", data);
  } catch (error) {
    if (savedFile) {
      await fs.unlink(savedFile.absolutePath).catch(() => undefined);
    }

    const message = error instanceof Error ? error.message : "Unable to save use case.";

    if (
      message === "payload is required." ||
      message === "Title is required." ||
      message === 'Parent of type "function" is required.' ||
      message === "Parent must be an active function." ||
      message === "At least one item is required." ||
      message === "Use case not found." ||
      message === "Description is required." ||
      message === "Impact detail is required when uploading impact media." ||
      message === "Impact detail row not found after saving." ||
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
