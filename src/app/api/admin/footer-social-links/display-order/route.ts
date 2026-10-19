import { NextResponse } from "next/server";
import { updateFooterSocialLinksDisplayOrder } from "@/src/lib/admin-footer-social-links";
import type { ApiResponse, FooterSocialLinkDisplayOrderPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FooterSocialLinkDisplayOrderPayload;

    if (!Array.isArray(body.items)) {
      return NextResponse.json<ApiResponse<boolean>>(
        { success: false, message: "Items array is required.", data: false, error: "Items array is required." },
        { status: 400 },
      );
    }

    await updateFooterSocialLinksDisplayOrder(body.items);
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
