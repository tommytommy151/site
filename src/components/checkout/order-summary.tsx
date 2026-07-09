"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { quantityUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

export function OrderSummary({ shippingAmount }: { shippingAmount: number }) {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const couponCode = useCartStore((s) => s.couponCode);
  const couponDiscountPct = useCartStore((s) => s.couponDiscountPct);

  const discount = subtotal * (couponDiscountPct / 100);
  const total = subtotal - discount + shippingAmount;

  return (
    <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground">Rezumat comandă</h2>
      <ul className="flex flex-col gap-3">
        {lines.map((line) => (
          <li key={line.variantId} className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 flex-1 truncate text-foreground">
              {line.name} <span className="text-muted-foreground">× {line.quantity}</span>
            </span>
            <span className="text-muted-foreground">
              {formatPrice(quantityUnitPrice(line.price, line.quantity) * line.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-brand-emerald">
            <span>Reducere {couponCode && `(${couponCode})`}</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-muted-foreground">
          <span>Livrare</span>
          <span className="text-foreground">
            {shippingAmount === 0 ? "Gratuită" : formatPrice(shippingAmount)}
          </span>
        </div>
        <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </aside>
  );
}
