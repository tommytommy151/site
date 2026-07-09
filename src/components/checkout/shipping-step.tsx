"use client";

import { useState } from "react";
import { ArrowLeft, Truck } from "lucide-react";
import { useAccountStore } from "@/lib/store/account-store";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { useCartStore } from "@/lib/store/cart-store";
import { SHIPPING_METHODS, shippingCost } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderSummary } from "@/components/checkout/order-summary";
import { cn } from "@/lib/utils";

export function ShippingStep({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const defaultAddress = useAccountStore((s) => s.addresses.find((a) => a.isDefault));
  const storedAddress = useCheckoutStore((s) => s.address);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const setAddress = useCheckoutStore((s) => s.setAddress);
  const setShippingMethod = useCheckoutStore((s) => s.setShippingMethod);
  const subtotal = useCartStore((s) => s.subtotal());

  const hasStoredAddress = storedAddress.line1 !== "";
  const [form, setForm] = useState(
    hasStoredAddress
      ? storedAddress
      : defaultAddress
        ? {
            fullName: defaultAddress.fullName,
            phone: defaultAddress.phone,
            line1: defaultAddress.line1,
            city: defaultAddress.city,
            county: defaultAddress.county,
            postalCode: defaultAddress.postalCode,
          }
        : { fullName: "", phone: "", line1: "", city: "", county: "", postalCode: "" },
  );
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.line1.trim() || !form.city.trim() || !form.phone.trim()) {
      setError("Completează toate câmpurile obligatorii.");
      return;
    }
    setAddress(form);
    onDone();
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <Truck className="size-4 text-brand-emerald" /> Adresă de livrare
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName" className="mb-1.5">
                Nume complet
              </Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="phone" className="mb-1.5">
                Telefon
              </Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="line1" className="mb-1.5">
                Adresă
              </Label>
              <Input
                id="line1"
                value={form.line1}
                onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="city" className="mb-1.5">
                Oraș
              </Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="county" className="mb-1.5">
                Județ / Sector
              </Label>
              <Input
                id="county"
                value={form.county}
                onChange={(e) => setForm((f) => ({ ...f, county: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="postalCode" className="mb-1.5">
                Cod poștal
              </Label>
              <Input
                id="postalCode"
                value={form.postalCode}
                onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-base font-semibold text-foreground">Metodă de livrare</h2>
          <div className="flex flex-col gap-2.5">
            {SHIPPING_METHODS.map((method) => {
              const cost = shippingCost(method.id, subtotal);
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setShippingMethod(method.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    shippingMethod === method.id
                      ? "border-brand-emerald bg-brand-emerald-soft text-brand-emerald"
                      : "border-border text-foreground hover:border-foreground/30",
                  )}
                >
                  <span>
                    <span className="font-medium">{method.label}</span>
                    <span className="ml-2 text-muted-foreground">{method.eta}</span>
                  </span>
                  <span className="font-semibold">
                    {cost === 0 ? "Gratuită" : formatPrice(cost)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="size-4" /> Înapoi
          </Button>
          <Button type="submit" size="lg" className="h-11 flex-1 text-[15px]">
            Continuă la plată
          </Button>
        </div>
      </form>

      <OrderSummary shippingAmount={shippingCost(shippingMethod, subtotal)} />
    </div>
  );
}
