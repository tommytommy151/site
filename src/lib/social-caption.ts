import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";

export type CaptionTone = "urgenta" | "beneficii" | "minimal";

function discountPct(product: Product): number | null {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return null;
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
}

function hashtags(product: Product): string {
  const tags = [
    product.categorySlug,
    product.brandSlug,
    "estelaoferta",
    "ofertazilei",
  ].map((t) => `#${t.replace(/-/g, "")}`);
  return tags.join(" ");
}

type Template = (p: Product, pct: number | null) => string;

const URGENTA_TEMPLATES: Template[] = [
  (p, pct) =>
    `⚡ OFERTĂ LIMITATĂ: ${p.name}${pct ? ` cu ${pct}% reducere` : ""}!\nAcum doar ${formatPrice(p.price, p.currency)}${p.compareAtPrice ? ` (redus de la ${formatPrice(p.compareAtPrice, p.currency)})` : ""}.\nStoc limitat — comandă acum pe estelaoferta.ro 🛒`,
  (p) =>
    `🔥 Nu rata! ${p.name} e disponibil acum la ${formatPrice(p.price, p.currency)}.\nComenzile se finalizează în câteva secunde pe estelaoferta.ro`,
];

const BENEFICII_TEMPLATES: Template[] = [
  (p) =>
    `✨ ${p.tagline}\n\n${p.name} — ${formatPrice(p.price, p.currency)}\nDisponibil acum pe estelaoferta.ro`,
  (p) =>
    `Descoperă ${p.name}: ${p.tagline}\nPreț: ${formatPrice(p.price, p.currency)}${p.freeShipping ? " · livrare gratuită" : ""}\nDisponibil pe estelaoferta.ro`,
];

const MINIMAL_TEMPLATES: Template[] = [
  (p) => `${p.name}\n${formatPrice(p.price, p.currency)}\nestelaoferta.ro`,
];

export function generateCaption(product: Product, tone: CaptionTone = "urgenta"): string {
  const pct = discountPct(product);
  const pool =
    tone === "urgenta"
      ? URGENTA_TEMPLATES
      : tone === "beneficii"
        ? BENEFICII_TEMPLATES
        : MINIMAL_TEMPLATES;
  const template = pool[Math.floor(Math.random() * pool.length)];
  const body = template(product, pct);
  return `${body}\n\n${hashtags(product)}`;
}
