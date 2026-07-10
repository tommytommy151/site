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

export function generateFixedRatioReviews(productId: string): ProductReview[] {
  const rand = seededRandom(hashString(`${productId}-fixed`));
  const fiveStarCount = 2 + Math.floor(rand() * 2); // 2-3
  const fourStarCount = 1 + Math.floor(rand() * 2); // 1-2
  const ratings = [
    ...Array(fiveStarCount).fill(5),
    ...Array(fourStarCount).fill(4),
  ];

  const reviews: ProductReview[] = ratings.map((rating, i) => {
    const author = AUTHORS[Math.floor(rand() * AUTHORS.length)];
    const title = TITLES_POSITIVE[Math.floor(rand() * TITLES_POSITIVE.length)];
    const body = BODIES_POSITIVE[Math.floor(rand() * BODIES_POSITIVE.length)];
    const daysAgo = Math.floor(rand() * 260) + 2;
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    return {
      id: `${productId}-fixed-review-${i}`,
      author,
      rating,
      title,
      body,
      date,
      verified: rand() > 0.15,
      helpful: Math.floor(rand() * 48),
    };
  });

  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function generateReviews(productId: string, count: number): ProductReview[] {
  const rand = seededRandom(hashString(productId));
  const reviews: ProductReview[] = [];

  for (let i = 0; i < count; i++) {
    const rating = rand() > 0.35 ? 5 : 4;
    const author = AUTHORS[Math.floor(rand() * AUTHORS.length)];
    const title = TITLES_POSITIVE[Math.floor(rand() * TITLES_POSITIVE.length)];
    const body = BODIES_POSITIVE[Math.floor(rand() * BODIES_POSITIVE.length)];
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
