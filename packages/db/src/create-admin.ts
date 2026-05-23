import { hashPassword } from "better-auth/crypto";
import { config } from "dotenv";

config({
	path: `${import.meta.dir}/../../../apps/server/.env.local`,
});

const dbName = process.env.D1_DB_NAME || "zias-database-zias";
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

function q(value: string) {
	return `'${value.replace(/'/g, "''")}'`;
}

function runD1(sql: string) {
	const result = Bun.spawnSync(
		[
			"bunx",
			"wrangler",
			"d1",
			"execute",
			dbName,
			"--remote",
			"--json",
			"--command",
			sql,
		],
		{
			cwd: "../../apps/server",
			stdout: "pipe",
			stderr: "pipe",
		},
	);

	if (result.exitCode !== 0) {
		console.error(Buffer.from(result.stderr).toString());
		process.exit(result.exitCode || 1);
	}

	const stdout = Buffer.from(result.stdout).toString();
	return JSON.parse(stdout) as Array<{
		results?: Array<Record<string, unknown>>;
	}>;
}

const existing = runD1(
	`SELECT id, email FROM user WHERE email = ${q(adminEmail.toLowerCase())} LIMIT 1;`,
);

if (existing[0]?.results?.length) {
	console.log(`Admin user already exists: ${adminEmail}`);
	process.exit(0);
}

const userId = crypto.randomUUID();
const accountId = crypto.randomUUID();
const nowMs = Date.now();
const passwordHash = await hashPassword(adminPassword);

const sql = `
INSERT INTO user (id, name, email, email_verified, image, created_at, updated_at)
VALUES (${q(userId)}, ${q(adminName)}, ${q(adminEmail.toLowerCase())}, 1, NULL, ${nowMs}, ${nowMs});

INSERT INTO account (
  id,
  account_id,
  provider_id,
  user_id,
  access_token,
  refresh_token,
  id_token,
  access_token_expires_at,
  refresh_token_expires_at,
  scope,
  password,
  created_at,
  updated_at
)
VALUES (
  ${q(accountId)},
  ${q(userId)},
  'credential',
  ${q(userId)},
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  ${q(passwordHash)},
  ${nowMs},
  ${nowMs}
);
`;

runD1(sql);
console.log(`Admin user created: ${adminEmail} (${userId})`);
