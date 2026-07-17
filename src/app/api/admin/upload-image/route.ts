import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Product images need a public store (readable by anyone visiting the site),
// which is a separate Blob store from the private one used for products/orders
// JSON, hence the dedicated token here instead of BLOB_READ_WRITE_TOKEN.
const IMAGES_TOKEN = process.env.IMAGES_READ_WRITE_TOKEN;

export async function POST(req: NextRequest) {
  if (!IMAGES_TOKEN) {
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
    token: IMAGES_TOKEN,
  });

  return NextResponse.json({ url: blob.url });
}
