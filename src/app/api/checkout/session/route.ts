import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Lipsește session_id." }, { status: 400 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      { error: "Plata cu cardul nu este configurată momentan." },
      { status: 503 },
    );
  }

  const session = await stripe.checkout.sessions.retrieve(id);

  return NextResponse.json({
    paid: session.payment_status === "paid",
    orderId: session.metadata?.orderId ?? null,
  });
}
