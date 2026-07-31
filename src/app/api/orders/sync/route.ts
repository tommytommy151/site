import { NextRequest, NextResponse } from "next/server";
import { saveOrder, deleteOrder } from "@/lib/orders/server-orders";
import { getAllCustomProducts } from "@/lib/products/server-products";
import { products as seedProducts } from "@/lib/data/products";
import type { Order } from "@/types/order";

// Card-only products can't be paid via COD — re-checked here since the client
// only enforces this in the UI, and this route otherwise trusts whatever
// order object it's handed.
async function hasCardOnlyItem(order: Order): Promise<boolean> {
  const custom = await getAllCustomProducts();
  const byId = new Map([...seedProducts, ...custom].map((p) => [p.id, p]));
  return order.items.some((item) => byId.get(item.productId)?.cardOnly);
}

// Netlify Blobs reads can fail transiently; retry a couple of times in-process
// before telling the client to give up, since a paid order silently failing to
// persist here means it never shows up anywhere but the customer's own browser.
async function withRetry(fn: () => Promise<void>, label: string) {
  const delays = [0, 300, 1000];
  let lastError: unknown;
  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) await new Promise((r) => setTimeout(r, delays[i]));
    try {
      await fn();
      return;
    } catch (err) {
      lastError = err;
      console.error(`[orders/sync] ${label} attempt ${i + 1}/${delays.length} failed:`, err);
    }
  }
  throw lastError;
}

export async function POST(req: NextRequest) {
  let order: Order;
  try {
    order = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }
  if (!order?.id) {
    return NextResponse.json({ error: "id lipsă." }, { status: 400 });
  }
  console.log("[orders/sync] POST received", order.id);
  if (order.paymentMethod === "Ramburs la livrare" && (await hasCardOnlyItem(order))) {
    return NextResponse.json(
      { error: "Unul dintre produse poate fi comandat doar cu plata cu cardul." },
      { status: 400 },
    );
  }
  try {
    await withRetry(() => saveOrder(order), `saveOrder(${order.id})`);
  } catch (err) {
    console.error("[orders/sync] POST giving up on", order.id, err);
    return NextResponse.json({ error: "Nu am putut salva comanda." }, { status: 502 });
  }
  console.log("[orders/sync] POST ok", order.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "id lipsă." }, { status: 400 });
  }
  try {
    await withRetry(() => deleteOrder(body.id!), `deleteOrder(${body.id})`);
  } catch {
    return NextResponse.json({ error: "Nu am putut șterge comanda." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
