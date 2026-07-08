"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Scale } from "lucide-react";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { formatPrice, discountPct } from "@/lib/format";
import { RatingStars } from "@/components/ui/rating-stars";
import { ProductBadgePill } from "@/components/product/product-badge";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCompareStore } from "@/lib/store/compare-store";
import { useCartStore } from "@/lib/store/cart-store";
import { onSpotlightMove } from "@/lib/use-spotlight";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isCompared = useCompareStore((s) => s.has(product.id));
  const toggleCompare = useCompareStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const pct = discountPct(product.price, product.compareAtPrice);

  return (
    <motion.div
      className={cn("group relative flex flex-col", className)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        onMouseMove={onSpotlightMove}
        className="spotlight relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-foreground/[0.04] transition-shadow duration-300 ease-out group-hover:shadow-xl"
      >
        <Link href={`/products/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-1.5">
            {product.badges.slice(0, 2).map((b) => (
              <ProductBadgePill key={b} badge={b} />
            ))}
            {pct > 0 && (
              <span className="inline-flex items-center rounded-full bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background">
                -{pct}%
              </span>
            )}
          </div>
          <div className="pointer-events-auto flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Comută favorite"
              className={cn(
                "flex size-8 items-center justify-center rounded-full glass shadow-sm transition-colors hover:text-brand-emerald",
                isWishlisted && "text-brand-emerald",
              )}
            >
              <Heart className="size-4" fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => toggleCompare(product.id)}
              aria-label="Comută comparație"
              className={cn(
                "flex size-8 items-center justify-center rounded-full glass shadow-sm transition-colors hover:text-brand-indigo",
                isCompared && "text-brand-indigo",
              )}
            >
              <Scale className="size-4" />
            </button>
          </div>
        </div>

        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => addItem(product, product.variants[0])}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-background/95 py-2.5 text-sm font-medium text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-brand-emerald hover:text-primary-foreground"
          >
            <ShoppingBag className="size-4" />
            Adaugă rapid
          </button>
        </div>
      </div>

      <Link href={`/products/${product.slug}`} className="mt-3.5 flex flex-1 flex-col gap-1">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {product.brand}
        </span>
        <h3 className="text-[15px] leading-snug font-medium text-foreground">{product.name}</h3>
        <RatingStars rating={product.rating} size={12} className="mt-0.5" />
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[15px] font-semibold text-foreground">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
