import mysql, { type Pool, type PoolOptions, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { getServerEnvFromNames, getServerNumberEnv } from "@/src/lib/server-env";

type SqlValue =
  | string
  | number
  | bigint
  | boolean
  | Date
  | null
  | Buffer
  | Uint8Array
  | SqlValue[]
  | { [key: string]: SqlValue };

type SqlValues = SqlValue | SqlValue[] | { [key: string]: SqlValue };

declare global {
  var __wiizMysqlPool: Pool | undefined;
}

function getPoolConfig(): PoolOptions {
  return {
    host: getServerEnvFromNames(["MYSQL_HOST", "DB_HOST"], "127.0.0.1"),
    port: getServerNumberEnv(["MYSQL_PORT", "DB_PORT"], 3306),
    user: getServerEnvFromNames(["MYSQL_USER", "DB_USER"], "root"),
    password: getServerEnvFromNames(["MYSQL_PASSWORD", "DB_PASSWORD"], ""),
    database: getServerEnvFromNames(["MYSQL_DATABASE", "DB_NAME"], "wiiz_website"),
    waitForConnections: true,
    connectionLimit: getServerNumberEnv("MYSQL_CONNECTION_LIMIT", 10),
    queueLimit: 0,
  };
}

export function getMysqlPool() {
  if (!global.__wiizMysqlPool) {
    global.__wiizMysqlPool = mysql.createPool(getPoolConfig());
  }

  return global.__wiizMysqlPool;
}

export async function queryRows<T extends RowDataPacket = RowDataPacket>(
  sql: string,
  values: SqlValues = [],
) {
  const [rows] = await getMysqlPool().query<T[]>(sql, values);
  return rows;
}

export async function executeStatement(sql: string, values: SqlValues = []) {
  const [result] = await getMysqlPool().execute<ResultSetHeader>(sql, values);
  return result;
}

export async function testMysqlConnection() {
  const rows = await queryRows<{ connected: number; databaseName: string } & RowDataPacket>(
    "SELECT 1 AS connected, DATABASE() AS databaseName",
  );

  return rows[0];
}
