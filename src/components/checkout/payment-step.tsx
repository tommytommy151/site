"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CreditCard, Loader2, Truck } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useOrderStore } from "@/lib/store/order-store";
import { quantityUnitPrice, shippingCost } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "@/components/checkout/order-summary";
import { cn } from "@/lib/utils";
import type { Order, OrderItem } from "@/types/order";

type Method = "cod" | "card";

export function PaymentStep({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const contactName = useCheckoutStore((s) => s.contactName);
  const contactEmail = useCheckoutStore((s) => s.contactEmail);
  const address = useCheckoutStore((s) => s.address);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const setPendingOrder = useCheckoutStore((s) => s.setPendingOrder);

  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const couponDiscountPct = useCartStore((s) => s.couponDiscountPct);
  const clearCart = useCartStore((s) => s.clearCart);
  const addOrder = useOrderStore((s) => s.addOrder);

  const [method, setMethod] = useState<Method>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shipping = shippingCost(shippingMethod, subtotal);
  const discount = subtotal * (couponDiscountPct / 100);
  const total = subtotal - discount + shipping;

  const customerName = user?.name || contactName;
  const customerEmail = user?.email || contactEmail;

  function buildItems(): OrderItem[] {
    return lines.map((line) => ({
      productId: line.productId,
      name: line.name,
      image: line.image,
      quantity: line.quantity,
      price: quantityUnitPrice(line.price, line.quantity),
    }));
  }

  function buildOrder(id: string, paymentMethod: string): Order {
    return {
      id,
      number: `EO-${Date.now().toString().slice(-6)}`,
      customerName,
      customerEmail,
      date: new Date().toISOString(),
      status: "processing",
      items: buildItems(),
      subtotal,
      shipping,
      total,
      paymentMethod,
      shippingAddress: `${address.line1}, ${address.city}, ${address.county} ${address.postalCode}`.trim(),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (method === "cod") {
      const order = buildOrder(`order-${Date.now()}`, "Ramburs la livrare");
      addOrder(order);
      clearCart();
      router.push(`/checkout/success?method=cod&order=${order.id}`);
      return;
    }

    setSubmitting(true);
    const orderId = `order-${Date.now()}`;
    const items = buildItems();
    setPendingOrder(orderId, items);

    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customerEmail,
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitAmount: item.price,
          })),
          shippingAmount: shipping,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Plata cu cardul nu este disponibilă momentan.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("A apărut o eroare la conectarea cu procesatorul de plăți.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <CreditCard className="size-4 text-brand-emerald" /> Metodă de plată
          </h2>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setMethod("cod")}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                method === "cod"
                  ? "border-brand-emerald bg-brand-emerald-soft text-brand-emerald"
                  : "border-border text-foreground hover:border-foreground/30",
              )}
            >
              <span className="flex items-center gap-2">
                <Truck className="size-4" /> Ramburs la livrare
              </span>
              {method === "cod" && <Check className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMethod("card")}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                method === "card"
                  ? "border-brand-emerald bg-brand-emerald-soft text-brand-emerald"
                  : "border-border text-foreground hover:border-foreground/30",
              )}
            >
              <span className="flex items-center gap-2">
                <CreditCard className="size-4" /> Card bancar — plată securizată
              </span>
              {method === "card" && <Check className="size-4" />}
            </button>
          </div>
          {method === "card" && (
            <p className="mt-2 text-xs text-muted-foreground">
              Vei fi redirecționat către o pagină securizată pentru a introduce datele
              cardului.
            </p>
          )}
        </section>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onBack} disabled={submitting}>
            <ArrowLeft className="size-4" /> Înapoi
          </Button>
          <Button type="submit" size="lg" className="h-11 flex-1 text-[15px]" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Se procesează...
              </>
            ) : method === "cod" ? (
              `Plasează comanda — ${formatPrice(total)}`
            ) : (
              `Continuă spre plată — ${formatPrice(total)}`
            )}
          </Button>
        </div>
      </form>

      <OrderSummary shippingAmount={shipping} />
    </div>
  );
}
