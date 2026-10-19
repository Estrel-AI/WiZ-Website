import { NextResponse } from "next/server";
import {
  deleteFooterSocialLink,
  getFooterSocialLinkById,
} from "@/src/lib/admin-footer-social-links";
import type { ApiResponse, FooterSocialLinkRow } from "@/src/types/admin-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const linkId = Number.parseInt(id, 10);
    if (Number.isNaN(linkId)) {
      return NextResponse.json<ApiResponse<FooterSocialLinkRow | null>>(
        { success: false, message: "Invalid social link ID.", data: null, error: "Invalid social link ID." },
        { status: 400 },
      );
    }

    const data = await getFooterSocialLinkById(linkId);
    if (!data) {
      return NextResponse.json<ApiResponse<FooterSocialLinkRow | null>>(
        { success: false, message: "Social link not found.", data: null, error: "Social link not found." },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<FooterSocialLinkRow>>({
      success: true,
      message: "Social link retrieved.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<FooterSocialLinkRow | null>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch social link.",
        data: null,
        error: error instanceof Error ? error.message : "Failed to fetch social link.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const linkId = Number.parseInt(id, 10);
    if (Number.isNaN(linkId)) {
      return NextResponse.json<ApiResponse<boolean>>(
        { success: false, message: "Invalid social link ID.", data: false, error: "Invalid social link ID." },
        { status: 400 },
      );
    }

    const deleted = await deleteFooterSocialLink(linkId);
    if (!deleted) {
      return NextResponse.json<ApiResponse<boolean>>(
        { success: false, message: "Social link not found or already deleted.", data: false, error: "Social link not found or already deleted." },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<boolean>>({
      success: true,
      message: "Social link deleted successfully.",
      data: true,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<boolean>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete social link.",
        data: false,
        error: error instanceof Error ? error.message : "Failed to delete social link.",
      },
      { status: 500 },
    );
  }
}
