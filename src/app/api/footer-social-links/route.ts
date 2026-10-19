import { NextResponse } from "next/server";
import { getActiveFooterSocialLinks } from "@/src/lib/admin-footer-social-links";
import type { ApiResponse, FooterSocialLinkRow } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getActiveFooterSocialLinks();
    return NextResponse.json<ApiResponse<FooterSocialLinkRow[]>>({
      success: true,
      message: "Active social links retrieved.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<FooterSocialLinkRow[]>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load social links.",
        data: [],
        error: error instanceof Error ? error.message : "Failed to load social links.",
      },
      { status: 500 },
    );
  }
}
