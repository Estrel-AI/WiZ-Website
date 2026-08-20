const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_COMMENTS = /<!--[\s\S]*?-->/g;
const DANGEROUS_BLOCKS = /<(script|style|iframe|object|embed|svg|math|noscript|template)[^>]*>[\s\S]*?<\/\1>/gi;
const DANGEROUS_SELF_CLOSING = /<(script|style|iframe|object|embed|svg|math|noscript|template|meta|link|base)[^>]*\/?>/gi;
const TAG_REGEX = /<\/?([a-zA-Z0-9-]+)([^>]*)>/g;
const ATTRIBUTE_REGEX = /([^\s=<>"'`/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

const ALLOWED_RICH_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "span",
]);

const ALLOWED_ALIGN_CLASSES = new Set([
  "ql-align-center",
  "ql-align-right",
  "ql-align-justify",
]);

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function encodeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stripDangerousMarkup(value: string) {
  return value
    .replace(CONTROL_CHARACTERS, "")
    .replace(HTML_COMMENTS, "")
    .replace(DANGEROUS_BLOCKS, "")
    .replace(DANGEROUS_SELF_CLOSING, "");
}

function sanitizeClassAttribute(value: string) {
  const safeClasses = value
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => ALLOWED_ALIGN_CLASSES.has(item));

  return safeClasses.join(" ");
}

function sanitizeHref(value: string) {
  const normalized = decodeHtmlEntities(value).trim();
  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("/") || normalized.startsWith("#")) {
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

export function sanitizePlainText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return decodeHtmlEntities(
    stripDangerousMarkup(value)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

export function sanitizeNullablePlainText(value: string | null | undefined) {
  const sanitized = sanitizePlainText(value);
  return sanitized || null;
}

export function sanitizeFormTextInput(
  value: string | null | undefined,
  options?: { preserveLineBreaks?: boolean; trim?: boolean },
) {
  if (!value) {
    return "";
  }

  const stripped = decodeHtmlEntities(
    stripDangerousMarkup(value).replace(/<[^>]+>/g, " "),
  );
  const shouldTrim = options?.trim ?? true;

  if (options?.preserveLineBreaks) {
    const normalized = stripped
      .replace(/\r\n?/g, "\n")
      .replace(/[^\S\n]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .split("\n")
      .map((line) => (shouldTrim ? line.trim() : line))
      .join("\n");

    return shouldTrim ? normalized.trim() : normalized;
  }

  const normalized = stripped.replace(/\s+/g, " ");
  return shouldTrim ? normalized.trim() : normalized;
}

export function sanitizeEmailInput(value: string | null | undefined) {
  return sanitizeFormTextInput(value).replace(/\s+/g, "");
}

export function sanitizePhoneInput(value: string | null | undefined) {
  return sanitizeFormTextInput(value).replace(/[^\d+\s()-]/g, "").trim();
}

export function sanitizeWebsiteInput(value: string | null | undefined) {
  return sanitizeFormTextInput(value).replace(/\s+/g, "");
}

export function sanitizeRichHtml(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const source = stripDangerousMarkup(value).replace(
    /<span[^>]*class="[^"]*\bql-ui\b[^"]*"[^>]*>[\s\S]*?<\/span>/gi,
    "",
  );

  const sanitized = source.replace(TAG_REGEX, (fullMatch, rawTagName: string, rawAttributes: string) => {
    const tagName = rawTagName.toLowerCase();
    const isClosingTag = fullMatch.startsWith("</");

    if (!ALLOWED_RICH_TAGS.has(tagName)) {
      return "";
    }

    if (isClosingTag) {
      return `</${tagName}>`;
    }

    if (tagName === "br") {
      return "<br>";
    }

    const safeAttributes: string[] = [];
    let match: RegExpExecArray | null = null;

    ATTRIBUTE_REGEX.lastIndex = 0;
    while ((match = ATTRIBUTE_REGEX.exec(rawAttributes)) !== null) {
      const attributeName = match[1].toLowerCase();
      const attributeValue = match[2] ?? match[3] ?? match[4] ?? "";

      if (attributeName.startsWith("on")) {
        continue;
      }

      if (attributeName === "style" || attributeName === "src" || attributeName === "srcdoc") {
        continue;
      }

      if (attributeName === "class" && ["p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "span"].includes(tagName)) {
        const safeClassValue = sanitizeClassAttribute(attributeValue);
        if (safeClassValue) {
          safeAttributes.push(`class="${encodeHtmlAttribute(safeClassValue)}"`);
        }
        continue;
      }

      if (tagName === "a" && attributeName === "href") {
        const safeHref = sanitizeHref(attributeValue);
        if (safeHref) {
          safeAttributes.push(`href="${encodeHtmlAttribute(safeHref)}"`);
        }
        continue;
      }

      if (tagName === "a" && attributeName === "target") {
        if (attributeValue === "_blank") {
          safeAttributes.push('target="_blank"');
          safeAttributes.push('rel="noopener noreferrer"');
        }
        continue;
      }
    }

    const attributeSuffix = safeAttributes.length ? ` ${safeAttributes.join(" ")}` : "";
    return `<${tagName}${attributeSuffix}>`;
  });

  return sanitized
    .replace(/<p>\s*<\/p>/gi, "<p><br></p>")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizeNullableRichHtml(value: string | null | undefined) {
  const sanitized = sanitizeRichHtml(value);
  return sanitized || null;
}

export function sanitizeExternalOrRelativeUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  if (/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9._-]+)+$/.test(normalized)) {
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
}
