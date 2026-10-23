import { NextResponse } from "next/server";
import {
  deleteFooterResourceLink,
  getFooterResourceLinkById,
} from "@/src/lib/admin-footer-resource-links";
import type { ApiResponse, FooterResourceLinkRow } from "@/src/types/admin-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const linkId = Number.parseInt(id, 10);
    if (Number.isNaN(linkId)) {
      return NextResponse.json<ApiResponse<FooterResourceLinkRow | null>>(
        { success: false, message: "Invalid resource link ID.", data: null, error: "Invalid resource link ID." },
        { status: 400 },
      );
    }

    const data = await getFooterResourceLinkById(linkId);
    if (!data) {
      return NextResponse.json<ApiResponse<FooterResourceLinkRow | null>>(
        { success: false, message: "Resource link not found.", data: null, error: "Resource link not found." },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<FooterResourceLinkRow>>({
      success: true,
      message: "Resource link retrieved.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<FooterResourceLinkRow | null>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch resource link.",
        data: null,
        error: error instanceof Error ? error.message : "Failed to fetch resource link.",
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
        { success: false, message: "Invalid resource link ID.", data: false, error: "Invalid resource link ID." },
        { status: 400 },
      );
    }

    const deleted = await deleteFooterResourceLink(linkId);
    if (!deleted) {
      return NextResponse.json<ApiResponse<boolean>>(
        { success: false, message: "Resource link not found or already deleted.", data: false, error: "Resource link not found or already deleted." },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<boolean>>({
      success: true,
      message: "Resource page deleted successfully.",
      data: true,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<boolean>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete resource page.",
        data: false,
        error: error instanceof Error ? error.message : "Failed to delete resource page.",
      },
      { status: 500 },
    );
  }
}
