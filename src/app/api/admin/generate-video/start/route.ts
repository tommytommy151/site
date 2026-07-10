import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";
import { getGenAI, VEO_MODEL } from "@/lib/gemini";

export const maxDuration = 60;

function buildPrompt(product: { name: string; tagline: string; category: string }) {
  return (
    `Cinematic commercial product advertisement video for "${product.name}", ${product.category.toLowerCase()}. ` +
    `${product.tagline}. Smooth slow camera push-in and gentle orbit around the product, elegant studio lighting, ` +
    `soft reflections, clean minimalist background, premium e-commerce advertisement style, no on-screen text or logos.`
  );
}

export async function POST(req: NextRequest) {
  let body: { productSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }

  const productSlug = body.productSlug?.trim();
  if (!productSlug) {
    return NextResponse.json({ error: "Produsul este obligatoriu." }, { status: 400 });
  }

  const product = getProductBySlug(productSlug);
  if (!product) {
    return NextResponse.json({ error: "Produsul nu a fost găsit." }, { status: 404 });
  }

  let imageBytes: string;
  let mimeType: string;
  try {
    const imageRes = await fetch(product.images[0], { signal: AbortSignal.timeout(15_000) });
    if (!imageRes.ok) throw new Error(`status ${imageRes.status}`);
    mimeType = imageRes.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    const buffer = await imageRes.arrayBuffer();
    imageBytes = Buffer.from(buffer).toString("base64");
  } catch {
    return NextResponse.json(
      { error: "Nu am putut descărca imaginea produsului." },
      { status: 502 },
    );
  }

  try {
    const ai = getGenAI();
    const operation = await ai.models.generateVideos({
      model: VEO_MODEL,
      prompt: buildPrompt(product),
      image: { imageBytes, mimeType },
      config: { aspectRatio: "9:16", durationSeconds: 8 },
    });

    if (!operation.name) {
      throw new Error("Operațiunea nu a returnat un identificator.");
    }

    return NextResponse.json({ operationName: operation.name });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generarea video a eșuat." },
      { status: 502 },
    );
  }
}
