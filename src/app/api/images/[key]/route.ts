import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db/pool";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const { rows } = await getPool().query<{ content_type: string; data: Buffer }>(
    "SELECT content_type, data FROM product_images WHERE key = $1",
    [key],
  );
  const result = rows[0];
  if (!result) {
    return NextResponse.json({ error: "Imaginea nu a fost găsită." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(result.data), {
    headers: {
      "Content-Type": result.content_type || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
