import { Pool } from "pg";

let cached: Pool | null = null;

export function getPool(): Pool {
  if (cached) return cached;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL nu este configurată.");
  }
  cached = new Pool({ connectionString });
  return cached;
}
