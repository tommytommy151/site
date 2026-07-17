import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Încărcarea imaginilor nu este configurată momentan." },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fișier lipsă." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const blob = await put(`product-images/${crypto.randomUUID()}.${ext}`, file, {
    access: "public",
    contentType: file.type || undefined,
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}
