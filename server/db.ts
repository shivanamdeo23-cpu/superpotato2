import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use HTTP client instead of websocket for better compatibility
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// For backward compatibility, also export pool as db
export const pool = db;