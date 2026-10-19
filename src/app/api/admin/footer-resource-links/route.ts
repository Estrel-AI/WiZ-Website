import { NextResponse } from "next/server";
import {
  getAllFooterResourceLinksAdmin,
  upsertFooterResourceLink,
} from "@/src/lib/admin-footer-resource-links";
import type { ApiResponse, FooterResourceLinkRow, FooterResourceLinkUpsertPayload } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getAllFooterResourceLinksAdmin();
    return NextResponse.json<ApiResponse<FooterResourceLinkRow[]>>({
      success: true,
      message: "Resource links retrieved successfully.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<FooterResourceLinkRow[]>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load footer resource links.",
        data: [],
        error: error instanceof Error ? error.message : "Failed to load footer resource links.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FooterResourceLinkUpsertPayload;

    if (!body.title || !body.title.trim()) {
      return NextResponse.json<ApiResponse<FooterResourceLinkRow | null>>(
        { success: false, message: "Page title is required.", data: null, error: "Page title is required." },
        { status: 400 },
      );
    }
    if (!body.url || !body.url.trim()) {
      return NextResponse.json<ApiResponse<FooterResourceLinkRow | null>>(
        { success: false, message: "URL / Route is required.", data: null, error: "URL / Route is required." },
        { status: 400 },
      );
    }

    const data = await upsertFooterResourceLink(body);
    return NextResponse.json<ApiResponse<FooterResourceLinkRow>>({
      success: true,
      message: body.id ? "Resource page updated successfully." : "Resource page created successfully.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<FooterResourceLinkRow | null>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to save resource page.",
        data: null,
        error: error instanceof Error ? error.message : "Failed to save resource page.",
      },
      { status: 500 },
    );
  }
}
