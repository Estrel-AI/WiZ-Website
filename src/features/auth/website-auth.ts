import { HUB_BASE_URL, DEVELOPER_HUB_BASE_URL, BUSINESS_HUB_BASE_URL, buildPublicApiUrl } from "@/src/config/public-env";

export const HUB_LOGIN_URL = buildPublicApiUrl(HUB_BASE_URL, "/aistudio/login");
export const DEVELOPER_LOGIN_URL = buildPublicApiUrl(DEVELOPER_HUB_BASE_URL, "/aistudio/login");
export const BUSINESS_LOGIN_URL = buildPublicApiUrl(BUSINESS_HUB_BASE_URL, "/aistudio/login");

export const AUTH_TOKEN_KEY = "wiizAuthToken";
export const AUTH_USER_KEY = "wiizUserData";
export const AUTH_EVENT_NAME = "wiiz-auth-changed";

type AuthContainer = Record<string, unknown>;

function readString(source: AuthContainer | null | undefined, key: string): string {
  const value = source?.[key];
  return typeof value === "string" ? value : "";
}

function firstDefinedString(...values: string[]): string {
  return values.find((value) => value.trim() !== "") ?? "";
}

function isAuthContainer(value: unknown): value is AuthContainer {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectContainers(responseData: AuthContainer): AuthContainer[] {
  const containers: AuthContainer[] = [responseData];

  for (const key of ["data", "user", "result", "profile"]) {
    const nested = responseData[key];
    if (isAuthContainer(nested)) {
      containers.push(nested);
    }
  }

  return containers;
}

export function decodeJwtPayload(token: string): AuthContainer | null {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) {
      return null;
    }

    const padded = payloadSegment + "=".repeat((4 - (payloadSegment.length % 4)) % 4);
    const json = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed: unknown = JSON.parse(json);

    return isAuthContainer(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readZohoCustomerIdFromCookie(): string {
  try {
    const cookieVal = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("access_token="));
    if (!cookieVal) {
      return "";
    }

    const token = cookieVal.slice("access_token=".length);
    return readString(decodeJwtPayload(token), "zoho_customer_id");
  } catch {
    return "";
  }
}

export function persistWebsiteLogin(responseData: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  const containers = collectContainers(responseData);

  const accessToken = firstDefinedString(
    ...containers.map((container) => readString(container, "access_token")),
  );

  if (!accessToken) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, accessToken);

  const tokenPayload = decodeJwtPayload(accessToken);

  const userToStore = {
    email: firstDefinedString(
      ...containers.map((container) => readString(container, "email")),
      readString(tokenPayload, "email"),
    ),
    username: firstDefinedString(
      ...containers.map((container) => readString(container, "username")),
      readString(tokenPayload, "username"),
    ),
    first_name: firstDefinedString(
      ...containers.map((container) => readString(container, "first_name")),
      readString(tokenPayload, "first_name"),
      readString(tokenPayload, "name"),
    ),
    display_name: firstDefinedString(
      ...containers.map((container) => readString(container, "display_name")),
      readString(tokenPayload, "display_name"),
    ),
    role: firstDefinedString(
      ...containers.map((container) => readString(container, "role")),
      readString(tokenPayload, "role"),
    ),
    plan: firstDefinedString(
      ...containers.map((container) => readString(container, "plan")),
      readString(tokenPayload, "plan"),
    ),
    org_id: firstDefinedString(
      ...containers.map((container) => readString(container, "org_id")),
      readString(tokenPayload, "org_id"),
    ),
    team_id: firstDefinedString(
      ...containers.map((container) => readString(container, "team_id")),
      readString(tokenPayload, "team_id"),
    ),
    admin_name: firstDefinedString(
      ...containers.map((container) => readString(container, "admin_name")),
      readString(tokenPayload, "admin_name"),
    ),
    zoho_customer_id: firstDefinedString(
      ...containers.map((container) => readString(container, "zoho_customer_id")),
      readString(tokenPayload, "zoho_customer_id"),
      readZohoCustomerIdFromCookie(),
    ),
  };

  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userToStore));
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
}
