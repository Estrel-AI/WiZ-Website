import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getMediaDirectory } from "@/src/lib/admin-media";

const MIME_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".ogv": "video/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

function isAllowedFolder(folder: string): folder is "hero" | "impact" | "blog" | "feature" {
  return folder === "hero" || folder === "impact" || folder === "blog" || folder === "feature";
}

function isSafeFileName(fileName: string) {
  return /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(fileName);
}

async function resolveExistingMediaPath(folder: "hero" | "impact" | "blog" | "feature", fileName: string) {
  const mediaDirectory = getMediaDirectory(folder);
  const directPath = path.join(mediaDirectory, fileName);

  if (existsSync(directPath)) {
    return {
      absolutePath: directPath,
      resolvedFileName: fileName,
    };
  }

  const extension = path.extname(fileName);
  const baseName = path.basename(fileName, extension);

  if (!baseName) {
    return null;
  }

  // Some stored media paths keep an older extension like `1.jpg` after a later
  // upload replaced that asset with `1.png` or `1.webp`. Fall back to the same
  // base filename so existing records keep working even when the extension drifts.
  const entries = await readdir(mediaDirectory, { withFileTypes: true }).catch(() => []);
  const matchingEntry = entries.find((entry) => {
    if (!entry.isFile()) {
      return false;
    }

    const entryExtension = path.extname(entry.name);
    const entryBaseName = path.basename(entry.name, entryExtension);
    return entryBaseName === baseName;
  });

  if (!matchingEntry) {
    return null;
  }

  return {
    absolutePath: path.join(mediaDirectory, matchingEntry.name),
    resolvedFileName: matchingEntry.name,
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ folder: string; fileName: string }> },
) {
  const { folder, fileName } = await context.params;

  if (!isAllowedFolder(folder) || !isSafeFileName(fileName)) {
    return new Response("Not found", { status: 404 });
  }

  const resolvedMedia = await resolveExistingMediaPath(folder, fileName);
  if (!resolvedMedia) {
    return new Response("Not found", { status: 404 });
  }

  const extension = path.extname(resolvedMedia.resolvedFileName).toLowerCase();
  const contentType = MIME_TYPES[extension] ?? "application/octet-stream";

  const fileBuffer = await readFile(resolvedMedia.absolutePath);

  return new Response(fileBuffer, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": contentType,
    },
  });
}

