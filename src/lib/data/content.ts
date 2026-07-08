import type { Testimonial, BlogPost } from "@/types/product";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "Ioana Petrescu",
    role: "Cumpărător verificat",
    avatar: "https://picsum.photos/seed/lucent-avatar-1/200/200",
    quote:
      "Finalizarea comenzii a durat sub un minut, iar coletul a ajuns două zile mai târziu, ambalat mai bine decât orice altceva am cumpărat anul acesta. Așa ar trebui să se simtă cumpărăturile online.",
    rating: 5,
  },
  {
    id: "t2",
    author: "Marcus Weber",
    role: "Cumpărător verificat",
    avatar: "https://picsum.photos/seed/lucent-avatar-2/200/200",
    quote:
      "Eram sceptic în privința cumpărării unui ceas online, dar fotografiile produsului și paginile de detalii au făcut decizia ușoară. Zero surprize la livrare.",
    rating: 5,
  },
  {
    id: "t3",
    author: "Sofia Andrei",
    role: "Cumpărător verificat",
    avatar: "https://picsum.photos/seed/lucent-avatar-3/200/200",
    quote:
      "Echipa de suport m-a ajutat să schimb o mărime în câteva minute, prin chat. E rar să primești un asemenea răspuns de la un magazin de dimensiunea acesta.",
    rating: 5,
  },
  {
    id: "t4",
    author: "Liam O'Connor",
    role: "Cumpărător verificat",
    avatar: "https://picsum.photos/seed/lucent-avatar-4/200/200",
    quote:
      "La a treia comandă, tot impresionat de consecvență. Fiecare articol s-a potrivit exact cu descrierea.",
    rating: 4,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "how-we-source-materials",
    title: "Cum ne procurăm materialele pentru tot ce vindem",
    excerpt: "O privire în procesul nostru de verificare a furnizorilor, de la fibra brută la produsul finit.",
    image: "https://picsum.photos/seed/lucent-blog-1/900/600",
    author: "Echipa EstelaOferta",
    date: "2026-06-18",
    readMinutes: 6,
    category: "Meșteșug",
  },
  {
    id: "post-2",
    slug: "caring-for-full-grain-leather",
    title: "Îngrijirea pielii integrale: un ghid practic",
    excerpt: "Obiceiuri simple care fac ca articolele din piele să arate mai bine cu timpul, nu mai rău.",
    image: "https://picsum.photos/seed/lucent-blog-2/900/600",
    author: "Radu Constantin",
    date: "2026-06-02",
    readMinutes: 4,
    category: "Ghiduri",
  },
  {
    id: "post-3",
    slug: "the-case-for-fewer-better-things",
    title: "De ce alegem mai puține lucruri, dar mai bune",
    excerpt: "De ce livrăm un catalog mai mic decât majoritatea magazinelor de dimensiunea noastră — intenționat.",
    image: "https://picsum.photos/seed/lucent-blog-3/900/600",
    author: "Echipa EstelaOferta",
    date: "2026-05-14",
    readMinutes: 5,
    category: "Jurnal",
  },
  {
    id: "post-4",
    slug: "packaging-that-does-less-harm",
    title: "Ambalaje care fac mai puțin rău",
    excerpt: "Drumul nostru către ambalaje complet reciclabile, fără plastic, în fiecare categorie.",
    image: "https://picsum.photos/seed/lucent-blog-4/900/600",
    author: "Elena Marinescu",
    date: "2026-04-29",
    readMinutes: 7,
    category: "Sustenabilitate",
  },
];

const INSTA_LIKES = [482, 1203, 754, 1890, 336, 967, 1544, 612];

export const instagramFeed = Array.from({ length: 8 }, (_, i) => ({
  id: `insta-${i + 1}`,
  image: `https://picsum.photos/seed/lucent-insta-${i + 1}/600/600`,
  likes: INSTA_LIKES[i],
}));
