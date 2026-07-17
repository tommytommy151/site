import { get, put, del } from "@vercel/blob";
import type { Order } from "@/types/order";

const BLOB_PATHNAME = "orders/custom.json";

async function readAll(): Promise<Record<string, Order>> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const blob = await get(BLOB_PATHNAME, { access: "private", useCache: false });
    if (!blob) return {};
    const text = await new Response(blob.stream).text();
    return JSON.parse(text) as Record<string, Order>;
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
  const all = await readAll();
  return Object.values(all);
}
