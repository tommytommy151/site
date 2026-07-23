"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/lib/store/catalog-store";

export function CatalogStoreHydrator() {
  const mergeServerCatalog = useCatalogStore((s) => s.mergeServerCatalog);

  useEffect(() => {
    let cancelled = false;

    async function loadWithRetry() {
      const delays = [0, 1000, 3000];
      for (const delay of delays) {
        if (delay) await new Promise((r) => setTimeout(r, delay));
        if (cancelled) return;
        try {
          const res = await fetch("/api/catalog");
          if (!res.ok) continue;
          const data = await res.json();
          if (data && !cancelled) {
            mergeServerCatalog(data);
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
  }, [mergeServerCatalog]);

  return null;
}
