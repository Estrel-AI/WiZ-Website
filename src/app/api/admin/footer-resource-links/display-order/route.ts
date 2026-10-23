import { NextResponse } from "next/server";
import { updateFooterResourceLinksDisplayOrder } from "@/src/lib/admin-footer-resource-links";
import type { ApiResponse, FooterResourceLinkDisplayOrderPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FooterResourceLinkDisplayOrderPayload;

    if (!Array.isArray(body.items)) {
      return NextResponse.json<ApiResponse<boolean>>(
        { success: false, message: "Items array is required.", data: false, error: "Items array is required." },
        { status: 400 },
      );
    }

    await updateFooterResourceLinksDisplayOrder(body.items);
    return NextResponse.json<ApiResponse<boolean>>({
      success: true,
      message: "Display order updated successfully.",
      data: true,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<boolean>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update display order.",
        data: false,
        error: error instanceof Error ? error.message : "Failed to update display order.",
      },
      { status: 500 },
    );
  }
}
