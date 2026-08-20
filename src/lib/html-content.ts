export function stripHtml(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasMeaningfulHtml(value: string | null | undefined) {
  return stripHtml(value).length > 0;
}

export function normalizeRichHtml(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value
    .replace(/<span[^>]*class="[^"]*\bql-ui\b[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "");
}
