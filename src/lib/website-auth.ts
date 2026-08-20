import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { RowDataPacket } from "mysql2/promise";
import { getServerEnvFromNames } from "@/src/lib/server-env";

const scryptAsync = promisify(scrypt);

export type WebsiteAuthTokenPayload = {
  id: number;
  email: string;
  username: string;
  password: string | null;
  zoho_customer_id: string;
  name?: string | null;
  subscription_status?: string | null;
  subscription_plan_code?: string | null;
  iat?: number;
  exp?: number;
};

export type UserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  password: string | null;
  google_id: string | null;
  linkedin_id: string | null;
  github_id: string | null;
  zoho_customer_id: string;
  zoho_subscription_id: string | null;
  subscription_status: string | null;
  subscription_plan_code: string | null;
  created_at: Date;
  updated_at: Date;
};

const JWT_COOKIE_NAME = "wiiz_auth_token";
function getJwtSecret() {
  return (
    getServerEnvFromNames(["JWT_SECRET", "AUTH_JWT_SECRET"], "") ||
    "wiiz-local-jwt-secret-change-me"
  );
}

function base64UrlEncode(value: string | Buffer) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return Buffer.from(`${normalized}${padding}`, "base64");
}


export async function createAuthToken(user: UserRow) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: WebsiteAuthTokenPayload = {
    id: user.id,
    email: user.email,
    username: user.email,
    password: user.password,
    zoho_customer_id: user.zoho_customer_id,
    name: user.name,
    subscription_status: user.subscription_status,
    subscription_plan_code: user.subscription_plan_code,
    iat: issuedAt,
    exp: issuedAt + 60 * 60 * 24 * 7,
  };

  const headerSegment = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadSegment = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${headerSegment}.${payloadSegment}`;
  const signature = createHmac("sha256", getJwtSecret()).update(signingInput).digest();

  return `${signingInput}.${base64UrlEncode(signature)}`;
}

export function verifyAuthToken(token: string) {
  const [headerSegment, payloadSegment, signatureSegment] = token.split(".");

  if (!headerSegment || !payloadSegment || !signatureSegment) {
    return null;
  }

  const signingInput = `${headerSegment}.${payloadSegment}`;
  const expectedSignature = createHmac("sha256", getJwtSecret()).update(signingInput).digest();
  const receivedSignature = base64UrlDecode(signatureSegment);

  if (
    expectedSignature.length !== receivedSignature.length ||
    !timingSafeEqual(expectedSignature, receivedSignature)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadSegment).toString("utf8")) as WebsiteAuthTokenPayload;

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest) {
  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader.slice("Bearer ".length).trim();
  }

  return request.cookies.get(JWT_COOKIE_NAME)?.value ?? null;
}

export function applyAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(JWT_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

export function buildFullName(firstName?: string | null, lastName?: string | null) {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return fullName || "WiiZ User";
}
