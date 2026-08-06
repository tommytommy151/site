// One-off export: converts the current in-code product catalog (src/lib/data/products.ts)
// into a Shopify "Import products" CSV. Run with: npx tsx scripts/export-shopify-csv.ts
//
// NOTE: product images are Lorem Picsum placeholders (random stock photos), not real
// product photography — kept in the export at the user's request. Replace before launch.
import { writeFileSync } from "node:fs";
import { products } from "../src/lib/data/products";

const HEADERS = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value",
  "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Qty",
  "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price",
  "Variant Compare At Price", "Variant Requires Shipping", "Variant Taxable",
  "Image Src", "Image Position", "Image Alt Text", "Gift Card",
  "SEO Title", "SEO Description", "Status",
];

function csvEscape(value: string | number | boolean | undefined): string {
  if (value === undefined || value === null) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const rows: string[][] = [];

for (const p of products) {
  const hasColor = !!p.colorOptions?.length;
  const hasSize = !!p.sizeOptions?.length;
  const variants = p.variants.length ? p.variants : [{
    id: p.id, sku: p.sku, options: {}, price: p.price, compareAtPrice: p.compareAtPrice, stock: p.stock,
  }];

  variants.forEach((v, vi) => {
    const isFirst = vi === 0;
    const color = v.options?.Culoare;
    const size = v.options?.Mărime;

    rows.push([
      p.slug,
      isFirst ? p.name : "",
      isFirst ? p.description : "",
      isFirst ? p.brand : "",
      isFirst ? p.category : "",
      isFirst ? p.category : "",
      isFirst ? (p.tags ?? p.badges).join(", ") : "",
      isFirst ? "TRUE" : "",
      isFirst && hasColor ? "Culoare" : "",
      hasColor ? (color ?? "") : "",
      isFirst && hasSize ? "Mărime" : "",
      hasSize ? (size ?? "") : "",
      v.sku,
      String(p.weightGrams ?? ""),
      "shopify",
      String(v.stock),
      "deny",
      "manual",
      String(v.price),
      v.compareAtPrice ? String(v.compareAtPrice) : "",
      "TRUE",
      "TRUE",
      vi < p.images.length ? p.images[vi] : (isFirst ? p.images[0] ?? "" : ""),
      vi < p.images.length ? String(vi + 1) : "",
      vi < p.images.length ? `${p.name} - imagine ${vi + 1}` : "",
      "FALSE",
      isFirst ? p.name : "",
      isFirst ? p.tagline : "",
      isFirst ? "active" : "",
    ]);
  });

  // Extra image-only rows if the product has more images than variants
  for (let i = variants.length; i < p.images.length; i++) {
    rows.push([
      p.slug, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      p.images[i], String(i + 1), `${p.name} - imagine ${i + 1}`, "", "", "", "",
    ]);
  }
}

const csv = [HEADERS.map(csvEscape).join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\n");
writeFileSync("scripts/shopify-products-export.csv", csv, "utf-8");
console.log(`Wrote ${rows.length} rows for ${products.length} products to scripts/shopify-products-export.csv`);
