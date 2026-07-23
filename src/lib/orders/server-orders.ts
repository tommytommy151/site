import { get, put, del } from "@vercel/blob";
import type { Order } from "@/types/order";

const BLOB_PATHNAME = "orders/custom.json";

// Throws on a transient read failure instead of swallowing it, so
// save/delete (read-modify-write) abort rather than overwriting good data
// with an empty set.
async function readAll(): Promise<Record<string, Order>> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  const blob = await get(BLOB_PATHNAME, { access: "private", useCache: false });
  if (!blob) return {};
  const text = await new Response(blob.stream).text();
  return JSON.parse(text) as Record<string, Order>;
}

// Used for page rendering — degrade to "no orders" on a transient blob
// error instead of crashing the page.
async function safeReadAll(): Promise<Record<string, Order>> {
  try {
    return await readAll();
  } catch {
    return {};
  }
}

async function writeAll(orders: Record<string, Order>) {
  await put(BLOB_PATHNAME, JSON.stringify(orders), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function saveOrder(order: Order) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const all = await readAll();
  all[order.id] = order;
  await writeAll(all);
}

export async function deleteOrder(id: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const all = await readAll();
  if (!(id in all)) return;
  delete all[id];
  if (Object.keys(all).length === 0) {
    await del(BLOB_PATHNAME).catch(() => {});
  } else {
    await writeAll(all);
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const all = await safeReadAll();
  return Object.values(all);
}
