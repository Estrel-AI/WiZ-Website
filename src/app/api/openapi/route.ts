import { NextResponse } from "next/server";
import { openApiDocument } from "@/src/lib/openapi";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(openApiDocument);
}

