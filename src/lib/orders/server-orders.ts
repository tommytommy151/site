import { getJSON, setJSON, deleteKey } from "@/lib/db/kv-store";
import type { Order } from "@/types/order";

const BLOB_KEY = "orders/custom.json";

// Throws on a transient read failure instead of swallowing it, so
// save/delete (read-modify-write) abort rather than overwriting good data
// with an empty set.
async function readAll(): Promise<Record<string, Order>> {
  try {
    return (await getJSON<Record<string, Order>>(BLOB_KEY)) ?? {};
  } catch (err) {
    console.error("[orders] readAll failed:", err);
    throw err;
  }
}

// Used for page rendering — degrade to "no orders" on a transient DB
// error instead of crashing the page.
async function safeReadAll(): Promise<Record<string, Order>> {
  try {
    return await readAll();
  } catch {
    return {};
  }
}

async function writeAll(orders: Record<string, Order>) {
  try {
    await setJSON(BLOB_KEY, orders);
  } catch (err) {
    console.error("[orders] writeAll failed:", err);
    throw err;
  }
}

export async function saveOrder(order: Order) {
  console.log("[orders] saveOrder start", order.id);
  const all = await readAll();
  all[order.id] = order;
  await writeAll(all);
  console.log("[orders] saveOrder done", order.id);
}

export async function deleteOrder(id: string) {
  const all = await readAll();
  if (!(id in all)) return;
  delete all[id];
  if (Object.keys(all).length === 0) {
    await deleteKey(BLOB_KEY);
  } else {
    await writeAll(all);
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const all = await safeReadAll();
  return Object.values(all);
}
