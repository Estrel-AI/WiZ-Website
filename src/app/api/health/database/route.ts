import { NextResponse } from "next/server";
import { testMysqlConnection } from "@/src/lib/mysql";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await testMysqlConnection();

    return NextResponse.json({
      ok: true,
      driver: "mysql2",
      database: result?.databaseName ?? process.env.MYSQL_DATABASE ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to connect to MySQL.";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: 500 },
    );
  }
}
