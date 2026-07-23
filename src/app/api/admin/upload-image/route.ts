import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fișier lipsă." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const key = `${crypto.randomUUID()}.${ext}`;
  await getStore("product-images").set(key, file, {
    metadata: { contentType: file.type || "application/octet-stream" },
  });

  return NextResponse.json({ url: `/api/images/${key}` });
}
