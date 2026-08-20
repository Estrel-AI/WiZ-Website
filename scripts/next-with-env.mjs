import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const [, , nextCommand, targetEnv = "local", ...nextArgs] = process.argv;

if (!nextCommand) {
  console.error("Usage: node scripts/next-with-env.mjs <dev|build|start> [local|testing|production]");
  process.exit(1);
}

const projectRoot = process.cwd();
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
const shellEnvKeys = new Set(Object.keys(process.env));

function parseEnvFile(fileContents) {
  const values = {};

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

function loadEnvFile(relativePath) {
  const fullPath = path.join(projectRoot, relativePath);

  if (!existsSync(fullPath)) {
    return;
  }

  const envValues = parseEnvFile(readFileSync(fullPath, "utf8"));

  for (const [key, value] of Object.entries(envValues)) {
    if (shellEnvKeys.has(key)) {
      continue;
    }

    process.env[key] = value;
  }
}

function getEnvFiles(command, envName) {
  if (command === "dev") {
    return [".env.dev", ".env.local"];
  }

  if (envName === "testing") {
    return [".env.dev"];
  }

  if (envName === "production") {
    return [".env"];
  }

  return [".env.local"];
}

for (const envFile of getEnvFiles(nextCommand, targetEnv)) {
  loadEnvFile(envFile);
}

process.env.APP_ENV = targetEnv;

if (nextCommand === "dev") {
  process.env.NODE_ENV = "development";
} else if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

const child = spawn(process.execPath, [nextBin, nextCommand, ...nextArgs], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
