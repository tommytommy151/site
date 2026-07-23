"use client";

import { useEffect } from "react";
import { useProductStore } from "@/lib/store/product-store";
import type { Product } from "@/types/product";

export function ProductStoreHydrator() {
  const mergeCustomProducts = useProductStore((s) => s.mergeCustomProducts);

  useEffect(() => {
    let cancelled = false;

    async function loadWithRetry() {
      const delays = [0, 1000, 3000];
      for (const delay of delays) {
        if (delay) await new Promise((r) => setTimeout(r, delay));
        if (cancelled) return;
        try {
          const res = await fetch("/api/products");
          if (!res.ok) continue;
          const data: Product[] = await res.json();
          if (Array.isArray(data) && data.length && !cancelled) {
            mergeCustomProducts(data);
            return;
          }
        } catch {
          // network hiccup (common on mobile) — fall through and retry
        }
      }
    }

    loadWithRetry();
    return () => {
      cancelled = true;
    };
  }, [mergeCustomProducts]);

  return null;
}
