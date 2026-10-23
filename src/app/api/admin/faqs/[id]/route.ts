import { deleteHomeFaq, getHomeFaqById } from "@/src/lib/admin-home-faqs";
import type { ApiResponse, HomeFaqRow } from "@/src/types/admin-api";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const faqId = Number(id);
    if (!faqId || faqId <= 0) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Invalid FAQ ID.",
          error: "Invalid FAQ ID.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    const item = await getHomeFaqById(faqId);
    if (!item) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "FAQ item not found.",
          error: "FAQ item not found.",
        } satisfies ApiResponse<null>,
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: item,
      message: "FAQ item retrieved.",
      error: null,
    } satisfies ApiResponse<HomeFaqRow>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch FAQ item.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const faqId = Number(id);
    if (!faqId || faqId <= 0) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Invalid FAQ ID.",
          error: "Invalid FAQ ID.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    const deleted = await deleteHomeFaq(faqId);
    if (!deleted) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "FAQ item not found.",
          error: "FAQ item not found.",
        } satisfies ApiResponse<null>,
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: { id: faqId },
      message: "FAQ item deleted successfully.",
      error: null,
    } satisfies ApiResponse<{ id: number }>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to delete FAQ item.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
