import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getServerEnvFromNames } from "@/src/lib/server-env";

export const SUPPORTED_OAUTH_PROVIDERS = ["google", "github", "linkedin"] as const;

export type OAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

type ProviderConfig = {
  authorizationUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scope: string;
};

type OAuthStatePayload = {
  provider: OAuthProvider;
  state: string;
  intent: string;
  iat?: number;
  exp?: number;
};

type OAuthTokenResponse = {
  access_token: string;
  token_type?: string;
  scope?: string;
};

export type OAuthProfile = {
  provider: OAuthProvider;
  providerId: string;
  email: string | null;
  firstName: string;
  lastName: string;
  name: string;
  usernameHint: string;
  avatarUrl: string | null;
};

const OAUTH_STATE_COOKIE_PREFIX = "wiiz_oauth_state_";

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

function signPayload<T extends Record<string, unknown>>(payload: T) {
  const headerSegment = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadSegment = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${headerSegment}.${payloadSegment}`;
  const signature = createHmac("sha256", getJwtSecret()).update(signingInput).digest();
  return `${signingInput}.${base64UrlEncode(signature)}`;
}

function verifySignedPayload<T>(token: string) {
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
    const payload = JSON.parse(base64UrlDecode(payloadSegment).toString("utf8")) as T & {
      exp?: number;
    };

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getProviderConfig(provider: OAuthProvider): ProviderConfig {
  const callbackUrl = getServerEnvFromNames(
    [`${provider.toUpperCase()}_CALLBACK_URL`],
    "",
  );
  const clientId = getServerEnvFromNames([`${provider.toUpperCase()}_CLIENT_ID`], "");
  const clientSecret = getServerEnvFromNames([`${provider.toUpperCase()}_CLIENT_SECRET`], "");

  if (!callbackUrl || !clientId || !clientSecret) {
    throw new Error(`OAuth is not configured for ${provider}.`);
  }

  if (provider === "google") {
    return {
      authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      clientId,
      clientSecret,
      callbackUrl,
      scope: "openid email profile",
    };
  }

  if (provider === "github") {
    return {
      authorizationUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      clientId,
      clientSecret,
      callbackUrl,
      scope: "read:user user:email",
    };
  }

  return {
    authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    clientId,
    clientSecret,
    callbackUrl,
    scope: "openid profile email",
  };
}

export function isOAuthProvider(value: string): value is OAuthProvider {
  return SUPPORTED_OAUTH_PROVIDERS.includes(value as OAuthProvider);
}

export function getOAuthStateCookieName(provider: OAuthProvider) {
  return `${OAUTH_STATE_COOKIE_PREFIX}${provider}`;
}

export function createOAuthStateToken(provider: OAuthProvider, intent: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: OAuthStatePayload = {
    provider,
    intent,
    state: randomBytes(24).toString("hex"),
    iat: issuedAt,
    exp: issuedAt + 60 * 10,
  };

  return {
    state: payload.state,
    token: signPayload(payload),
  };
}

export function verifyOAuthStateToken(token: string, provider: OAuthProvider, state: string) {
  const payload = verifySignedPayload<OAuthStatePayload>(token);

  if (!payload || payload.provider !== provider || payload.state !== state) {
    return null;
  }

  return payload;
}

export function buildOAuthAuthorizationUrl(provider: OAuthProvider, state: string) {
  const config = getProviderConfig(provider);
  const url = new URL(config.authorizationUrl);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.callbackUrl);
  url.searchParams.set("scope", config.scope);
  url.searchParams.set("state", state);

  if (provider === "google") {
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");
  }

  return url.toString();
}

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

async function exchangeAuthorizationCode(provider: OAuthProvider, code: string) {
  const config = getProviderConfig(provider);
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.callbackUrl,
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const responseData = await parseJsonResponse<OAuthTokenResponse & { error?: string }>(response);

  if (!response.ok || !responseData?.access_token) {
    throw new Error(responseData?.error || `Unable to complete ${provider} authentication.`);
  }

  return responseData;
}

function deriveNames(name: string, firstName?: string | null, lastName?: string | null) {
  const normalizedName = name.trim();
  const normalizedFirstName = (firstName ?? "").trim();
  const normalizedLastName = (lastName ?? "").trim();

  if (normalizedFirstName || normalizedLastName) {
    return {
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      name: `${normalizedFirstName} ${normalizedLastName}`.trim() || normalizedName || "WiiZ User",
    };
  }

  const parts = normalizedName.split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
    name: normalizedName || "WiiZ User",
  };
}

function deriveUsernameHint(email: string | null, fallbackName: string) {
  if (email?.trim()) {
    return email.trim().split("@")[0] || "wiiz-user";
  }

  const sanitized = fallbackName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return sanitized || "wiiz-user";
}

async function fetchGoogleProfile(accessToken: string): Promise<OAuthProfile> {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const data = await parseJsonResponse<{
    sub?: string;
    email?: string;
    given_name?: string;
    family_name?: string;
    name?: string;
    picture?: string;
  }>(response);

  if (!response.ok || !data?.sub) {
    throw new Error("Unable to fetch Google profile.");
  }

  const names = deriveNames(data.name ?? "", data.given_name, data.family_name);

  return {
    provider: "google",
    providerId: data.sub,
    email: data.email?.trim() || null,
    firstName: names.firstName,
    lastName: names.lastName,
    name: names.name,
    usernameHint: deriveUsernameHint(data.email?.trim() || null, names.name),
    avatarUrl: data.picture ?? null,
  };
}

async function fetchGitHubProfile(accessToken: string): Promise<OAuthProfile> {
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "wiiz-website",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  const userData = await parseJsonResponse<{
    id?: number;
    login?: string;
    name?: string;
    email?: string;
    avatar_url?: string;
  }>(userResponse);

  if (!userResponse.ok || !userData?.id) {
    throw new Error("Unable to fetch GitHub profile.");
  }

  let email = userData.email?.trim() || null;

  if (!email) {
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "wiiz-website",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });
    const emails = await parseJsonResponse<
      Array<{ email?: string; primary?: boolean; verified?: boolean }>
    >(emailResponse);

    if (emailResponse.ok && Array.isArray(emails)) {
      email =
        emails.find((entry) => entry.primary && entry.verified)?.email?.trim() ||
        emails.find((entry) => entry.verified)?.email?.trim() ||
        emails[0]?.email?.trim() ||
        null;
    }
  }

  const names = deriveNames(userData.name ?? userData.login ?? "");

  return {
    provider: "github",
    providerId: String(userData.id),
    email,
    firstName: names.firstName,
    lastName: names.lastName,
    name: names.name,
    usernameHint: deriveUsernameHint(email, userData.login ?? names.name),
    avatarUrl: userData.avatar_url ?? null,
  };
}

async function fetchLinkedInProfile(accessToken: string): Promise<OAuthProfile> {
  const openIdResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });
  const openIdData = await parseJsonResponse<{
    sub?: string;
    email?: string;
    given_name?: string;
    family_name?: string;
    name?: string;
    picture?: string;
  }>(openIdResponse);

  if (openIdResponse.ok && openIdData?.sub) {
    const names = deriveNames(openIdData.name ?? "", openIdData.given_name, openIdData.family_name);

    return {
      provider: "linkedin",
      providerId: openIdData.sub,
      email: openIdData.email?.trim() || null,
      firstName: names.firstName,
      lastName: names.lastName,
      name: names.name,
      usernameHint: deriveUsernameHint(openIdData.email?.trim() || null, names.name),
      avatarUrl: openIdData.picture ?? null,
    };
  }

  const profileResponse = await fetch(
    "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName)",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      cache: "no-store",
    },
  );
  const profileData = await parseJsonResponse<{
    id?: string;
    localizedFirstName?: string;
    localizedLastName?: string;
  }>(profileResponse);

  if (!profileResponse.ok || !profileData?.id) {
    throw new Error("Unable to fetch LinkedIn profile.");
  }

  const emailResponse = await fetch(
    "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      cache: "no-store",
    },
  );
  const emailData = await parseJsonResponse<{
    elements?: Array<{
      "handle~"?: {
        emailAddress?: string;
      };
    }>;
  }>(emailResponse);

  const email =
    emailData?.elements?.[0]?.["handle~"]?.emailAddress?.trim() || null;
  const firstName = profileData.localizedFirstName?.trim() || "";
  const lastName = profileData.localizedLastName?.trim() || "";
  const name = `${firstName} ${lastName}`.trim() || "WiiZ User";

  return {
    provider: "linkedin",
    providerId: profileData.id,
    email,
    firstName,
    lastName,
    name,
    usernameHint: deriveUsernameHint(email, name),
    avatarUrl: null,
  };
}

async function fetchOAuthProfile(provider: OAuthProvider, accessToken: string) {
  if (provider === "google") {
    return fetchGoogleProfile(accessToken);
  }

  if (provider === "github") {
    return fetchGitHubProfile(accessToken);
  }

  return fetchLinkedInProfile(accessToken);
}

export async function getOAuthProfileFromCode(provider: OAuthProvider, code: string) {
  const tokenResponse = await exchangeAuthorizationCode(provider, code);
  return fetchOAuthProfile(provider, tokenResponse.access_token);
}
