import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db/pool";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fișier lipsă." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const key = `${crypto.randomUUID()}.${ext}`;
  const data = Buffer.from(await file.arrayBuffer());

  await getPool().query(
    "INSERT INTO product_images (key, content_type, data) VALUES ($1, $2, $3)",
    [key, file.type || "application/octet-stream", data],
  );

  return NextResponse.json({ url: `/api/images/${key}` });
}
