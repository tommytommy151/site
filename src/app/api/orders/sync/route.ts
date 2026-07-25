import { NextRequest, NextResponse } from "next/server";
import { saveOrder, deleteOrder } from "@/lib/orders/server-orders";
import type { Order } from "@/types/order";

// Netlify Blobs reads can fail transiently; retry a couple of times in-process
// before telling the client to give up, since a paid order silently failing to
// persist here means it never shows up anywhere but the customer's own browser.
async function withRetry(fn: () => Promise<void>) {
  const delays = [0, 300, 1000];
  let lastError: unknown;
  for (const delay of delays) {
    if (delay) await new Promise((r) => setTimeout(r, delay));
    try {
      await fn();
      return;
    } catch (err) {
      lastError = err;
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
  try {
    await withRetry(() => saveOrder(order));
  } catch {
    return NextResponse.json({ error: "Nu am putut salva comanda." }, { status: 502 });
  }
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
    await withRetry(() => deleteOrder(body.id!));
  } catch {
    return NextResponse.json({ error: "Nu am putut șterge comanda." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
