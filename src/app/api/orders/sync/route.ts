import { NextRequest, NextResponse } from "next/server";
import { saveOrder, deleteOrder } from "@/lib/orders/server-orders";
import type { Order } from "@/types/order";

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
  await saveOrder(order);
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
  await deleteOrder(body.id);
  return NextResponse.json({ ok: true });
}
