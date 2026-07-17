"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { trackMetaEvent } from "@/components/meta-pixel";
import { CheckoutStepIndicator, type CheckoutStep } from "@/components/checkout/checkout-step-indicator";
import { AccountStep } from "@/components/checkout/account-step";
import { ShippingStep } from "@/components/checkout/shipping-step";
import { PaymentStep } from "@/components/checkout/payment-step";

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // An admin logged into /admin in the same browser shares this auth store, but
  // that's not a real customer session — don't let it skip the account step.
  const authUser = useAuthStore((s) => s.user);
  const isCustomer = authUser?.role === "customer";
  const lines = useCartStore((s) => s.lines);

  const stepParam = searchParams.get("step") as CheckoutStep | null;
  const [step, setStep] = useState<CheckoutStep>(stepParam ?? (isCustomer ? "livrare" : "cont"));

  const trackedInitiate = useRef(false);
  useEffect(() => {
    if (trackedInitiate.current || lines.length === 0) return;
    trackedInitiate.current = true;
    trackMetaEvent("InitiateCheckout", {
      content_ids: lines.map((l) => l.productId),
      num_items: lines.reduce((sum, l) => sum + l.quantity, 0),
      value: lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      currency: "RON",
    });
  }, [lines]);

  function goTo(next: CheckoutStep) {
    setStep(next);
    router.replace(`/checkout?step=${next}`);
  }

  if (lines.length === 0) {
    return (
      <div className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Coșul tău este gol</p>
            <Button asChild className="mt-2">
              <Link href="/products">Continuă cumpărăturile</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <h1 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">
          Finalizează comanda
        </h1>
        <CheckoutStepIndicator step={step} />

        {step === "cont" && <AccountStep onDone={() => goTo("livrare")} />}
        {step === "livrare" && (
          <ShippingStep onDone={() => goTo("plata")} onBack={() => goTo("cont")} />
        )}
        {step === "plata" && <PaymentStep onBack={() => goTo("livrare")} />}
      </Container>
    </div>
  );
}
