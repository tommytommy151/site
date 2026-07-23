import { get, put, del } from "@vercel/blob";
import type { Product } from "@/types/product";

const BLOB_PATHNAME = "products/custom.json";

// Throws on a transient read failure instead of swallowing it, so
// save/delete (read-modify-write) abort rather than overwriting good data
// with an empty set.
async function readAll(): Promise<Record<string, Product>> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  const blob = await get(BLOB_PATHNAME, { access: "private", useCache: false });
  if (!blob) return {};
  const text = await new Response(blob.stream).text();
  return JSON.parse(text) as Record<string, Product>;
}

// Used for page rendering — degrade to "no custom products" on a transient
// blob error instead of crashing the page.
async function safeReadAll(): Promise<Record<string, Product>> {
  try {
    return await readAll();
  } catch {
    return {};
  }
}

async function writeAll(products: Record<string, Product>) {
  await put(BLOB_PATHNAME, JSON.stringify(products), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function saveCustomProduct(product: Product) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const all = await readAll();
  all[product.slug] = product;
  await writeAll(all);
}

export async function deleteCustomProduct(slug: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const all = await readAll();
  if (!(slug in all)) return;
  delete all[slug];
  if (Object.keys(all).length === 0) {
    await del(BLOB_PATHNAME).catch(() => {});
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
