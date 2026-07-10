import { NextRequest, NextResponse } from "next/server";
import { saveCustomProduct, deleteCustomProduct } from "@/lib/products/server-products";
import type { Product } from "@/types/product";

export async function POST(req: NextRequest) {
  let product: Product;
  try {
    product = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }
  if (!product?.slug) {
    return NextResponse.json({ error: "slug lipsă." }, { status: 400 });
  }
  await saveCustomProduct(product);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  let body: { slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }
  if (!body.slug) {
    return NextResponse.json({ error: "slug lipsă." }, { status: 400 });
  }
  await deleteCustomProduct(body.slug);
  return NextResponse.json({ ok: true });
}
