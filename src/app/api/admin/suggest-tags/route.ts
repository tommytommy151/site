import { NextRequest, NextResponse } from "next/server";
import { getGoogleLongTailTags } from "@/lib/products/google-suggest";

export async function POST(req: NextRequest) {
  let body: { name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Numele este obligatoriu." }, { status: 400 });
  }

  const tags = await getGoogleLongTailTags(name);
  return NextResponse.json({ tags });
}
