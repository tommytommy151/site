import { get, put } from "@vercel/blob";
import type { Attribute, Brand, Category } from "@/types/product";

export interface CatalogSnapshot {
  categories: Category[];
  brands: Brand[];
  attributes: Attribute[];
}

const BLOB_PATHNAME = "catalog/custom.json";

export async function readCatalogSnapshot(): Promise<CatalogSnapshot | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const blob = await get(BLOB_PATHNAME, { access: "private", useCache: false });
    if (!blob) return null;
    const text = await new Response(blob.stream).text();
    return JSON.parse(text) as CatalogSnapshot;
  } catch {
    // Read-only lookup used for page rendering — degrade to defaults on a
    // transient blob error instead of crashing the page.
    return null;
  }
}

export async function writeCatalogSnapshot(snapshot: CatalogSnapshot) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  await put(BLOB_PATHNAME, JSON.stringify(snapshot), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
