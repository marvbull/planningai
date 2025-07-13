import { defineConfig } from "drizzle-kit";
import { env } from "@/env"; // oder `dotenv/config` bei Bedarf

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
