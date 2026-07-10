import type { Category, Brand } from "@/types/product";

export const categories: Category[] = [
  {
    id: "cat-electrocasnice",
    name: "Electrocasnice",
    slug: "electrocasnice",
    image: "https://loremflickr.com/900/1100/kitchen,appliance/all?lock=101",
    productCount: 12,
    description: "Electrocasnice smart pentru bucătărie și casă, la preț de Black Friday.",
  },
  {
    id: "cat-accesorii-telefon",
    name: "Accesorii Telefon",
    slug: "accesorii-telefon",
    image: "https://loremflickr.com/900/1100/smartphone/all?lock=102",
    productCount: 12,
    description: "Huse, încărcătoare și gadgeturi esențiale pentru telefonul tău.",
  },
  {
    id: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    image: "https://loremflickr.com/900/1100/fashion,clothing/all?lock=103",
    productCount: 12,
    description: "Ținute și accesorii care completează orice garderobă.",
  },
];

export const brands: Brand[] = [
  { id: "b-auric", name: "Auric", slug: "auric", logo: "Auric", productCount: 8 },
  { id: "b-norr", name: "Norr", slug: "norr", logo: "Norr", productCount: 7 },
  { id: "b-kessel", name: "Kessel", slug: "kessel", logo: "Kessel", productCount: 6 },
  { id: "b-vantage", name: "Vantage", slug: "vantage", logo: "Vantage", productCount: 6 },
  { id: "b-loam", name: "Loam", slug: "loam", logo: "Loam", productCount: 5 },
  { id: "b-halcyon", name: "Halcyon", slug: "halcyon", logo: "Halcyon", productCount: 3 },
];
