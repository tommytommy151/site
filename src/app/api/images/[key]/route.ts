import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const store = getStore("product-images");
  const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) {
    return NextResponse.json({ error: "Imaginea nu a fost găsită." }, { status: 404 });
  }

  const contentType = (result.metadata.contentType as string | undefined) || "application/octet-stream";
  return new NextResponse(result.data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
