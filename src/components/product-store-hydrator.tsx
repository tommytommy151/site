"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "@/lib/store/product-store";
import type { Product } from "@/types/product";

export function ProductStoreHydrator({
  initialProducts,
}: {
  // Fetched server-side (same request, no network hop) so the real catalog
  // is already in the store before first paint. Without this, every fresh
  // visitor — e.g. someone landing from a paid ad with an empty
  // localStorage — briefly renders the seed/placeholder catalog (picsum.photos
  // images, wrong products) until the client-side fetch below resolves,
  // which on a slow mobile connection (Meta's in-app browser especially) can
  // take seconds and looks like a broken bait-and-switch storefront.
  initialProducts?: Product[];
}) {
  const mergeCustomProducts = useProductStore((s) => s.mergeCustomProducts);

  // Runs synchronously during the first client render, before any sibling
  // reads product state — unlike the effect below, which only fires after
  // paint.
  const [seeded] = useState(() => {
    if (initialProducts?.length) mergeCustomProducts(initialProducts);
    return true;
  });

  useEffect(() => {
    let cancelled = false;

    let synced = seeded && !!initialProducts?.length;

    async function loadWithRetry() {
      const delays = [0, 1000, 3000, 5000, 10000, 15000];
      for (const delay of delays) {
        if (delay) await new Promise((r) => setTimeout(r, delay));
        if (cancelled) return;
        try {
          const res = await fetch("/api/products");
          if (!res.ok) continue;
          const data: Product[] = await res.json();
          if (Array.isArray(data) && data.length && !cancelled) {
            mergeCustomProducts(data);
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
    // Intentionally mount-only: initialProducts/seeded only matter for the
    // synchronous first-render seed above, not for this background resync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergeCustomProducts]);

  return null;
}
