import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";

// Applies pending SQL migrations from /migrations. Runs during the Vercel build,
// so a failed migration fails the deploy instead of breaking the live site.
async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("[migrate] DATABASE_URL not set, skipping database migrations");
    return;
  }

  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  try {
    await migrate(drizzle(pool), {
      migrationsFolder: path.resolve(import.meta.dirname, "..", "migrations"),
    });
    console.log("[migrate] database is up to date");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("[migrate] failed:", error);
  process.exit(1);
});
