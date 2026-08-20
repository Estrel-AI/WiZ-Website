import { promises as fs } from "node:fs";
import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { upsertHeroSection, updateHeroSectionFilePath } from "@/src/lib/admin-hero-section";
import { saveAdminMediaFile } from "@/src/lib/admin-media";
import type { HeroSectionUpsertPayload } from "@/src/types/admin-api";

async function parseHeroSectionPayload(request: Request): Promise<{
  payload: HeroSectionUpsertPayload;
  file: File | null;
}> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const rawData = formData.get("data");
    const file = formData.get("file");

    if (typeof rawData !== "string" || !rawData.trim()) {
      throw new Error("data is required.");
    }

    return {
      payload: JSON.parse(rawData) as HeroSectionUpsertPayload,
      file: file instanceof File ? file : null,
    };
  }

  return {
    payload: (await request.json()) as HeroSectionUpsertPayload,
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
    const { payload, file } = await parseHeroSectionPayload(request);
    const data = await upsertHeroSection(payload);

    if (file) {
      savedFile = await saveAdminMediaFile({
        file,
        folder: "hero",
        rowId: String(data.id),
      });

      await updateHeroSectionFilePath(data.id, savedFile.filePath);
    }

    return ok("Hero section saved successfully", data);
  } catch (error) {
    if (savedFile) {
      await fs.unlink(savedFile.absolutePath).catch(() => undefined);
    }

    const message = error instanceof Error ? error.message : "Unable to save hero section.";

    if (
      message === "data is required." ||
      message === "Hero section data is required." ||
      message.endsWith("must be a string.") ||
      message.endsWith("must be a string or null.") ||
      message === "Only image and video files are allowed." ||
      message === "Unsupported file type." ||
      message === "Hero section not found."
    ) {
      return badRequest(message);
    }

    return serverError(message);
  }
}
