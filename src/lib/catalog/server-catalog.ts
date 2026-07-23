import { getStore } from "@netlify/blobs";
import type { Attribute, Brand, Category } from "@/types/product";

export interface CatalogSnapshot {
  categories: Category[];
  brands: Brand[];
  attributes: Attribute[];
}

const BLOB_KEY = "catalog/custom.json";

function store() {
  return getStore("app-data");
}

export async function readCatalogSnapshot(): Promise<CatalogSnapshot | null> {
  try {
    const data = await store().get(BLOB_KEY, { type: "json", consistency: "strong" });
    return (data as CatalogSnapshot | null) ?? null;
  } catch {
    // Read-only lookup used for page rendering — degrade to defaults on a
    // transient blob error instead of crashing the page.
    return null;
  }
}

export async function writeCatalogSnapshot(snapshot: CatalogSnapshot) {
  await store().setJSON(BLOB_KEY, snapshot);
}
