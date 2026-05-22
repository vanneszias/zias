/**
 * Seed script: creates the default admin account.
 *
 * Reads credentials from apps/server/.env.
 *
 * Usage (with alchemy dev running):
 *   bun db:seed
 *
 * Env vars required (in apps/server/.env):
 *   BETTER_AUTH_URL  - base URL of the running server (e.g. http://localhost:3000)
 *   ADMIN_EMAIL      - email for the admin account
 *   ADMIN_PASSWORD   - password for the admin account
 */
import { config } from "dotenv";
import { fileURLToPath } from "node:url";

config({ path: fileURLToPath(new URL("../../../apps/server/.env", import.meta.url)) });

const serverUrl = process.env.BETTER_AUTH_URL;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!serverUrl) {
	console.error("Missing BETTER_AUTH_URL in apps/server/.env");
	process.exit(1);
}
if (!email) {
	console.error("Missing ADMIN_EMAIL in apps/server/.env");
	process.exit(1);
}
if (!password) {
	console.error("Missing ADMIN_PASSWORD in apps/server/.env");
	process.exit(1);
}

console.log(`Seeding admin account: ${email}`);

const res = await fetch(`${serverUrl}/api/auth/sign-up/email`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Origin: serverUrl,
	},
	body: JSON.stringify({ email, password, name: "Admin" }),
});

const body = (await res.json()) as { user?: { id: string }; code?: string; message?: string };

if (res.ok) {
	console.log(`Admin account created (id: ${body.user?.id})`);
	process.exit(0);
}

// 422 Unprocessable Entity or a "user already exists" message = already seeded
const message = body.message ?? "";
if (
	res.status === 422 ||
	message.toLowerCase().includes("already") ||
	message.toLowerCase().includes("exists")
) {
	console.log("Admin account already exists — skipping.");
	process.exit(0);
}

// Anything else is an unexpected error
console.error(`Sign-up failed (${res.status}): ${JSON.stringify(body)}`);
process.exit(1);
