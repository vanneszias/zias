import { Database } from "bun:sqlite";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";

import { hashPassword } from "./password";

config({
  path: `${import.meta.dir}/../../../apps/server/.env.local`,
});

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME || "Admin";

if (!adminEmail) {
  console.error("Missing ADMIN_EMAIL env var");
  process.exit(1);
}

if (!adminPassword) {
  console.error("Missing ADMIN_PASSWORD env var");
  process.exit(1);
}

const d1Dir = join(
  import.meta.dir,
  "../../../.alchemy/miniflare/v3/d1/miniflare-D1DatabaseObject",
);

const sqliteFiles = readdirSync(d1Dir).filter((f) => f.endsWith(".sqlite"));

if (sqliteFiles.length === 0) {
  console.error(`No local D1 SQLite file found in ${d1Dir}`);
  console.error("Make sure the dev server has been started at least once.");
  process.exit(1);
}

if (sqliteFiles.length > 1) {
  console.warn(`Multiple SQLite files found, using: ${sqliteFiles[0]}`);
}

const dbPath = join(d1Dir, sqliteFiles[0]);
console.log(`Using local D1: ${dbPath}`);

const db = new Database(dbPath);

const existing = db
  .query("SELECT id FROM user WHERE email = ? LIMIT 1")
  .get(adminEmail.toLowerCase()) as { id: string } | null;

const passwordHash = await hashPassword(adminPassword);

if (existing) {
  db.run(
    "UPDATE account SET password = ?, updated_at = ? WHERE user_id = ? AND provider_id = 'credential'",
    [passwordHash, Date.now(), existing.id],
  );
  db.close();
  console.log(`Local admin password updated: ${adminEmail}`);
  process.exit(0);
}

const userId = crypto.randomUUID();
const accountId = crypto.randomUUID();
const nowMs = Date.now();

db.run(
  "INSERT INTO user (id, name, email, email_verified, image, created_at, updated_at) VALUES (?, ?, ?, 1, NULL, ?, ?)",
  [userId, adminName, adminEmail.toLowerCase(), nowMs, nowMs],
);

db.run(
  `INSERT INTO account (
		id, account_id, provider_id, user_id,
		access_token, refresh_token, id_token,
		access_token_expires_at, refresh_token_expires_at,
		scope, password, created_at, updated_at
	) VALUES (?, ?, 'credential', ?, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?, ?)`,
  [accountId, userId, userId, passwordHash, nowMs, nowMs],
);

db.close();
console.log(`Local admin user created: ${adminEmail} (${userId})`);
