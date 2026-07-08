"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";

export default function AccountWishlistPage() {
  const ids = useWishlistStore((s) => s.productIds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Produse favorite</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Produsele pe care le-ai salvat pentru mai târziu.
      </p>

      {!mounted ? null : items.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <Heart className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Lista ta de favorite este goală</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
