"use client";

import { useEffect } from "react";

export function TrackProductClick({ productId, productName }: { productId: string; productName: string }) {
  useEffect(() => {
    fetch("/api/track/product-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, productName }),
    }).catch(() => {});
  }, [productId, productName]);

  return null;
}
