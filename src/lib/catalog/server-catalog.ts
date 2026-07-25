import { getJSON, setJSON } from "@/lib/db/kv-store";
import type { Attribute, Brand, Category } from "@/types/product";

export interface CatalogSnapshot {
  categories: Category[];
  brands: Brand[];
  attributes: Attribute[];
}

const BLOB_KEY = "catalog/custom.json";

export async function readCatalogSnapshot(): Promise<CatalogSnapshot | null> {
  try {
    return await getJSON<CatalogSnapshot>(BLOB_KEY);
  } catch {
    // Read-only lookup used for page rendering — degrade to defaults on a
    // transient DB error instead of crashing the page.
    return null;
  }
}

export async function writeCatalogSnapshot(snapshot: CatalogSnapshot) {
  await setJSON(BLOB_KEY, snapshot);
}
