"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ui/rating-stars";
import { ProductBadgePill } from "@/components/product/product-badge";
import { formatPrice, discountPct } from "@/lib/format";
import { QUANTITY_DISCOUNT_TIERS, quantityDiscountPct, quantityLineTotal } from "@/lib/pricing";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCompareStore } from "@/lib/store/compare-store";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "40770715920";

export function VariantSelector({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colorOptions?.[0]?.name ?? null);
  const [selectedSize, setSelectedSize] = useState(product.sizeOptions?.[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isCompared = useCompareStore((s) => s.has(product.id));
  const toggleCompare = useCompareStore((s) => s.toggle);

  const activeVariant = useMemo(() => {
    return (
      product.variants.find((v) => {
        const colorMatch = !selectedColor || v.options.Culoare === selectedColor;
        const sizeMatch = !selectedSize || v.options.Mărime === selectedSize;
        return colorMatch && sizeMatch;
      }) ?? product.variants[0]
    );
  }, [product.variants, selectedColor, selectedSize]);

  const pct = discountPct(activeVariant.price, activeVariant.compareAtPrice);
  const outOfStock = activeVariant.stock === 0;
  const qtyDiscountPct = quantityDiscountPct(quantity);
  const lineTotal = quantityLineTotal(activeVariant.price, quantity);

  function handleAddToCart() {
    addItem(product, activeVariant, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleWhatsAppOrder() {
    const options = Object.entries(activeVariant.options)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    const message =
      `Bună! Aș dori să comand:\n\n` +
      `${product.name}${options ? ` (${options})` : ""} × ${quantity}\n` +
      `Preț: ${formatPrice(lineTotal, product.currency)}\n\n` +
      `${window.location.href}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {product.badges.map((b) => (
            <ProductBadgePill key={b} badge={b} />
          ))}
        </div>
        <p className="mt-3 text-sm font-medium tracking-wide text-brand-emerald uppercase">
          {product.brand}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">{product.tagline}</p>

        <div className="mt-4 flex items-center gap-3">
          <RatingStars rating={product.rating} showValue />
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount} recenzii)
          </span>
        </div>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-foreground">
            {formatPrice(activeVariant.price, product.currency)}
          </span>
          {activeVariant.compareAtPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(activeVariant.compareAtPrice, product.currency)}
              </span>
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                Economisești {pct}%
              </span>
            </>
          )}
        </div>
      </div>

      {product.colorOptions && product.colorOptions.length > 0 && (
        <div>
          <p className="mb-2.5 text-sm font-medium text-foreground">
            Culoare — <span className="text-muted-foreground">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.colorOptions.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                aria-label={color.name}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-background transition-all",
                  selectedColor === color.name ? "ring-brand-emerald" : "ring-transparent",
                )}
                style={{ backgroundColor: color.hex }}
              >
                {selectedColor === color.name && (
                  <Check
                    className="size-4"
                    style={{
                      color: ["#f3f1eb", "#d8cbb4", "#9a9690"].includes(color.hex) ? "#161616" : "#fff",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizeOptions && product.sizeOptions.length > 0 && (
        <div>
          <p className="mb-2.5 text-sm font-medium text-foreground">
            Mărime — <span className="text-muted-foreground">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
                  selectedSize === size
                    ? "border-brand-emerald bg-brand-emerald-soft text-brand-emerald"
                    : "border-border text-foreground hover:border-foreground/40",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">Reduceri la cantitate</p>
        <div className="mt-2.5 flex flex-col gap-1.5">
          {QUANTITY_DISCOUNT_TIERS.map((tier) => {
            const selected = quantity === tier.minQty;
            const unlocked = quantity >= tier.minQty;
            return (
              <button
                key={tier.minQty}
                type="button"
                onClick={() => setQuantity(Math.min(tier.minQty, activeVariant.stock))}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left text-sm transition-colors",
                  selected
                    ? "border-brand-emerald bg-brand-emerald-soft text-brand-emerald"
                    : unlocked
                      ? "border-transparent bg-brand-emerald-soft/50 text-brand-emerald"
                      : "border-transparent text-muted-foreground hover:bg-muted",
                )}
              >
                <span>
                  {tier.minQty === 1 ? "Cumperi 1 bucată" : `Cumperi ${tier.minQty}+ bucăți`}
                </span>
                <span className="font-semibold">-{tier.discountPct}%</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-border">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-11 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(activeVariant.stock, q + 1))}
            className="flex size-11 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <Button
          size="lg"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className="h-11 flex-1 rounded-xl text-[15px]"
        >
          {outOfStock ? (
            "Stoc epuizat"
          ) : justAdded ? (
            <>
              <Check className="size-4" /> Adăugat în coș
            </>
          ) : (
            <>
              <ShoppingBag className="size-4" /> Adaugă în coș
            </>
          )}
        </Button>

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Comută favorite"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl border border-border transition-colors hover:border-brand-emerald/50",
            isWishlisted && "border-brand-emerald bg-brand-emerald-soft text-brand-emerald",
          )}
        >
          <Heart className="size-4" fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => toggleCompare(product.id)}
          aria-label="Comută comparație"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl border border-border transition-colors hover:border-brand-indigo/50",
            isCompared && "border-brand-indigo bg-brand-indigo-soft text-brand-indigo",
          )}
        >
          <Scale className="size-4" />
        </button>
      </div>

      <Button
        variant="outline"
        size="lg"
        disabled={outOfStock}
        onClick={handleWhatsAppOrder}
        className="h-11 w-full rounded-xl text-[15px]"
      >
        <MessageCircle className="size-4" /> Comandă prin WhatsApp — 0770 715 920
      </Button>

      {quantity > 1 && (
        <p className="text-sm text-foreground">
          Total pentru {quantity} bucăți:{" "}
          <span className="font-semibold">{formatPrice(lineTotal, product.currency)}</span>
          {qtyDiscountPct > 0 && (
            <span className="ml-1.5 text-brand-emerald">(-{qtyDiscountPct}%)</span>
          )}
        </p>
      )}

      {!outOfStock && activeVariant.stock <= 8 && (
        <p className="text-sm text-destructive">
          Au mai rămas doar {activeVariant.stock} bucăți în stoc — comandă curând.
        </p>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="size-4 shrink-0 text-brand-emerald" />
          <span className="text-foreground">
            Livrare gratuită peste 300 de lei — sosește în 2–4 zile lucrătoare
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <ShieldCheck className="size-4 shrink-0 text-brand-emerald" />
          <span className="text-foreground">Garanție 2 ani & retur în 30 de zile</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        SKU: {activeVariant.sku} {product.weightGrams && `· ${product.weightGrams}g`}
      </p>
    </div>
  );
}
