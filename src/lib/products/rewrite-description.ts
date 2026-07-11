import { getGenAI, TEXT_MODEL } from "@/lib/gemini";

function buildPrompt(input: { name: string; rawDescription: string; price: number | null; currency: string | null }) {
  return `Ești un copywriter SEO pentru un magazin online românesc numit EstelaOferta. Rescrie complet, în limba română, descrierea produsului de mai jos, pornind de la datele brute (care pot fi incomplete, în altă limbă sau într-un stil publicitar de pe alt site).

Nume produs: ${input.name}
Preț: ${input.price !== null ? `${input.price} ${input.currency ?? "RON"}` : "necunoscut"}
Descriere brută extrasă de pe pagina sursă: """${input.rawDescription || "(nicio descriere găsită pe pagina sursă)"}"""

Răspunde EXACT în acest format, respectând titlurile de secțiune, fără text suplimentar înainte sau după, fără markdown, fără emoji:

TITLU: <o propoziție scurtă și atractivă, tip hook, max 15 cuvinte>
DESCRIERE: <2-4 propoziții naturale, bogate în cuvinte cheie relevante, care descriu produsul>
AVANTAJE:
- <avantaj scurt 1>
- <avantaj scurt 2>
- <avantaj scurt 3>
- <avantaj scurt 4>
DE_CE: <2-3 propoziții persuasive despre motivul pentru care merită cumpărat acest produs>
ETICHETE: <6-10 etichete long-tail SEO, în română, separate prin virgulă, fiecare de 2-4 cuvinte, specifice produsului (ex: caracteristici, material, brand, categorie de utilizare) — nu cuvinte singure și nu termeni generici precum "calitate" sau "reducere">`;
}

interface RewrittenDescription {
  title: string;
  description: string;
  advantages: string[];
  whyBuy: string;
  tags: string[];
}

function parseResponse(text: string): RewrittenDescription | null {
  const titleMatch = text.match(/TITLU:\s*(.+)/);
  const descMatch = text.match(/DESCRIERE:\s*(.+)/);
  const whyMatch = text.match(/DE_CE:\s*(.+)/);
  const advantagesBlock = text.match(/AVANTAJE:\s*([\s\S]*?)(?=DE_CE:|$)/);
  const tagsMatch = text.match(/ETICHETE:\s*(.+)/);

  const title = titleMatch?.[1]?.trim();
  const description = descMatch?.[1]?.trim();
  const whyBuy = whyMatch?.[1]?.trim();
  const advantages = advantagesBlock?.[1]
    ?.split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
  const tags = tagsMatch?.[1]
    ?.split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.split(/\s+/).length >= 2);

  if (!title || !description || !whyBuy || !advantages?.length) return null;
  return { title, description, advantages, whyBuy, tags: tags ?? [] };
}

function formatDescription(name: string, parsed: RewrittenDescription): string {
  const advantages = parsed.advantages.map((a) => `• ${a}`).join("\n");
  return `${parsed.title}\n\n${parsed.description}\n\nAvantaje:\n${advantages}\n\nDe ce să cumperi ${name}?\n${parsed.whyBuy}`;
}

/**
 * Rewrites a scraped product description into a structured, SEO-friendly
 * format (hook title, description, advantages, why-buy) and generates a set
 * of long-tail SEO tags. Falls back to the original raw description (and no
 * tags) if generation or parsing fails, so an import never blocks on this.
 */
export async function rewriteDescription(input: {
  name: string;
  rawDescription: string;
  price: number | null;
  currency: string | null;
}): Promise<{ description: string; tags: string[] }> {
  const fallback = { description: input.rawDescription.trim(), tags: [] };
  if (!process.env.GEMINI_API_KEY) return fallback;

  try {
    const ai = getGenAI();
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 25_000),
    );
    const response = await Promise.race([
      ai.models.generateContent({ model: TEXT_MODEL, contents: buildPrompt(input) }),
      timeout,
    ]);
    const text = response.text;
    if (!text) return fallback;

    const parsed = parseResponse(text);
    if (!parsed) return fallback;

    return { description: formatDescription(input.name, parsed), tags: parsed.tags };
  } catch {
    return fallback;
  }
}
