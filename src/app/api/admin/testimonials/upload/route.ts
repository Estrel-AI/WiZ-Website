import { promises as fs } from "node:fs";
import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { updateHomeTestimonialImage } from "@/src/lib/admin-home-testimonials";
import { saveAdminMediaFile } from "@/src/lib/admin-media";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  let savedFile: Awaited<ReturnType<typeof saveAdminMediaFile>> | null = null;
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const rowId = formData.get("rowId");
    if (!(file instanceof File)) return badRequest("file is required.");
    if (typeof rowId !== "string") return badRequest("rowId is required.");
    if (!/\.(jpe?g|png|svg|webp)$/i.test(file.name) || !["image/jpeg", "image/png", "image/svg+xml", "image/webp"].includes(file.type)) {
      return badRequest("Avatar must be a JPG, JPEG, PNG, SVG, or WEBP image.");
    }
    savedFile = await saveAdminMediaFile({ file, folder: "testimonials", rowId });
    await updateHomeTestimonialImage(Number(savedFile.rowId), savedFile.filePath);
    return ok("Avatar image uploaded successfully", { rowId: savedFile.rowId, filePath: savedFile.filePath });
  } catch (error) {
    if (savedFile) await fs.unlink(savedFile.absolutePath).catch(() => undefined);
    const message = error instanceof Error ? error.message : "Unable to upload avatar image.";
    if (message.includes("size") || message.includes("required") || message.includes("positive integer") || message.includes("Unsupported")) return badRequest(message);
    return serverError(message);
  }
}
