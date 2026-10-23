import { HUB_BASE_URL, DEVELOPER_HUB_BASE_URL, BUSINESS_HUB_BASE_URL, AUTH_API_BASE_URL, BUSINESS_AUTH_API_BASE_URL, buildPublicApiUrl } from "@/src/config/public-env";

export const AUTH_TOKEN_KEY = "wiizAuthToken";
export const AUTH_USER_KEY = "wiizUserData";
export const AUTH_EVENT_NAME = "wiiz-auth-changed";

// Hub URLs
export const HUB_LOGIN_URL = "https://sandbox.wiiz.it/aistudio/login";
export const DEVELOPER_LOGIN_URL = buildPublicApiUrl(DEVELOPER_HUB_BASE_URL, "/aistudio/login");
export const BUSINESS_LOGIN_URL = buildPublicApiUrl(BUSINESS_HUB_BASE_URL, "/aistudio/login");
export const BUSINESS_CHECKOUT_REDIRECT_URL = BUSINESS_LOGIN_URL;

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

export function persistWebsiteLogin(
  responseData: Record<string, unknown>,
  accountType?: WebsiteHubType,
) {
  if (typeof window === "undefined") {
    return;
  }

  const containers = collectContainers(responseData);

  const accessToken = firstDefinedString(
    ...containers.map((container) => readString(container, "access_token")),
  );

  if (accessToken) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  }

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
    user_type: firstDefinedString(
      ...containers.map((container) => readString(container, "user_type")),
      ...containers.map((container) => readString(container, "userType")),
      readString(tokenPayload, "user_type"),
      readString(tokenPayload, "userType"),
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

  const resolvedHubType =
    accountType ??
    findAccountType(...containers, tokenPayload) ??
    (userToStore.org_id ? "business" : "developer");

  userToStore.user_type = resolvedHubType;

  if (!accessToken && !userToStore.email) {
    const existingRaw = window.localStorage.getItem(AUTH_USER_KEY);

    if (!existingRaw) {
      return;
    }

    try {
      const existing: AuthContainer = JSON.parse(existingRaw);

      if (isAuthContainer(existing)) {
        existing.user_type = resolvedHubType;
        window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(existing));
        window.dispatchEvent(new Event(AUTH_EVENT_NAME));
      }
    } catch {
      return;
    }

    return;
  }

  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userToStore));
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
}

export function getStoredWebsiteAuthToken(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY)?.trim() ?? "";
}

export function getStoredWebsiteUser(): {
  email?: string;
  org_id?: string;
  user_type?: string;
} | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return isAuthContainer(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function hasWebsiteSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (getStoredWebsiteAuthToken()) {
    return true;
  }

  const storedUser = getStoredWebsiteUser();
  return Boolean(readString(storedUser, "email"));
}

export type WebsiteHubType = "developer" | "business";

const ACCOUNT_TYPE_KEYS = ["user_type", "userType", "account_type", "accountType"] as const;

export function normalizeWebsiteHubType(value: string): WebsiteHubType | null {
  const normalized = value.trim().toLowerCase();

  if (normalized === "business" || normalized === "organisation" || normalized === "organization") {
    return "business";
  }

  if (normalized === "developer" || normalized === "dev") {
    return "developer";
  }

  return null;
}

export function findAccountType(
  ...sources: (AuthContainer | null | undefined)[]
): WebsiteHubType | null {
  for (const source of sources) {
    for (const key of ACCOUNT_TYPE_KEYS) {
      const match = normalizeWebsiteHubType(readString(source, key));

      if (match) {
        return match;
      }
    }
  }

  return null;
}

export function getWebsiteHubType(): WebsiteHubType {
  const storedUser = getStoredWebsiteUser();
  const explicitType = findAccountType(storedUser);

  if (explicitType) {
    return explicitType;
  }

  return readString(storedUser, "org_id") ? "business" : "developer";
}

export function getWebsiteHubLabel(): string {
  return getWebsiteHubType() === "business" ? "WiiZ for Business" : "WiiZ for Developer";
}

export function getWebsiteHubUrl(): string {
  return getWebsiteHubType() === "business" ? BUSINESS_LOGIN_URL : DEVELOPER_LOGIN_URL;
}

let accountTypeProbeAttempted = false;

async function probeAccountMe(baseUrl: string, token: string, storedEmail: string): Promise<boolean> {
  try {
    const response = await fetch(buildPublicApiUrl(baseUrl, "/me"), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const payload: unknown = await response.json().catch(() => null);

    if (!isAuthContainer(payload)) {
      return false;
    }

    const email = firstDefinedString(
      ...collectContainers(payload).map((container) => readString(container, "email")),
    );

    if (!email) {
      return false;
    }

    return !storedEmail || email.trim().toLowerCase() === storedEmail;
  } catch {
    return false;
  }
}

function persistResolvedAccountType(type: WebsiteHubType): WebsiteHubType | null {
  const storedUser = getStoredWebsiteUser();

  if (!storedUser) {
    return null;
  }

  storedUser.user_type = type;
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(storedUser));
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));

  return type;
}

export function resolveWebsiteAccountType(): Promise<WebsiteHubType | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  const storedUser = getStoredWebsiteUser();

  if (!storedUser) {
    return Promise.resolve(null);
  }

  const explicitType = findAccountType(storedUser);

  if (explicitType) {
    return Promise.resolve(explicitType);
  }

  const token = getStoredWebsiteAuthToken();

  if (!token) {
    return Promise.resolve(null);
  }

  if (accountTypeProbeAttempted) {
    return Promise.resolve(findAccountType(storedUser));
  }

  accountTypeProbeAttempted = true;

  const storedEmail = readString(storedUser, "email").trim().toLowerCase();

  return (async () => {
    if (await probeAccountMe(AUTH_API_BASE_URL, token, storedEmail)) {
      return persistResolvedAccountType("developer");
    }

    if (await probeAccountMe(BUSINESS_AUTH_API_BASE_URL, token, storedEmail)) {
      return persistResolvedAccountType("business");
    }

    return null;
  })();
}
