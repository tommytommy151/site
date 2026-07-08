import type { Category, Brand } from "@/types/product";

export const categories: Category[] = [
  {
    id: "cat-audio",
    name: "Audio",
    slug: "audio",
    image: "https://picsum.photos/seed/lucent-audio/900/1100",
    productCount: 6,
    description: "Sunet de calitate studio, conceput pentru purtat zilnic.",
  },
  {
    id: "cat-watches",
    name: "Ceasuri",
    slug: "watches",
    image: "https://picsum.photos/seed/lucent-watches/900/1100",
    productCount: 5,
    description: "Mecanisme de precizie în carcase moderne, discrete.",
  },
  {
    id: "cat-bags",
    name: "Genți & Carry",
    slug: "bags",
    image: "https://picsum.photos/seed/lucent-bags/900/1100",
    productCount: 5,
    description: "Piele integrală și pânză tehnică, construite să reziste.",
  },
  {
    id: "cat-apparel",
    name: "Îmbrăcăminte",
    slug: "apparel",
    image: "https://picsum.photos/seed/lucent-apparel/900/1100",
    productCount: 5,
    description: "Esențiale atent alese, din fibre naturale.",
  },
  {
    id: "cat-home",
    name: "Casă",
    slug: "home",
    image: "https://picsum.photos/seed/lucent-home/900/1100",
    productCount: 4,
    description: "Obiecte pentru o casă mai calmă și mai liniștită.",
  },
  {
    id: "cat-accessories",
    name: "Accesorii",
    slug: "accessories",
    image: "https://picsum.photos/seed/lucent-accessories/900/1100",
    productCount: 4,
    description: "Micile detalii care completează ținuta.",
  },
];

export const brands: Brand[] = [
  { id: "b-auric", name: "Auric", slug: "auric", logo: "Auric", productCount: 7 },
  { id: "b-norr", name: "Norr", slug: "norr", logo: "Norr", productCount: 6 },
  { id: "b-kessel", name: "Kessel", slug: "kessel", logo: "Kessel", productCount: 5 },
  { id: "b-vantage", name: "Vantage", slug: "vantage", logo: "Vantage", productCount: 5 },
  { id: "b-loam", name: "Loam", slug: "loam", logo: "Loam", productCount: 4 },
  { id: "b-halcyon", name: "Halcyon", slug: "halcyon", logo: "Halcyon", productCount: 2 },
];
