import { NextResponse } from "next/server";
import { getAllCustomProducts } from "@/lib/products/server-products";

export async function GET() {
  const products = await getAllCustomProducts();
  return NextResponse.json(products);
}
