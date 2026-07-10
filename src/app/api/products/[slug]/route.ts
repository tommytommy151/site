import { NextRequest, NextResponse } from "next/server";
import { getCustomProduct } from "@/lib/products/server-products";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCustomProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "Produsul nu a fost găsit." }, { status: 404 });
  }
  return NextResponse.json(product);
}
