"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, XCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useOrderStore } from "@/lib/store/order-store";
import { shippingCost } from "@/lib/pricing";
import type { Order } from "@/types/order";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

type Status = "loading" | "success" | "error";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const codOrderId = searchParams.get("order");
  const isCod = searchParams.get("method") === "cod";

  const user = useAuthStore((s) => s.user);
  const contactName = useCheckoutStore((s) => s.contactName);
  const contactEmail = useCheckoutStore((s) => s.contactEmail);
  const address = useCheckoutStore((s) => s.address);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const pendingOrderId = useCheckoutStore((s) => s.pendingOrderId);
  const pendingItems = useCheckoutStore((s) => s.pendingItems);
  const resetCheckout = useCheckoutStore((s) => s.reset);

  const orders = useOrderStore((s) => s.orders);
  const addOrder = useOrderStore((s) => s.addOrder);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal());

  const [status, setStatus] = useState<Status>(isCod ? "success" : "loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isCod) return;
    if (!sessionId) {
      setStatus("error");
      setError("Sesiune de plată invalidă.");
      return;
    }
    if (pendingOrderId && orders.some((o) => o.id === pendingOrderId)) {
      setStatus("success");
      return;
    }

    let cancelled = false;
    fetch(`/api/checkout/session?id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.paid) {
          setStatus("error");
          setError("Plata nu a fost confirmată.");
          return;
        }
        const orderId = data.orderId || pendingOrderId;
        if (!orderId || orders.some((o) => o.id === orderId)) {
          setStatus("success");
          return;
        }

        const shipping = shippingCost(shippingMethod, subtotal);
        const total = pendingItems.reduce((sum, i) => sum + i.price * i.quantity, 0) + shipping;
        const order: Order = {
          id: orderId,
          number: `EO-${orderId.slice(-6)}`,
          customerName: user?.name || contactName,
          customerEmail: user?.email || contactEmail,
          date: new Date().toISOString(),
          status: "processing",
          items: pendingItems,
          subtotal: total - shipping,
          shipping,
          total,
          paymentMethod: "Card bancar",
          shippingAddress: `${address.line1}, ${address.city}, ${address.county} ${address.postalCode}`.trim(),
        };
        addOrder(order);
        clearCart();
        resetCheckout();
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          setError("Nu am putut verifica plata. Contactează-ne dacă suma a fost reținută.");
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, isCod]);

  const orderId = isCod ? codOrderId : pendingOrderId;
  const order = orderId ? orders.find((o) => o.id === orderId) : undefined;

  return (
    <div className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Confirmăm plata...</p>
            </>
          )}

          {status === "error" && (
            <>
              <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
                <XCircle className="size-6 text-destructive" />
              </span>
              <h1 className="text-2xl font-semibold tracking-tight">Plata nu a putut fi confirmată</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button asChild className="mt-2">
                <Link href="/checkout">Înapoi la checkout</Link>
              </Button>
            </>
          )}

          {status === "success" && (
            <>
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-emerald-soft">
                <Check className="size-6 text-brand-emerald" />
              </span>
              <h1 className="text-2xl font-semibold tracking-tight">
                Comanda ta a fost plasată cu succes
              </h1>
              <p className="text-sm text-muted-foreground">
                {order
                  ? `Comanda ${order.number} a fost înregistrată. Vei primi un email de confirmare în scurt timp.`
                  : "Comanda a fost înregistrată. Vei primi un email de confirmare în scurt timp."}
              </p>
              <div className="mt-2 flex gap-3">
                {order && (
                  <Button asChild variant="outline">
                    <Link href={`/account/orders/${order.id}/invoice`}>Vezi factura</Link>
                  </Button>
                )}
                <Button asChild>
                  <Link href="/products">Continuă cumpărăturile</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
