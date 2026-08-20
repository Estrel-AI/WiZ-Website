import { HUB_BASE_URL, buildPublicApiUrl } from "@/src/config/public-env";

export const HUB_LOGIN_URL = buildPublicApiUrl(HUB_BASE_URL, "/aistudio/login");

export const AUTH_TOKEN_KEY = "wiizAuthToken";
export const AUTH_USER_KEY = "wiizUserData";
export const AUTH_EVENT_NAME = "wiiz-auth-changed";

export function persistWebsiteLogin(responseData: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  const accessToken =
    typeof responseData.access_token === "string" ? responseData.access_token : "";

  if (!accessToken) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, accessToken);

  const userToStore = {
    email: typeof responseData.email === "string" ? responseData.email : "",
    username: typeof responseData.username === "string" ? responseData.username : "",
    first_name: typeof responseData.first_name === "string" ? responseData.first_name : "",
    display_name: typeof responseData.display_name === "string" ? responseData.display_name : "",
    role: typeof responseData.role === "string" ? responseData.role : "",
    plan: typeof responseData.plan === "string" ? responseData.plan : "",
    org_id: typeof responseData.org_id === "string" ? responseData.org_id : "",
    team_id: typeof responseData.team_id === "string" ? responseData.team_id : "",
    admin_name: typeof responseData.admin_name === "string" ? responseData.admin_name : "",
    zoho_customer_id:
      typeof responseData.zoho_customer_id === "string" ? responseData.zoho_customer_id : "",
  };

  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userToStore));
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
}
