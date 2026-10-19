import { NextResponse } from "next/server";
import {
  getAllFooterSocialLinksAdmin,
  upsertFooterSocialLink,
} from "@/src/lib/admin-footer-social-links";
import type { ApiResponse, FooterSocialLinkRow, FooterSocialLinkUpsertPayload } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getAllFooterSocialLinksAdmin();
    return NextResponse.json<ApiResponse<FooterSocialLinkRow[]>>({
      success: true,
      message: "Social links retrieved successfully.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<FooterSocialLinkRow[]>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load footer social links.",
        data: [],
        error: error instanceof Error ? error.message : "Failed to load footer social links.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FooterSocialLinkUpsertPayload;

    if (!body.platformName || !body.platformName.trim()) {
      return NextResponse.json<ApiResponse<FooterSocialLinkRow | null>>(
        { success: false, message: "Platform name is required.", data: null, error: "Platform name is required." },
        { status: 400 },
      );
    }
    if (!body.url || !body.url.trim()) {
      return NextResponse.json<ApiResponse<FooterSocialLinkRow | null>>(
        { success: false, message: "URL is required.", data: null, error: "URL is required." },
        { status: 400 },
      );
    }

    const data = await upsertFooterSocialLink(body);
    return NextResponse.json<ApiResponse<FooterSocialLinkRow>>({
      success: true,
      message: body.id ? "Social link updated successfully." : "Social link created successfully.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<FooterSocialLinkRow | null>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to save social link.",
        data: null,
        error: error instanceof Error ? error.message : "Failed to save social link.",
      },
      { status: 500 },
    );
  }
}
