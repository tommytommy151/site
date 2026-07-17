import { NextRequest, NextResponse } from "next/server";
import { writeCatalogSnapshot, type CatalogSnapshot } from "@/lib/catalog/server-catalog";

export async function POST(req: NextRequest) {
  let snapshot: CatalogSnapshot;
  try {
    snapshot = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }
  await writeCatalogSnapshot(snapshot);
  return NextResponse.json({ ok: true });
}
