"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileX } from "lucide-react";
import { useOrderStore } from "@/lib/store/order-store";
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
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/account/orders">
            <ArrowLeft className="size-4" /> Înapoi la comenzi
          </Link>
        </Button>
        {order.invoiceUrl && (
          <Button asChild>
            <a href={order.invoiceUrl} download={order.invoiceFileName ?? "factura.pdf"}>
              <Download className="size-4" /> Descarcă factura
            </a>
          </Button>
        )}
      </div>

      <div className="mx-auto w-full max-w-2xl">
        {order.invoiceUrl ? (
          <embed
            src={order.invoiceUrl}
            type="application/pdf"
            className="h-[70vh] w-full rounded-2xl border border-border"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <FileX className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Factura pentru comanda {order.number} nu este încă disponibilă
            </p>
            <p className="text-sm text-muted-foreground">
              Mai durează câteva ore până când administratorul publică factura. Revino puțin mai
              târziu sau verifică emailul — te anunțăm de îndată ce este disponibilă.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
