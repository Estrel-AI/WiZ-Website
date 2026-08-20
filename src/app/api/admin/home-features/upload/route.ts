import { promises as fs } from "node:fs";
import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { updateHomeFeatureMediaPath } from "@/src/lib/admin-home-features";
import { saveAdminMediaFile } from "@/src/lib/admin-media";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  let savedFile: Awaited<ReturnType<typeof saveAdminMediaFile>> | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const rowId = formData.get("rowId");

    if (!(file instanceof File)) {
      return badRequest("file is required.");
    }

    if (typeof rowId !== "string") {
      return badRequest("rowId is required.");
    }

    savedFile = await saveAdminMediaFile({
      file,
      folder: "feature",
      rowId,
    });

    await updateHomeFeatureMediaPath(savedFile.rowId, savedFile.filePath);

    return ok("Feature media uploaded successfully", {
      rowId: savedFile.rowId,
      fileName: savedFile.fileName,
      filePath: savedFile.filePath,
    });
  } catch (error) {
    if (savedFile) {
      await fs.unlink(savedFile.absolutePath).catch(() => undefined);
    }

    const message = error instanceof Error ? error.message : "Unable to upload feature media.";

    if (
      message === "file is required." ||
      message === "rowId is required." ||
      message === "rowId must be a positive integer." ||
      message === "Only image and video files are allowed." ||
      message === "Unsupported file type." ||
      message === "Feature not found."
    ) {
      return badRequest(message);
    }

    return serverError(message);
  }
}
