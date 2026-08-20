import { assertAdmin, badRequest, notFound, ok } from "@/src/lib/admin-api";
import { getIndustryFunctionsUseCases } from "@/src/lib/admin-hierarchy";

type RouteContext = {
  params: Promise<{
    industryId: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { industryId } = await context.params;
  const parsedIndustryId = Number(industryId);

  if (!Number.isInteger(parsedIndustryId) || parsedIndustryId <= 0) {
    return badRequest("A valid industry id is required.");
  }

  const result = await getIndustryFunctionsUseCases(parsedIndustryId);
  if (!result) {
    return notFound("Industry not found.");
  }

  return ok("Industry functions and use cases fetched successfully", result);
}
