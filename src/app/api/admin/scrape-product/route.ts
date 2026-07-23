import { NextRequest, NextResponse } from "next/server";
import { stripBoilerplate } from "@/lib/strip-boilerplate";
import { rewriteDescription } from "@/lib/products/rewrite-description";
import { getGoogleLongTailTags } from "@/lib/products/google-suggest";

export const maxDuration = 60;

interface ScrapedProduct {
  name: string;
  description: string;
  images: string[];
  tags: string[];
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

function extractAllMeta(html: string, key: string): string[] {
  const results: string[] = [];
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']*)["']`, "gi"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${key}["']`, "gi"),
  ];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      if (match[1]) results.push(decodeHtmlEntities(match[1]));
    }
  }
  return results;
}

function resolveUrl(base: URL, maybeUrl: string): string | null {
  try {
    return new URL(maybeUrl, base).toString();
  } catch {
    return null;
  }
}

// Product galleries are usually rendered as plain <img> tags in the page
// body (often lazy-loaded via data-src/srcset), not exposed through
// og:image or JSON-LD — those two only ever carry one or two "official"
// images. This scans the raw HTML for every plausible image URL so the
// gallery import isn't limited to just the meta-tag images.
const SKIP_IMAGE_PATTERN =
  /sprite|icon|logo|favicon|placeholder|avatar|payment|badge|banner-ad|pixel|blank\.gif|spinner|loading|1x1/i;

function extractImgTagUrls(html: string): string[] {
  const results: string[] = [];
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    for (const attrMatch of tag.matchAll(
      /(?:src|data-src|data-lazy-src|data-original|data-zoom-image)=["']([^"']+)["']/gi,
    )) {
      if (attrMatch[1]) results.push(attrMatch[1]);
    }
    const srcsetMatch = tag.match(/srcset=["']([^"']+)["']/i);
    if (srcsetMatch) {
      const candidates = srcsetMatch[1]
        .split(",")
        .map((c) => c.trim().split(/\s+/)[0])
        .filter(Boolean);
      if (candidates.length) results.push(candidates[candidates.length - 1]);
    }
  }
  return results
    .map((u) => decodeHtmlEntities(u))
    .filter((u) => u && !u.startsWith("data:") && !SKIP_IMAGE_PATTERN.test(u) && !/\.svg(\?|$)/i.test(u));
}

// Pages with "related/recommended products" carousels can have dozens of
// <img> tags that have nothing to do with the product being imported.
// Only keep candidates whose URL contains a meaningful word from the
// product name, so we don't pull in photos of unrelated products.
function filterByNameRelevance(urls: string[], name: string): string[] {
  const tokens = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 4);
  if (!tokens.length) return urls;
  return urls.filter((u) => {
    const lower = u.toLowerCase();
    return tokens.some((t) => lower.includes(t));
  });
}

function normalizeForDedupe(url: string): string {
  try {
    const parsed = new URL(url);
    for (const param of ["width", "height", "w", "h", "quality", "q", "fit", "resize"]) {
      parsed.searchParams.delete(param);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function dedupeImages(urls: (string | null | undefined)[], base: URL, limit = 16): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    if (!raw) continue;
    const resolved = resolveUrl(base, raw);
    if (!resolved) continue;
    const key = normalizeForDedupe(resolved);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(resolved);
    if (out.length >= limit) break;
  }
  return out;
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

      let offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
      if (offer && offer.price === undefined && Array.isArray(offer.offers)) {
        offer = offer.offers[0];
      }
      const rawImages: unknown[] = Array.isArray(product.image) ? product.image : [product.image];
      const images = rawImages.filter(
        (entry): entry is string => typeof entry === "string" && entry.length > 0,
      );

      const priceValue = offer?.price ?? offer?.lowPrice;

      return {
        name: typeof product.name === "string" ? product.name : undefined,
        description: typeof product.description === "string" ? product.description : undefined,
        images,
        price: priceValue !== undefined ? Number(priceValue) : undefined,
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

  const rawName =
    jsonLd?.name ??
    extractMeta(html, "og:title") ??
    html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ??
    null;
  const name = rawName ? stripBoilerplate(rawName) : null;

  const description = stripBoilerplate(
    jsonLd?.description ?? extractMeta(html, "og:description", "description") ?? "",
  );

  // Many product galleries live on CDN paths with no product-name words at
  // all (e.g. /files/8391029.jpg), so the name-relevance filter can wipe out
  // every real gallery photo and leave just the 1-2 og:image/JSON-LD images.
  // Only trust the filtered set when it actually kept something back —
  // otherwise fall back to every extracted image rather than importing just one.
  const allBodyImages = extractImgTagUrls(html);
  const nameFilteredImages = name ? filterByNameRelevance(allBodyImages, name) : [];
  const bodyImages = nameFilteredImages.length > 0 ? nameFilteredImages : allBodyImages;
  const images = dedupeImages(
    [...(jsonLd?.images ?? []), ...extractAllMeta(html, "og:image"), ...bodyImages],
    targetUrl,
  );

  const price = jsonLd?.price ?? extractPrice(html);
  const currency = jsonLd?.currency ?? extractMeta(html, "og:price:currency") ?? null;

  if (!name) {
    return NextResponse.json(
      { error: "Nu am reușit să identific un produs pe această pagină." },
      { status: 422 },
    );
  }

  const decodedName = decodeHtmlEntities(name);
  const rawDescription = description ? decodeHtmlEntities(description) : "";
  const finalPrice = price ?? null;

  const [rewritten, googleTags] = await Promise.all([
    rewriteDescription({ name: decodedName, rawDescription, price: finalPrice, currency }),
    getGoogleLongTailTags(decodedName),
  ]);

  const tags = [...new Set([...rewritten.tags, ...googleTags])].slice(0, 15);

  const result: ScrapedProduct = {
    name: decodedName,
    description: rewritten.description,
    images,
    tags,
    price: finalPrice,
    currency,
    sourceUrl: targetUrl.toString(),
  };

  return NextResponse.json(result);
}
