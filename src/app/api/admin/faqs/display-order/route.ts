import { updateHomeFaqDisplayOrder } from "@/src/lib/admin-home-faqs";
import type { ApiResponse, HomeFaqDisplayOrderPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HomeFaqDisplayOrderPayload;

    if (!Array.isArray(body?.items) || body.items.length === 0) {
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

    await updateHomeFaqDisplayOrder(body);
    return Response.json({
      success: true,
      data: null,
      message: "FAQ display order updated successfully.",
      error: null,
    } satisfies ApiResponse<null>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to update display order.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
