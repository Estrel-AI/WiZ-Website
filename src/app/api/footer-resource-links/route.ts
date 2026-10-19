import { NextResponse } from "next/server";
import { getActiveFooterResourceLinks } from "@/src/lib/admin-footer-resource-links";
import type { ApiResponse, FooterResourceLinkRow } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getActiveFooterResourceLinks();
    return NextResponse.json<ApiResponse<FooterResourceLinkRow[]>>({
      success: true,
      message: "Active resource links retrieved.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<FooterResourceLinkRow[]>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load resource links.",
        data: [],
        error: error instanceof Error ? error.message : "Failed to load resource links.",
      },
      { status: 500 },
    );
  }
}
