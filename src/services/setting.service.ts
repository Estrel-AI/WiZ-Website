import { apiGet } from "./api-client";
import type { AppSetting } from "../types/common.types";

export async function fetchSettings() {
  return apiGet<AppSetting[]>("/api/settings");
}
