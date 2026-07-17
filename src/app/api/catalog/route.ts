import { NextResponse } from "next/server";
import { readCatalogSnapshot } from "@/lib/catalog/server-catalog";

export async function GET() {
  const snapshot = await readCatalogSnapshot();
  return NextResponse.json(snapshot ?? { categories: [], brands: [], attributes: [] });
}
