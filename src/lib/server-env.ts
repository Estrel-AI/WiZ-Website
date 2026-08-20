import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

declare global {
  var __wiizBackendEnvCache: Record<string, string> | undefined;
}

function parseEnvFile(fileContents: string) {
  const values: Record<string, string> = {};

  for (const rawLine of fileContents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function readBackendEnvFile() {
  if (global.__wiizBackendEnvCache) {
    return global.__wiizBackendEnvCache;
  }

  const envPath = path.join(process.cwd(), "backend", ".env");

  if (!existsSync(envPath)) {
    global.__wiizBackendEnvCache = {};
    return global.__wiizBackendEnvCache;
  }

  global.__wiizBackendEnvCache = parseEnvFile(readFileSync(envPath, "utf8"));
  return global.__wiizBackendEnvCache;
}

export function getServerEnv(name: string, fallback = "") {
  const runtimeValue = process.env[name];

  if (runtimeValue && runtimeValue.trim()) {
    return runtimeValue.trim();
  }

  const backendValue = readBackendEnvFile()[name];

  if (backendValue && backendValue.trim()) {
    return backendValue.trim();
  }

  return fallback;
}

export function getServerEnvFromNames(names: string | string[], fallback = "") {
  const candidates = Array.isArray(names) ? names : [names];

  for (const name of candidates) {
    const value = getServerEnv(name);

    if (value) {
      return value;
    }
  }

  return fallback;
}

export function getServerNumberEnv(names: string | string[], fallback: number) {
  const value = getServerEnvFromNames(names, String(fallback));
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}
