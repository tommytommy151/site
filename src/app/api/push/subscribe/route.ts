import { NextRequest, NextResponse } from "next/server";
import { saveSubscription, removeSubscription, isPushConfigured } from "@/lib/push/subscriptions";

export async function POST(req: NextRequest) {
  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Notificările push nu sunt configurate pe server." },
      { status: 503 },
    );
  }

  let subscription: { endpoint?: string };
  try {
    subscription = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }

  if (!subscription.endpoint) {
    return NextResponse.json({ error: "Abonament invalid." }, { status: 400 });
  }

  await saveSubscription(subscription as never);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  let body: { endpoint?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }
  if (!body.endpoint) {
    return NextResponse.json({ error: "endpoint lipsă." }, { status: 400 });
  }
  await removeSubscription(body.endpoint);
  return NextResponse.json({ ok: true });
}
