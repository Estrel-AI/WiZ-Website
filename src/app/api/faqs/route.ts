import { getWebsiteHomeFaqs } from "@/src/lib/website-home-faqs";
import type { ApiResponse, HomeFaqRow } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getWebsiteHomeFaqs();
    return Response.json({
      success: true,
      data,
      message: "Public home FAQs fetched successfully.",
      error: null,
    } satisfies ApiResponse<HomeFaqRow[]>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch FAQs.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
