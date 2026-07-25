import { getPool } from "@/lib/db/pool";

// Drop-in replacement for the Netlify Blobs get/setJSON/delete calls the
// storage modules used to make directly — same key strings, same semantics
// (missing key -> null), so the read-modify-write logic above this layer
// (saveOrder, recordPageview, etc.) didn't need to change.
export async function getJSON<T>(key: string): Promise<T | null> {
  const { rows } = await getPool().query<{ value: T }>(
    "SELECT value FROM kv_store WHERE key = $1",
    [key],
  );
  return rows[0]?.value ?? null;
}

export async function setJSON(key: string, value: unknown): Promise<void> {
  await getPool().query(
    `INSERT INTO kv_store (key, value, updated_at) VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
    [key, JSON.stringify(value)],
  );
}

export async function deleteKey(key: string): Promise<void> {
  await getPool().query("DELETE FROM kv_store WHERE key = $1", [key]);
}
