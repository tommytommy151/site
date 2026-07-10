import { NextRequest, NextResponse } from "next/server";

interface ScrapedProduct {
  name: string;
  description: string;
  image: string;
  price: number | null;
  currency: string | null;
  sourceUrl: string;
}

function extractMeta(html: string, ...keys: string[]): string | null {
  for (const key of keys) {
    const pattern = new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']*)["']`,
      "i",
    );
    const match = html.match(pattern) ?? html.match(
      new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${key}["']`, "i"),
    );
    if (match?.[1]) return decodeHtmlEntities(match[1]);
  }
  return null;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function extractJsonLdProduct(html: string): Partial<ScrapedProduct> | null {
  const blocks = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1].trim());
      const candidates = Array.isArray(parsed) ? parsed : [parsed, ...(parsed["@graph"] ?? [])];
      const product = candidates.find(
        (entry) => entry?.["@type"] === "Product" || entry?.["@type"]?.includes?.("Product"),
      );
      if (!product) continue;

      const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
      const image = Array.isArray(product.image) ? product.image[0] : product.image;

      return {
        name: typeof product.name === "string" ? product.name : undefined,
        description: typeof product.description === "string" ? product.description : undefined,
        image: typeof image === "string" ? image : undefined,
        price: offer?.price ? Number(offer.price) : undefined,
        currency: typeof offer?.priceCurrency === "string" ? offer.priceCurrency : undefined,
      };
    } catch {
      continue;
    }
  }
  return null;
}

function extractPrice(html: string): number | null {
  const metaPrice = extractMeta(html, "product:price:amount", "og:price:amount");
  if (metaPrice) {
    const num = Number(metaPrice.replace(",", "."));
    if (!Number.isNaN(num)) return num;
  }
  const priceMatch = html.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s?(?:RON|lei|LEI|€|EUR)/);
  if (priceMatch) {
    const normalized = priceMatch[1].replace(/\./g, "").replace(",", ".");
    const num = Number(normalized);
    if (!Number.isNaN(num)) return num;
  }
  return null;
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corp de cerere invalid." }, { status: 400 });
  }

  const rawUrl = body.url?.trim();
  if (!rawUrl) {
    return NextResponse.json({ error: "Adresa URL este obligatorie." }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
    if (!["http:", "https:"].includes(targetUrl.protocol)) throw new Error("invalid protocol");
  } catch {
    return NextResponse.json({ error: "Adresa URL nu este validă." }, { status: 400 });
  }

  let html: string;
  try {
    const res = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; EstelaOfertaImportBot/1.0; +https://estelaoferta.example)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Site-ul sursă a răspuns cu eroare (${res.status}).` },
        { status: 502 },
      );
    }
    html = await res.text();
  } catch {
    return NextResponse.json(
      { error: "Nu am putut accesa adresa URL furnizată." },
      { status: 502 },
    );
  }

  const jsonLd = extractJsonLdProduct(html);

  const name =
    jsonLd?.name ??
    extractMeta(html, "og:title") ??
    html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ??
    null;

  const description =
    jsonLd?.description ?? extractMeta(html, "og:description", "description") ?? "";

  const image = jsonLd?.image ?? extractMeta(html, "og:image") ?? "";

  const price = jsonLd?.price ?? extractPrice(html);
  const currency = jsonLd?.currency ?? extractMeta(html, "og:price:currency") ?? null;

  if (!name) {
    return NextResponse.json(
      { error: "Nu am reușit să identific un produs pe această pagină." },
      { status: 422 },
    );
  }

  const result: ScrapedProduct = {
    name: decodeHtmlEntities(name),
    description: description ? decodeHtmlEntities(description) : "",
    image,
    price: price ?? null,
    currency,
    sourceUrl: targetUrl.toString(),
  };

  return NextResponse.json(result);
}
