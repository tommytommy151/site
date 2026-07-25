import { getJSON, setJSON, deleteKey } from "@/lib/db/kv-store";
import type { Product } from "@/types/product";

const BLOB_KEY = "products/custom.json";

// Throws on a transient read failure instead of swallowing it, so
// save/delete (read-modify-write) abort rather than overwriting good data
// with an empty set.
async function readAll(): Promise<Record<string, Product>> {
  return (await getJSON<Record<string, Product>>(BLOB_KEY)) ?? {};
}

// Used for page rendering — degrade to "no custom products" on a transient
// DB error instead of crashing the page.
async function safeReadAll(): Promise<Record<string, Product>> {
  try {
    return await readAll();
  } catch {
    return {};
  }
}

async function writeAll(products: Record<string, Product>) {
  await setJSON(BLOB_KEY, products);
}

export async function saveCustomProduct(product: Product) {
  const all = await readAll();
  all[product.slug] = product;
  await writeAll(all);
}

export async function deleteCustomProduct(slug: string) {
  const all = await readAll();
  if (!(slug in all)) return;
  delete all[slug];
  if (Object.keys(all).length === 0) {
    await deleteKey(BLOB_KEY);
  } else {
    await writeAll(all);
  }
}

export async function getCustomProduct(slug: string): Promise<Product | null> {
  const all = await safeReadAll();
  return all[slug] ?? null;
}

export async function getAllCustomProducts(): Promise<Product[]> {
  const all = await safeReadAll();
  return Object.values(all);
}
