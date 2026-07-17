import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

interface CreateSessionItem {
  name: string;
  quantity: number;
  unitAmount: number;
}

interface CreateSessionBody {
  orderId: string;
  customerEmail: string;
  items: CreateSessionItem[];
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
  const { orderId, items, shippingAmount, discountAmount } = body;
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
      unit_amount: Math.round(item.unitAmount * 100),
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
      customer_email: customerEmail,
      line_items: lineItems,
      discounts,
      metadata: { orderId },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?step=plata`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Nu am putut iniția plata cu cardul. Încearcă din nou." },
      { status: 502 },
    );
  }
}
