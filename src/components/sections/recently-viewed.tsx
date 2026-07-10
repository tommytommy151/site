"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "@/lib/store/product-store";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { ProductRail } from "@/components/sections/product-rail";

export function RecentlyViewed() {
  const ids = useRecentlyViewedStore((s) => s.productIds);
  const products = useProductStore((s) => s.products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || ids.length === 0) return null;

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <ProductRail eyebrow="Continuă navigarea" title="Vizualizate recent" products={items} />
  );
}
