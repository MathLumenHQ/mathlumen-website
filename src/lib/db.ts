import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/schema/tables";
import * as powSchema from "@/schema/pow-tables";
import * as relations from "@/schema/relations";
import { env } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var __mathlumenPostgresClient: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__mathlumenPostgresClient ??
  postgres(env.DATABASE_URL, {
    max: 20,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

if (!globalThis.__mathlumenPostgresClient) {
  globalThis.__mathlumenPostgresClient = client;
}

/**
 * Typed Drizzle ORM database client.
 * Includes all schema tables and relations for type-safe queries.
 */
export const db = drizzle(client, {
  schema: { ...schema, ...powSchema, ...relations },
});

export type Database = typeof db;
