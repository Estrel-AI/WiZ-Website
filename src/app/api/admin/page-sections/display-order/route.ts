import { NextRequest } from "next/server";
import { updatePageSectionsDisplayOrder } from "@/src/lib/admin-page-sections";
import type { ApiResponse, PageSectionsOrderPayload } from "@/src/types/admin-api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PageSectionsOrderPayload;
    if (!body.pageKey?.trim()) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "pageKey is required.",
          error: "pageKey is required.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Items array is required.",
          error: "Items array is required.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    for (const item of body.items) {
      if (!item.sectionKey?.trim() || typeof item.displayOrder !== "number") {
        return Response.json(
          {
            success: false,
            data: null,
            message: "Each item must have a sectionKey and a numeric displayOrder.",
            error: "Invalid item in order payload.",
          } satisfies ApiResponse<null>,
          { status: 400 },
        );
      }
    }

    await updatePageSectionsDisplayOrder({
      pageKey: body.pageKey.trim(),
      items: body.items.map((item) => ({
        sectionKey: item.sectionKey.trim(),
        displayOrder: item.displayOrder,
      })),
    });

    return Response.json({
      success: true,
      data: null,
      message: "Section order updated successfully.",
      error: null,
    } satisfies ApiResponse<null>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to update section order.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}