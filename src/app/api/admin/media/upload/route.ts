import { promises as fs } from "node:fs";
import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { updateHeroSectionFilePath } from "@/src/lib/admin-hero-section";
import { updateUseCaseDetailFilePath } from "@/src/lib/admin-hierarchy";
import { saveAdminMediaFile } from "@/src/lib/admin-media";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  let savedFile:
    | Awaited<ReturnType<typeof saveAdminMediaFile>>
    | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");
    const rowId = formData.get("rowId");

    if (!(file instanceof File)) {
      return badRequest("file is required.");
    }

    if (typeof folder !== "string" || typeof rowId !== "string") {
      return badRequest("folder and rowId are required.");
    }

    savedFile = await saveAdminMediaFile({ file, folder, rowId });

    if (savedFile.folder === "hero") {
      await updateHeroSectionFilePath(savedFile.rowId, savedFile.filePath);
    } else {
      await updateUseCaseDetailFilePath(savedFile.rowId, savedFile.filePath);
    }

    return ok("Media uploaded successfully", {
      rowId: savedFile.rowId,
      folder: savedFile.folder,
      fileName: savedFile.fileName,
      filePath: savedFile.filePath,
    });
  } catch (error) {
    if (savedFile) {
      await fs.unlink(savedFile.absolutePath).catch(() => undefined);
    }

    const message = error instanceof Error ? error.message : "Unable to upload media.";
    const knownValidationMessages = new Set([
      "file is required.",
      "folder and rowId are required.",
      "folder must be either hero or impact.",
      "rowId must be a positive integer.",
      "Only image and video files are allowed.",
      "Unsupported file type.",
      "Hero section not found.",
      "Use case detail row not found.",
    ]);

    if (knownValidationMessages.has(message)) {
      return badRequest(message);
    }

    return serverError(message);
  }
}
