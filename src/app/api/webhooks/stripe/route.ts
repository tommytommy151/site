import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { saveOrder } from "@/lib/orders/server-orders";
import { getPendingOrder, deletePendingOrder } from "@/lib/orders/pending-orders";
import { sendMetaCapiEvent } from "@/lib/meta-capi";
import type { Order } from "@/types/order";

// Backstop for card orders: /checkout/success only saves the order if the
// customer's browser makes it back there after paying. If that navigation
// never happens (closed tab, dropped connection), Stripe still calls this
// webhook, so the order gets saved from the pending draft regardless.
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhooks/stripe] STRIPE_WEBHOOK_SECRET nu este configurată.");
    return NextResponse.json({ error: "Webhook neconfigurat." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature ?? "", secret);
  } catch (err) {
    console.error("[webhooks/stripe] semnătură invalidă:", err);
    return NextResponse.json({ error: "Semnătură invalidă." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  console.log("[webhooks/stripe] checkout.session.completed", session.id, session.payment_status);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.error("[webhooks/stripe] sesiune plătită fără orderId în metadata:", session.id);
    return NextResponse.json({ received: true });
  }

  try {
    const draft = await getPendingOrder(orderId);
    if (!draft) {
      console.log("[webhooks/stripe] niciun draft pentru", orderId, "- probabil deja salvată de client");
      return NextResponse.json({ received: true });
    }

    const order: Order = {
      id: orderId,
      number: `EO-${orderId.slice(-6)}`,
      customerName: draft.customerName,
      customerEmail: draft.customerEmail,
      date: new Date().toISOString(),
      status: "processing",
      items: draft.items,
      subtotal: draft.subtotal,
      shipping: draft.shipping,
      total: draft.total,
      paymentMethod: "Card bancar",
      shippingAddress: draft.shippingAddress,
    };
    await saveOrder(order);
    await deletePendingOrder(orderId);
    console.log("[webhooks/stripe] comandă salvată din webhook (backstop)", orderId);

    // The customer's browser may never reach /checkout/success (closed tab,
    // dropped connection) to fire the client-side Purchase pixel, so send it
    // here too. event_id = orderId matches whatever the browser path would
    // have used, so Meta dedupes if both ever do fire for the same order.
    await sendMetaCapiEvent({
      eventName: "Purchase",
      eventId: orderId,
      eventSourceUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.estelaoferta.ro"}/checkout/success`,
      customData: {
        content_ids: order.items.map((i) => i.productId),
        content_type: "product",
        num_items: order.items.reduce((sum, i) => sum + i.quantity, 0),
        value: order.total,
        currency: "RON",
      },
      userData: {
        email: order.customerEmail,
        fbp: draft.fbp,
        fbc: draft.fbc,
        clientIp: draft.clientIp,
        userAgent: draft.userAgent,
      },
    });
  } catch (err) {
    console.error("[webhooks/stripe] nu am putut salva comanda", orderId, err);
    // Non-2xx makes Stripe retry the webhook later; the draft is still there.
    return NextResponse.json({ error: "Nu am putut salva comanda." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
