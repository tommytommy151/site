import { getStore } from "@netlify/blobs";
import type { OrderItem } from "@/types/order";

const BLOB_KEY = "orders/pending.json";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

// Written at Stripe Checkout session creation, before the customer ever pays,
// so the checkout.session.completed webhook can build the full order even if
// the customer's browser never makes it back to /checkout/success.
export interface PendingOrder {
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  createdAt: number;
}

function store() {
  return getStore("app-data");
}

async function readAll(): Promise<Record<string, PendingOrder>> {
  try {
    const data = await store().get(BLOB_KEY, { type: "json", consistency: "strong" });
    return (data as Record<string, PendingOrder> | null) ?? {};
  } catch (err) {
    console.error("[orders/pending] readAll failed:", err);
    throw err;
  }
}

async function writeAll(all: Record<string, PendingOrder>) {
  await store().setJSON(BLOB_KEY, all);
}

function pruneStale(all: Record<string, PendingOrder>) {
  const cutoff = Date.now() - MAX_AGE_MS;
  for (const [id, draft] of Object.entries(all)) {
    if (draft.createdAt < cutoff) delete all[id];
  }
}

export async function savePendingOrder(orderId: string, draft: Omit<PendingOrder, "createdAt">) {
  const all = await readAll();
  pruneStale(all);
  all[orderId] = { ...draft, createdAt: Date.now() };
  await writeAll(all);
}

export async function getPendingOrder(orderId: string): Promise<PendingOrder | null> {
  const all = await readAll();
  return all[orderId] ?? null;
}

export async function deletePendingOrder(orderId: string) {
  const all = await readAll();
  if (!(orderId in all)) return;
  delete all[orderId];
  await writeAll(all);
}
