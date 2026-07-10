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
    content:
      "O privire în procesul nostru de verificare a furnizorilor, de la fibra brută la produsul finit. Lucrăm doar cu ateliere care ne pot arăta exact de unde vin materialele și cum sunt tratați oamenii care le prelucrează. Fiecare furnizor nou trece printr-o vizită la fața locului înainte de prima comandă.",
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
    content:
      "Obiceiuri simple care fac ca articolele din piele să arate mai bine cu timpul, nu mai rău. O cârpă moale, o cremă naturală o dată la câteva luni și evitarea expunerii îndelungate la soare direct sunt tot ce ai nevoie. Pielea integrală capătă patină în timp — asta e un semn bun, nu un defect.",
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
    content:
      "De ce livrăm un catalog mai mic decât majoritatea magazinelor de dimensiunea noastră — intenționat. Preferăm douăzeci de produse pe care le verificăm personal, în locul a două sute alese doar după marjă. Fiecare produs nou intră în catalog după ce cineva din echipă l-a folosit cel puțin o lună.",
    image: "https://picsum.photos/seed/lucent-blog-3/900/600",
    author: "Echipa EstelaOferta",
    date: "2026-05-14",
    readMinutes: 5,
    category: "Blog",
  },
  {
    id: "post-4",
    slug: "packaging-that-does-less-harm",
    title: "Ambalaje care fac mai puțin rău",
    excerpt: "Drumul nostru către ambalaje complet reciclabile, fără plastic, în fiecare categorie.",
    content:
      "Drumul nostru către ambalaje complet reciclabile, fără plastic, în fiecare categorie. Am trecut ultimul furnizor de folie de protecție anul acesta, înlocuind-o cu hârtie ondulată reciclată. Următorul pas este eliminarea benzii adezive din plastic din toate coletele.",
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
