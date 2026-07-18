"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Truck } from "lucide-react";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import { useOrderStore } from "@/lib/store/order-store";
import { quantityLineTotal, quantityUnitPrice, shippingCost } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function QuickOrderForm({ product }: { product: Product }) {
  const router = useRouter();
  const addOrder = useOrderStore((s) => s.addOrder);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const unitPrice = quantityUnitPrice(product.price, quantity);
  const shipping = shippingCost("express", unitPrice * quantity);
  const total = quantityLineTotal(product.price, quantity) + shipping;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) return setError("Introdu numele tău complet.");
    if (!phone.trim()) return setError("Introdu un număr de telefon.");
    if (!address.trim() || !city.trim()) return setError("Introdu adresa de livrare.");

    setSubmitting(true);

    const orderId = `order-${Date.now()}`;
    const order: Order = {
      id: orderId,
      number: `EO-${Date.now().toString().slice(-6)}`,
      customerName: fullName.trim(),
      customerEmail: "",
      customerPhone: phone.trim(),
      date: new Date().toISOString(),
      status: "processing",
      items: [
        {
          productId: product.id,
          name: product.name,
          image: product.images[0] ?? "",
          quantity,
          price: unitPrice,
        },
      ],
      subtotal: quantityLineTotal(product.price, quantity),
      shipping,
      total,
      paymentMethod: "Ramburs la livrare",
      shippingAddress: `${address.trim()}, ${city.trim()}`,
    };

    addOrder(order);
    router.push(`/checkout/success?method=cod&order=${order.id}`);
  }

  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Truck className="size-5 text-brand-emerald" />
        <p className="text-sm font-semibold text-foreground">
          Comandă rapidă — plată ramburs la livrare
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="qo-name" className="mb-1.5">
              Nume complet
            </Label>
            <Input
              id="qo-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ion Popescu"
              required
            />
          </div>
          <div>
            <Label htmlFor="qo-phone" className="mb-1.5">
              Telefon
            </Label>
            <Input
              id="qo-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07xx xxx xxx"
              required
            />
          </div>
          <div>
            <Label htmlFor="qo-address" className="mb-1.5">
              Adresă de livrare
            </Label>
            <Input
              id="qo-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Strada, număr, bloc, ap."
              required
            />
          </div>
          <div>
            <Label htmlFor="qo-city" className="mb-1.5">
              Localitate
            </Label>
            <Input
              id="qo-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Oraș, județ"
              required
            />
          </div>
          <div>
            <Label htmlFor="qo-qty" className="mb-1.5">
              Cantitate
            </Label>
            <Input
              id="qo-qty"
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Total de plată: <span className="font-semibold text-foreground">{formatPrice(total)}</span>
          </p>
          <Button type="submit" size="lg" className="h-11 sm:min-w-56" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Se trimite...
              </>
            ) : (
              `Comandă acum — ${formatPrice(total)}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
