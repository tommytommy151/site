import { getStore } from "@netlify/blobs";
import type { Order } from "@/types/order";

const BLOB_KEY = "orders/custom.json";

function store() {
  return getStore("app-data");
}

// Throws on a transient read failure instead of swallowing it, so
// save/delete (read-modify-write) abort rather than overwriting good data
// with an empty set.
async function readAll(): Promise<Record<string, Order>> {
  const data = await store().get(BLOB_KEY, { type: "json", consistency: "strong" });
  return (data as Record<string, Order> | null) ?? {};
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
  await store().setJSON(BLOB_KEY, orders);
}

export async function saveOrder(order: Order) {
  const all = await readAll();
  all[order.id] = order;
  await writeAll(all);
}

export async function deleteOrder(id: string) {
  const all = await readAll();
  if (!(id in all)) return;
  delete all[id];
  if (Object.keys(all).length === 0) {
    await store().delete(BLOB_KEY).catch(() => {});
  } else {
    await writeAll(all);
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const all = await safeReadAll();
  return Object.values(all);
}
