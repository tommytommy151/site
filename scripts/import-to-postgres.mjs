// One-off script: loads the files produced by export-netlify-data.mjs into
// Postgres (kv_store + product_images). Run migrations/001_init.sql first.
//
// Usage:
//   DATABASE_URL=postgres://user:pass@host:5432/db node scripts/import-to-postgres.mjs

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Setează DATABASE_URL înainte de a rula acest script.");
  process.exit(1);
}

const outDir = fileURLToPath(new URL("../.netlify-export/", import.meta.url));
const imagesDir = fileURLToPath(new URL("../.netlify-export/images/", import.meta.url));

const KV_KEYS = [
  "orders/custom.json",
  "orders/pending.json",
  "analytics/stats.json",
  "catalog/custom.json",
  "products/custom.json",
];

const pool = new pg.Pool({ connectionString });

for (const key of KV_KEYS) {
  const fileName = key.replace(/\//g, "__") + ".json";
  let raw;
  try {
    raw = await readFile(new URL(fileName, `file://${outDir}/`), "utf8");
  } catch {
    console.log(`Lipsește ${fileName}, sar peste.`);
    continue;
  }
  const value = JSON.parse(raw);
  await pool.query(
    `INSERT INTO kv_store (key, value, updated_at) VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
    [key, JSON.stringify(value)],
  );
  console.log(`Importat ${key}`);
}

let manifest = [];
try {
  manifest = JSON.parse(await readFile(new URL("manifest.json", `file://${imagesDir}/`), "utf8"));
} catch {
  console.log("Niciun manifest.json de imagini găsit, sar peste imaginile.");
}

for (const { key, contentType } of manifest) {
  const data = await readFile(new URL(key, `file://${imagesDir}/`));
  await pool.query(
    `INSERT INTO product_images (key, content_type, data) VALUES ($1, $2, $3)
     ON CONFLICT (key) DO NOTHING`,
    [key, contentType, data],
  );
  console.log(`Importată imagine ${key}`);
}

await pool.end();
console.log(`\nImport complet: ${KV_KEYS.length} chei JSON, ${manifest.length} imagini.`);
