"use client";

import { useEffect } from "react";
import { useProductStore } from "@/lib/store/product-store";
import type { Product } from "@/types/product";

export function ProductStoreHydrator() {
  const mergeCustomProducts = useProductStore((s) => s.mergeCustomProducts);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Product[]) => {
        if (Array.isArray(data) && data.length) mergeCustomProducts(data);
      })
      .catch(() => {});
  }, [mergeCustomProducts]);

  return null;
}
