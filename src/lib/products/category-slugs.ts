import type { Product } from "@/types/product";

export function productCategorySlugs(product: Product): string[] {
  return product.categorySlugs?.length ? product.categorySlugs : [product.categorySlug];
}
