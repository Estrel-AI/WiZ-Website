import { promises as fs } from "node:fs";
import path from "node:path";
import {
  IMPACT_IMAGE_MAX_SIZE_BYTES,
  IMPACT_IMAGE_MAX_SIZE_MB,
  IMPACT_VIDEO_MAX_SIZE_BYTES,
  IMPACT_VIDEO_MAX_SIZE_MB,
} from "@/src/lib/admin-media-constraints";

export type MediaFolder = "hero" | "impact" | "blog" | "feature";

const MEDIA_ROOT = path.join(process.cwd(), "backend");
const ALLOWED_FOLDERS: ReadonlySet<MediaFolder> = new Set(["hero", "impact", "blog", "feature"]);
const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/ogg": ".ogv",
  "video/quicktime": ".mov",
};

function sanitizeExtension(extension: string) {
  const normalized = extension.trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  return normalized.startsWith(".") ? normalized : `.${normalized}`;
}

function resolveExtension(file: File) {
  const fromName = sanitizeExtension(path.extname(file.name));
  if (fromName) {
    return fromName;
  }

  const fromMime = MIME_EXTENSION_MAP[file.type];
  if (fromMime) {
    return fromMime;
  }

  throw new Error("Unsupported file type.");
}

function validateFolder(value: string): MediaFolder {
  if (ALLOWED_FOLDERS.has(value as MediaFolder)) {
    return value as MediaFolder;
  }

  throw new Error("folder must be one of hero, impact, blog, or feature.");
}

function validateMediaFile(file: File) {
  if (!(file.type.startsWith("image/") || file.type.startsWith("video/"))) {
    throw new Error("Only image and video files are allowed.");
  }

  if (file.type.startsWith("image/") && file.size > IMPACT_IMAGE_MAX_SIZE_BYTES) {
    throw new Error(`Image size must be ${IMPACT_IMAGE_MAX_SIZE_MB} MB or less.`);
  }

  if (file.type.startsWith("video/") && file.size > IMPACT_VIDEO_MAX_SIZE_BYTES) {
    throw new Error(`Video size must be ${IMPACT_VIDEO_MAX_SIZE_MB} MB or less.`);
  }
}

function validateRowId(value: string) {
  const rowId = Number(value);

  if (!Number.isInteger(rowId) || rowId <= 0) {
    throw new Error("rowId must be a positive integer.");
  }

  return rowId;
}

async function removePreviousVersions(directory: string, rowId: number) {
  const filePrefix = `${rowId}.`;
  const entries = await fs.readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.startsWith(filePrefix))
      .map((entry) => fs.unlink(path.join(directory, entry.name))),
  );
}

export function getMediaDirectory(folder: MediaFolder) {
  return path.join(MEDIA_ROOT, folder);
}

export function getRelativeMediaPath(folder: MediaFolder, fileName: string) {
  return `${folder}/${fileName}`;
}

export async function saveAdminMediaFile(input: {
  folder: string;
  rowId: string;
  file: File;
}) {
  const folder = validateFolder(input.folder);
  const rowId = validateRowId(input.rowId);
  const file = input.file;

  validateMediaFile(file);

  const extension = resolveExtension(file);
  const fileName = `${rowId}${extension}`;
  const uploadDirectory = getMediaDirectory(folder);
  const absolutePath = path.join(uploadDirectory, fileName);
  const filePath = getRelativeMediaPath(folder, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(uploadDirectory, { recursive: true });
  await removePreviousVersions(uploadDirectory, rowId);
  await fs.writeFile(absolutePath, buffer);

  return {
    folder,
    rowId,
    fileName,
    filePath,
    absolutePath,
  };
}
