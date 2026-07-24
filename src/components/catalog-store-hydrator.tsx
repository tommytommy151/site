"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/lib/store/catalog-store";

export function CatalogStoreHydrator() {
  const mergeServerCatalog = useCatalogStore((s) => s.mergeServerCatalog);

  useEffect(() => {
    let cancelled = false;

    let synced = false;

    async function loadWithRetry() {
      const delays = [0, 1000, 3000, 5000, 10000, 15000];
      for (const delay of delays) {
        if (delay) await new Promise((r) => setTimeout(r, delay));
        if (cancelled) return;
        try {
          const res = await fetch("/api/catalog");
          if (!res.ok) continue;
          const data = await res.json();
          if (data && !cancelled) {
            mergeServerCatalog(data);
            synced = true;
            return;
          }
        } catch {
          // network hiccup (common on mobile) — fall through and retry
        }
      }
    }

    function resyncIfNeeded() {
      if (!synced && !cancelled) loadWithRetry();
    }

    loadWithRetry();
    window.addEventListener("online", resyncIfNeeded);
    document.addEventListener("visibilitychange", resyncIfNeeded);
    return () => {
      cancelled = true;
      window.removeEventListener("online", resyncIfNeeded);
      document.removeEventListener("visibilitychange", resyncIfNeeded);
    };
  }, [mergeServerCatalog]);

  return null;
}
