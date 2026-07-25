"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, XCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { formatShippingAddress, useCheckoutStore } from "@/lib/store/checkout-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useOrderStore } from "@/lib/store/order-store";
import { shippingCost } from "@/lib/pricing";
import { trackMetaEvent } from "@/components/meta-pixel";
import type { Order } from "@/types/order";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

type Status = "loading" | "success" | "error";

// The success page can be reached again for the same order (page reload, browser
// back/forward, Stripe redirecting twice) long after the in-memory tracking ref has
// reset, so the "already fired Purchase" flag has to survive a fresh mount.
const TRACKED_PURCHASES_KEY = "eo-tracked-purchases";

function hasTrackedPurchase(orderId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const ids = JSON.parse(window.localStorage.getItem(TRACKED_PURCHASES_KEY) ?? "[]");
    return Array.isArray(ids) && ids.includes(orderId);
  } catch {
    return false;
  }
}

function markPurchaseTracked(orderId: string) {
  if (typeof window === "undefined") return;
  try {
    const ids = JSON.parse(window.localStorage.getItem(TRACKED_PURCHASES_KEY) ?? "[]");
    const next = Array.isArray(ids) ? ids.filter((id) => id !== orderId) : [];
    next.push(orderId);
    window.localStorage.setItem(TRACKED_PURCHASES_KEY, JSON.stringify(next.slice(-50)));
  } catch {
    // localStorage unavailable (private mode, quota) — worst case this reload re-fires once.
  }
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const codOrderId = searchParams.get("order");
  const isCod = searchParams.get("method") === "cod";

  // An admin logged into /admin in the same browser shares this auth store, but
  // their "email" is really just their admin username — never treat that as a
  // real customer identity here.
  const authUser = useAuthStore((s) => s.user);
  const user = authUser?.role === "customer" ? authUser : null;
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
    console.log("[checkout/success] verifying session", sessionId);
    fetch(`/api/checkout/session?id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        console.log("[checkout/success] session result", data);
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
          shippingAddress: formatShippingAddress(address),
        };
        console.log("[checkout/success] creating order", order.id);
        addOrder(order);
        clearCart();
        resetCheckout();
        setStatus("success");
      })
      .catch((err) => {
        console.error("[checkout/success] session verification failed", err);
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

  const trackedPurchase = useRef<string | null>(null);
  useEffect(() => {
    if (status !== "success" || !order || trackedPurchase.current === order.id) return;
    trackedPurchase.current = order.id;
    if (hasTrackedPurchase(order.id)) return;
    markPurchaseTracked(order.id);
    trackMetaEvent(
      "Purchase",
      {
        content_ids: order.items.map((i) => i.productId),
        num_items: order.items.reduce((sum, i) => sum + i.quantity, 0),
        value: order.total,
        currency: "RON",
      },
      order.id,
    );
  }, [status, order]);

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
