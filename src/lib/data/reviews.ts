import type { ProductReview } from "@/types/product";

const AUTHORS = [
  "Elena M.", "James R.", "Sofia K.", "Michael T.", "Ana P.",
  "David L.", "Ioana V.", "Chris B.", "Maria D.", "Tom H.",
  "Alex N.", "Laura S.", "Radu C.", "Nina F.", "Paul G.",
];

const TITLES_POSITIVE = [
  "A depășit așteptările",
  "Merită fiecare leu",
  "Exact ca în descriere",
  "Confecționat impecabil",
  "L-aș cumpăra din nou",
  "Mai bun decât speram",
  "Sincer impresionat",
  "Acesta este cel potrivit",
];

const BODIES_POSITIVE = [
  "Calitatea execuției se observă din momentul în care deschizi cutia. Totul pare gândit, nimic nu pare ieftin.",
  "Livrarea a fost rapidă, iar ambalajul singur a părut premium. Produsul în sine a rezistat bine după săptămâni de utilizare zilnică.",
  "Aveam ezitări legate de preț, dar după ce l-am folosit zilnic am înțeles de ce. Materialele și finisajul sunt excelente.",
  "Serviciul de relații cu clienții a răspuns prompt la o întrebare despre mărimi, iar produsul se potrivește exact cu fotografiile.",
  "A înlocuit un articol de două ori mai scump de la alt brand și, sincer, performează mai bine. Foarte mulțumit de achiziție.",
  "Design discret, care nu atrage atenția cu orice preț, dar măiestria se observă de aproape.",
  "A doua achiziție de la acest brand, iar consecvența calității mă face să revin.",
];

const TITLES_MIXED = [
  "Bun, cu o mică observație",
  "Solid, dar mărimile sunt mai mici",
  "Produs plăcut, livrare lentă",
];

const BODIES_MIXED = [
  "Calitatea este foarte bună per ansamblu, doar aș fi vrut mai multe opțiuni de culoare. Îl recomand în continuare.",
  "Vine puțin mai mic decât mă așteptam — recomand o mărime mai mare. În rest, foarte mulțumit.",
  "A durat puțin mai mult decât estimat până a ajuns, dar produsul în sine a meritat așteptarea.",
];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateReviews(productId: string, avgRating: number, count: number): ProductReview[] {
  const rand = seededRandom(hashString(productId));
  const reviews: ProductReview[] = [];

  for (let i = 0; i < count; i++) {
    const isMixed = rand() < 0.22;
    const rating = isMixed
      ? Math.max(3, Math.round(avgRating - 1))
      : Math.min(5, Math.round(avgRating + (rand() > 0.5 ? 0 : 1) - (rand() > 0.7 ? 1 : 0)));
    const author = AUTHORS[Math.floor(rand() * AUTHORS.length)];
    const title = isMixed
      ? TITLES_MIXED[Math.floor(rand() * TITLES_MIXED.length)]
      : TITLES_POSITIVE[Math.floor(rand() * TITLES_POSITIVE.length)];
    const body = isMixed
      ? BODIES_MIXED[Math.floor(rand() * BODIES_MIXED.length)]
      : BODIES_POSITIVE[Math.floor(rand() * BODIES_POSITIVE.length)];
    const daysAgo = Math.floor(rand() * 260) + 2;
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    reviews.push({
      id: `${productId}-review-${i}`,
      author,
      rating: Math.max(1, Math.min(5, rating)),
      title,
      body,
      date,
      verified: rand() > 0.15,
      helpful: Math.floor(rand() * 48),
    });
  }

  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
