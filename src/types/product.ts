export type ProductBadge = "new" | "bestseller" | "flash-deal" | "sold-out" | "limited";

export interface ProductVariantOption {
  name: string;
  value: string;
  swatch?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  options: Record<string, string>;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: "RON" | "EUR" | "USD";
  rating: number;
  reviewCount: number;
  images: string[];
  colorOptions?: { name: string; hex: string }[];
  sizeOptions?: string[];
  variants: ProductVariant[];
  badges: ProductBadge[];
  stock: number;
  sku: string;
  features: string[];
  reviews: ProductReview[];
  relatedIds: string[];
  weightGrams?: number;
  freeShipping?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  description: string;
  parentId?: string | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  productCount: number;
}

export interface Attribute {
  id: string;
  name: string;
  values: string[];
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readMinutes: number;
  category: string;
}
