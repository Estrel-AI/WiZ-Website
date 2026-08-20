import { executeStatement } from "@/src/lib/mysql";
import type { CookieConsentDecision } from "@/src/types/admin-api";

export async function createCookieConsentEvent(input: {
  anonymousId: string;
  decision: CookieConsentDecision;
  version: string;
  timestamp: string;
  pagePath: string | null;
  ipAddress: string | null;
  userAgent: string | null;
}) {
  await executeStatement(
    `INSERT INTO cookie_consent_events (
      anonymous_id,
      decision,
      consent_version,
      accepted_at,
      page_path,
      ip_address,
      user_agent
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.anonymousId,
      input.decision,
      input.version,
      new Date(input.timestamp),
      input.pagePath,
      input.ipAddress,
      input.userAgent,
    ],
  );
}
