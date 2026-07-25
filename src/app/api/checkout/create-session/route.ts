import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { savePendingOrder } from "@/lib/orders/pending-orders";
import type { OrderItem } from "@/types/order";

interface CreateSessionBody {
  orderId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  shippingAmount: number;
  discountAmount?: number;
}

export async function POST(req: NextRequest) {
  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      { error: "Plata cu cardul nu este configurată momentan." },
      { status: 503 },
    );
  }

  const body: CreateSessionBody = await req.json();
  const { orderId, items, subtotal, total, shippingAmount, discountAmount } = body;
  const customerName = body.customerName?.trim() ?? "";
  const customerEmail = body.customerEmail?.trim() ?? "";

  if (!orderId || !customerEmail || !items?.length) {
    return NextResponse.json({ error: "Date de comandă incomplete." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return NextResponse.json(
      { error: "Adresa de email nu este validă." },
      { status: 400 },
    );
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;

  const lineItems: Array<{
    price_data: {
      currency: string;
      product_data: { name: string };
      unit_amount: number;
    };
    quantity: number;
  }> = items.map((item) => ({
    price_data: {
      currency: "ron",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  if (shippingAmount > 0) {
    lineItems.push({
      price_data: {
        currency: "ron",
        product_data: { name: "Livrare" },
        unit_amount: Math.round(shippingAmount * 100),
      },
      quantity: 1,
    });
  }

  try {
    let discounts: { coupon: string }[] | undefined;
    if (discountAmount && discountAmount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discountAmount * 100),
        currency: "ron",
        duration: "once",
        name: "Reducere comandă",
      });
      discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Restricting to card only keeps Stripe from offering Link, which shows
      // its own "Confirm it's you" phone-verification screen before card entry.
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: lineItems,
      discounts,
      metadata: { orderId },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?step=plata`,
    });

    // Best-effort backstop: if the customer's browser never makes it back to
    // /checkout/success, the checkout.session.completed webhook uses this
    // draft to save the order anyway. The client-side path stays primary —
    // this must not block returning the checkout URL.
    try {
      await savePendingOrder(orderId, {
        customerName,
        customerEmail,
        items,
        subtotal,
        shipping: shippingAmount,
        total,
        shippingAddress: body.shippingAddress ?? "",
      });
    } catch (err) {
      console.error("[checkout/create-session] savePendingOrder failed", orderId, err);
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Nu am putut iniția plata cu cardul. Încearcă din nou." },
      { status: 502 },
    );
  }
}
