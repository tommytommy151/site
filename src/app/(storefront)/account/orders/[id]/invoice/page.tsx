"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { useOrderStore } from "@/lib/store/order-store";
import { formatDate, formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function AccountOrderInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orders = useOrderStore((s) => s.orders);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-lg font-medium text-foreground">Comanda nu a fost găsită.</p>
        <Button asChild variant="outline">
          <Link href="/account/orders">
            <ArrowLeft className="size-4" /> Înapoi la comenzi
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between print:hidden">
        <Button asChild variant="outline">
          <Link href="/account/orders">
            <ArrowLeft className="size-4" /> Înapoi la comenzi
          </Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="size-4" /> Descarcă factura
        </Button>
      </div>

      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-8 sm:p-10 print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-heading text-xl font-semibold tracking-tight">
              Estela<span className="text-brand-emerald">Oferta</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">EstelaOferta Commerce SRL</p>
            <p className="text-xs text-muted-foreground">CUI RO00000000 · Reg. Com. J00/000/2026</p>
            <p className="text-xs text-muted-foreground">România</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">Factură</p>
            <p className="mt-1 text-sm text-muted-foreground">{order.number}</p>
            <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl bg-secondary p-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Facturat către</p>
            <p className="mt-1 font-medium text-foreground">{order.customerName}</p>
            <p className="text-muted-foreground">{order.customerEmail}</p>
            <p className="text-muted-foreground">{order.shippingAddress}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Plată</p>
            <p className="mt-1 text-foreground">{order.paymentMethod}</p>
          </div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="pb-2 font-medium">Produs</th>
              <th className="pb-2 text-center font-medium">Cant.</th>
              <th className="pb-2 text-right font-medium">Preț</th>
              <th className="pb-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted print:hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <p className="text-foreground">{item.name}</p>
                  </div>
                </td>
                <td className="py-3 text-center text-muted-foreground">{item.quantity}</td>
                <td className="py-3 text-right text-muted-foreground">
                  {formatPrice(item.price)}
                </td>
                <td className="py-3 text-right font-medium text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Livrare</span>
            <span className="text-foreground">
              {order.shipping === 0 ? "Gratuită" : formatPrice(order.shipping)}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Mulțumim pentru comandă — EstelaOferta Commerce SRL
        </p>
      </div>
    </div>
  );
}
