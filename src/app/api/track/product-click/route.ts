import { NextRequest, NextResponse } from "next/server";
import { recordProductClick } from "@/lib/analytics/server-analytics";

export async function POST(req: NextRequest) {
  let body: { productId?: string; productName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }

  if (!body.productId || !body.productName) {
    return NextResponse.json({ error: "productId și productName sunt obligatorii." }, { status: 400 });
  }

  await recordProductClick(body.productId, body.productName);
  return NextResponse.json({ ok: true });
}
