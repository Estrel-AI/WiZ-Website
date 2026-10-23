/**
 * Database Migration Runner
 * Usage:
 *   node scripts/run-migration.js                    # Run all migrations in database/migrations
 *   node scripts/run-migration.js <migration-file>   # Run a specific migration file
 */
import mysql from "mysql2/promise";
import { existsSync, readdirSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Load env files in priority order
function loadEnv() {
  const envCandidates = [
    join(projectRoot, ".env.local"),
    join(projectRoot, ".env.dev"),
    join(projectRoot, ".env"),
  ];

  for (const envPath of envCandidates) {
    if (!existsSync(envPath)) continue;
    try {
      const content = readFileSync(envPath, "utf-8");
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex > 0) {
          const key = trimmed.substring(0, eqIndex).trim();
          let value = trimmed.substring(eqIndex + 1).trim();
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    } catch {
      // Ignore reading error, fallback to process.env
    }
  }
}

loadEnv();

const DB_CONFIG = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQL_USER || process.env.DB_USER || "root",
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || "wiiz_website",
  multipleStatements: true,
};

function splitSqlStatements(sqlContent) {
  // Strip block comments
  let clean = sqlContent.replace(/\/\*[\s\S]*?\*\//g, "");
  const lines = clean.split(/\r?\n/);
  const statements = [];
  let current = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("--") || trimmed.startsWith("#")) {
      continue;
    }
    current += line + "\n";
    if (trimmed.endsWith(";")) {
      const stmt = current.trim();
      if (stmt && stmt !== ";") {
        statements.push(stmt);
      }
      current = "";
    }
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements;
}

async function executeMigrationFile(connection, filePath, fileName) {
  console.log(`\n========================================`);
  console.log(`Running migration: ${fileName}`);
  console.log(`========================================`);

  const sql = readFileSync(filePath, "utf-8");
  const statements = splitSqlStatements(sql);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.replace(/\s+/g, " ").substring(0, 80);
    try {
      await connection.query(statement);
      console.log(`  [OK] Statement ${i + 1}/${statements.length}: ${preview}...`);
    } catch (error) {
      const msg = error.message || "";
      if (
        error.code === "ER_DUP_FIELDNAME" ||
        error.errno === 1060 ||
        msg.includes("Duplicate column")
      ) {
        console.log(`  [SKIP] Column already exists: ${preview}...`);
      } else if (
        error.code === "ER_DUP_KEYNAME" ||
        error.errno === 1061 ||
        msg.includes("Duplicate key")
      ) {
        console.log(`  [SKIP] Index/key already exists: ${preview}...`);
      } else if (
        error.code === "ER_TABLE_EXISTS_ERROR" ||
        error.errno === 1050 ||
        msg.includes("already exists")
      ) {
        console.log(`  [SKIP] Table already exists: ${preview}...`);
      } else {
        console.error(`  [FAIL] Statement ${i + 1} failed: ${preview}...`);
        console.error(`         Error: ${msg}`);
        throw error;
      }
    }
  }

  console.log(`Completed: ${fileName}`);
}

async function runMigrations() {
  const migrationsDir = join(projectRoot, "database", "migrations");
  const targetArg = process.argv[2];

  let filesToRun = [];

  if (targetArg) {
    const singlePath = targetArg.includes("/") || targetArg.includes("\\")
      ? targetArg
      : join(migrationsDir, targetArg);

    if (!existsSync(singlePath)) {
      console.error(`Migration file not found: ${singlePath}`);
      process.exit(1);
    }
    filesToRun = [{ path: singlePath, name: targetArg }];
  } else {
    if (!existsSync(migrationsDir)) {
      console.error(`Migrations directory not found: ${migrationsDir}`);
      process.exit(1);
    }

    const allFiles = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    filesToRun = allFiles.map((f) => ({
      path: join(migrationsDir, f),
      name: f,
    }));
  }

  console.log(`Connecting to MySQL database "${DB_CONFIG.database}" on ${DB_CONFIG.host}:${DB_CONFIG.port} as "${DB_CONFIG.user}"...`);
  const connection = await mysql.createConnection(DB_CONFIG);

  try {
    for (const file of filesToRun) {
      await executeMigrationFile(connection, file.path, file.name);
    }
    console.log(`\nAll migrations executed successfully!`);
  } catch (error) {
    console.error(`\nMigration process aborted due to error.`);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigrations();
