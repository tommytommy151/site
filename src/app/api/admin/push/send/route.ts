import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { getAllSubscriptions, removeSubscription, isPushConfigured } from "@/lib/push/subscriptions";

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:contact@estelaoferta.example";
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export async function POST(req: NextRequest) {
  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Notificările push nu sunt configurate pe server (lipsește Redis)." },
      { status: 503 },
    );
  }
  if (!configureWebPush()) {
    return NextResponse.json(
      { error: "Cheile VAPID nu sunt configurate pe server." },
      { status: 503 },
    );
  }

  let body: { title?: string; message?: string; url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }

  const title = body.title?.trim();
  const message = body.message?.trim();
  if (!title || !message) {
    return NextResponse.json({ error: "Titlul și mesajul sunt obligatorii." }, { status: 400 });
  }

  const subscriptions = await getAllSubscriptions();
  if (subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0 });
  }

  const payload = JSON.stringify({
    title,
    body: message,
    url: body.url?.trim() || "/",
  });

  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, payload);
        sent += 1;
      } catch (err: unknown) {
        failed += 1;
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await removeSubscription(subscription.endpoint);
        }
      }
    }),
  );

  return NextResponse.json({ sent, failed, total: subscriptions.length });
}
