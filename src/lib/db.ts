import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/schema/tables";
import * as relations from "@/schema/relations";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

/**
 * Typed Drizzle ORM database client.
 * Includes all schema tables and relations for type-safe queries.
 */
export const db = drizzle(client, {
  schema: { ...schema, ...relations },
});

export type Database = typeof db;
