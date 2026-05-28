/**
 * Seed wrapper for admin account creation.
 *
 * Email/password sign-up is disabled in Better Auth, so the old API-based
 * seeding flow no longer works. We use direct D1 writes with Better Auth's
 * own password hashing (via create-admin.ts).
 *
 * Required env vars:
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 * Optional:
 *   ADMIN_NAME (default: "Admin")
 *   D1_DB_NAME (default: "zias-database-zias")
 */

await import("./create-admin");
