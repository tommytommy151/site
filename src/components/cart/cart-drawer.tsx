"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Tag, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/format";
import { quantityDiscountPct, quantityLineTotal } from "@/lib/pricing";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const saveForLater = useCartStore((s) => s.saveForLater);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const couponCode = useCartStore((s) => s.couponCode);
  const couponDiscountPct = useCartStore((s) => s.couponDiscountPct);
  const subtotal = useCartStore((s) => s.subtotal());

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState(false);

  const discount = subtotal * (couponDiscountPct / 100);
  const shipping = subtotal > 300 || subtotal === 0 ? 0 : 25;
  const total = subtotal - discount + shipping;

  function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    setCouponError(!ok);
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="size-4.5" />
            Coșul tău {lines.length > 0 && `(${lines.length})`}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Coșul tău este gol</p>
            <p className="text-sm text-muted-foreground">Adaugă ceva ce-ți va plăcea.</p>
            <Button onClick={closeCart} className="mt-2" asChild>
              <Link href="/products">Continuă cumpărăturile</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-5">
                {lines.map((line) => (
                  <li key={line.variantId} className="flex gap-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image src={line.image} alt={line.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">{line.brand}</p>
                          <Link
                            href={`/products/${line.slug}`}
                            onClick={closeCart}
                            className="text-sm leading-snug font-medium text-foreground hover:text-brand-emerald"
                          >
                            {line.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeItem(line.variantId)}
                          aria-label="Elimină articolul"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Object.values(line.options).join(" / ")}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                            disabled={line.quantity <= 1}
                            className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{line.quantity}</span>
                          <button
                            onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                            disabled={line.quantity >= line.maxStock}
                            className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-semibold text-foreground">
                            {formatPrice(quantityLineTotal(line.price, line.quantity))}
                          </span>
                        </div>
                      </div>
                      {quantityDiscountPct(line.quantity) > 0 && (
                        <p className="text-xs font-medium text-brand-emerald">
                          Reducere cantitate: -{quantityDiscountPct(line.quantity)}%
                        </p>
                      )}
                      <button
                        onClick={() => saveForLater(line.variantId)}
                        className="mt-0.5 self-start text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                      >
                        Salvează pentru mai târziu
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="flex flex-col gap-4 border-t border-border px-5 py-5">
              {!couponCode ? (
                <div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError(false);
                        }}
                        placeholder="Cod cupon"
                        className="pl-8"
                      />
                    </div>
                    <Button variant="secondary" onClick={handleApplyCoupon}>
                      Aplică
                    </Button>
                  </div>
                  {couponError && (
                    <p className="mt-1.5 text-xs text-destructive">Cod cupon invalid.</p>
                  )}
                  <p className="mt-1.5 text-xs text-muted-foreground">Încearcă WELCOME10 sau LUCENT15</p>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg bg-brand-emerald-soft px-3 py-2 text-sm text-brand-emerald">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Tag className="size-3.5" /> {couponCode} aplicat
                  </span>
                  <button onClick={removeCoupon} className="text-xs underline-offset-2 hover:underline">
                    Elimină
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand-emerald">
                    <span>Reducere</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Livrare</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "Gratuită" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button size="lg" className="h-11 w-full text-[15px]" asChild>
                <Link href="/checkout" onClick={closeCart}>
                  Finalizează comanda
                </Link>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Livrare gratuită pentru comenzi peste {formatPrice(300)}
              </p>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
