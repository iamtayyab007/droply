import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });
if (!process.env.DATABASE_URL!) {
  throw new Error("Database url is not set in the .env");
}
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "__drizzle_migration",
    schema: "public",
  },
  verbose: true,
  strict: true,
});
