import { listHomeFaqs, upsertHomeFaq } from "@/src/lib/admin-home-faqs";
import type { ApiResponse, HomeFaqRow, HomeFaqUpsertPayload } from "@/src/types/admin-api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status");

    let isActive: boolean | null = null;
    if (status === "active") isActive = true;
    if (status === "inactive") isActive = false;

    const data = await listHomeFaqs({ search, isActive });
    return Response.json({
      success: true,
      data,
      message: "FAQ items fetched successfully.",
      error: null,
    } satisfies ApiResponse<HomeFaqRow[]>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch FAQ items.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HomeFaqUpsertPayload;
    const result = await upsertHomeFaq(body);
    return Response.json({
      success: true,
      data: result,
      message: body.id ? "FAQ item updated successfully." : "FAQ item created successfully.",
      error: null,
    } satisfies ApiResponse<HomeFaqRow>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to save FAQ item.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 400 },
    );
  }
}
