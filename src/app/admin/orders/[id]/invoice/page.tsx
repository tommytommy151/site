"use client";

import { use, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Trash2, Upload } from "lucide-react";
import { useOrderStore } from "@/lib/store/order-store";
import { Button } from "@/components/ui/button";

export default function OrderInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orders = useOrderStore((s) => s.orders);
  const setOrderInvoice = useOrderStore((s) => s.setOrderInvoice);
  const removeOrderInvoice = useOrderStore((s) => s.removeOrderInvoice);
  const order = orders.find((o) => o.id === id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-lg font-medium text-foreground">Comanda nu a fost găsită.</p>
        <Button asChild variant="outline">
          <Link href="/admin/orders">
            <ArrowLeft className="size-4" /> Înapoi la comenzi
          </Link>
        </Button>
      </div>
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    if (file.type !== "application/pdf") {
      setError("Te rog încarcă un fișier PDF.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setOrderInvoice(order.id, String(reader.result), file.name);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/admin/orders">
            <ArrowLeft className="size-4" /> Înapoi la comenzi
          </Link>
        </Button>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-xl font-semibold tracking-tight">
          Factură — comanda {order.number}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {order.customerName} · {order.customerEmail}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {order.invoiceUrl ? (
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-brand-emerald" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {order.invoiceFileName ?? "factura.pdf"}
                  </p>
                  <p className="text-xs text-muted-foreground">Factură încărcată</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="size-3.5" /> Înlocuiește
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeOrderInvoice(order.id)}
                >
                  <Trash2 className="size-3.5" /> Șterge
                </Button>
              </div>
            </div>
            <embed
              src={order.invoiceUrl}
              type="application/pdf"
              className="h-[600px] w-full rounded-2xl border border-border"
            />
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Upload className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Nicio factură încărcată</p>
            <p className="text-sm text-muted-foreground">
              Încarcă manual factura (PDF) pentru această comandă.
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" /> Încarcă factura
            </Button>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
