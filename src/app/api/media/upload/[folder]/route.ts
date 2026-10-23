import { NextRequest } from "next/server";
import { saveGeneralAdminMediaFile } from "@/src/lib/admin-media";
import type { ApiResponse } from "@/src/types/admin-api";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ folder: string }> },
) {
  try {
    const { folder } = await context.params;
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "File is required.",
          error: "File is required.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    const savedFile = await saveGeneralAdminMediaFile({
      folder,
      file,
    });

    return Response.json({
      success: true,
      data: {
        filepath: savedFile.filePath,
        url: `/api/media/${savedFile.filePath}`,
      },
      message: "Media uploaded successfully.",
      error: null,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to upload media file.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
