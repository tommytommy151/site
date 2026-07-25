// One-off script: dumps every Netlify Blobs key this app uses into local
// files, so they can be loaded into Postgres on the new host.
//
// Usage:
//   NETLIFY_SITE_ID=... NETLIFY_AUTH_TOKEN=... node scripts/export-netlify-data.mjs
//
// Get NETLIFY_SITE_ID from `.netlify/state.json` (siteId) and
// NETLIFY_AUTH_TOKEN from https://app.netlify.com/user/applications#personal-access-tokens

import { getStore } from "@netlify/blobs";
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const siteID = process.env.NETLIFY_SITE_ID;
const token = process.env.NETLIFY_AUTH_TOKEN;
if (!siteID || !token) {
  console.error("Setează NETLIFY_SITE_ID și NETLIFY_AUTH_TOKEN înainte de a rula acest script.");
  process.exit(1);
}

const outDir = fileURLToPath(new URL("../.netlify-export/", import.meta.url));
const imagesDir = fileURLToPath(new URL("../.netlify-export/images/", import.meta.url));
await mkdir(outDir, { recursive: true });
await mkdir(imagesDir, { recursive: true });

const KV_KEYS = [
  "orders/custom.json",
  "orders/pending.json",
  "analytics/stats.json",
  "catalog/custom.json",
  "products/custom.json",
];

const appData = getStore({ siteID, token, name: "app-data" });

for (const key of KV_KEYS) {
  const data = await appData.get(key, { type: "json" });
  const fileName = key.replace(/\//g, "__") + ".json";
  await writeFile(new URL(fileName, `file://${outDir}/`), JSON.stringify(data ?? {}, null, 2));
  console.log(`Exportat ${key} -> .netlify-export/${fileName}`);
}

const images = getStore({ siteID, token, name: "product-images" });
const { blobs } = await images.list();
const manifest = [];

for (const { key } of blobs) {
  const result = await images.getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) continue;
  await writeFile(new URL(key, `file://${imagesDir}/`), Buffer.from(result.data));
  manifest.push({ key, contentType: result.metadata?.contentType ?? "application/octet-stream" });
  console.log(`Exportat imagine ${key}`);
}

await writeFile(
  new URL("manifest.json", `file://${imagesDir}/`),
  JSON.stringify(manifest, null, 2),
);

console.log(`\nExport complet în .netlify-export/ (${manifest.length} imagini, ${KV_KEYS.length} chei JSON).`);
