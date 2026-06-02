import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../configs/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
  try {
    console.log("🔄 Running migrations...");
    // This will run all .sql files in the migrations folder
    await migrate(db, {
      migrationsFolder: path.join(__dirname, "../migrations"),
    });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Call this from your server startup
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
