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
  {
    id: "cat-jucarii",
    name: "Jucării",
    slug: "jucarii",
    image: "https://loremflickr.com/900/1100/toys/all?lock=104",
    productCount: 0,
    description: "Jucării pentru copii de toate vârstele.",
  },
  {
    id: "cat-cosmetice",
    name: "Cosmetice",
    slug: "cosmetice",
    image: "https://loremflickr.com/900/1100/cosmetics,beauty/all?lock=105",
    productCount: 0,
    description: "Produse de îngrijire și înfrumusețare.",
  },
  {
    id: "cat-articole-pentru-casa",
    name: "Articole pentru casă",
    slug: "articole-pentru-casa",
    image: "https://loremflickr.com/900/1100/home,decor/all?lock=106",
    productCount: 0,
    description: "Tot ce ai nevoie pentru casă.",
  },
  {
    id: "cat-baie",
    name: "Baie",
    slug: "baie",
    image: "https://loremflickr.com/900/1100/bathroom/all?lock=107",
    productCount: 0,
    description: "Accesorii și produse pentru baie.",
    parentId: "cat-articole-pentru-casa",
  },
  {
    id: "cat-bucatarie",
    name: "Bucătărie",
    slug: "bucatarie",
    image: "https://loremflickr.com/900/1100/kitchen/all?lock=108",
    productCount: 0,
    description: "Ustensile și accesorii pentru bucătărie.",
    parentId: "cat-articole-pentru-casa",
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
