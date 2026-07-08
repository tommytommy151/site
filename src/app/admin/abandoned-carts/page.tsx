"use client";

import { Trash2 } from "lucide-react";
import { useAbandonedCartStore } from "@/lib/store/abandoned-carts-store";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminAbandonedCartsPage() {
  const abandonedCarts = useAbandonedCartStore((s) => s.abandonedCarts);
  const deleteAbandonedCart = useAbandonedCartStore((s) => s.deleteAbandonedCart);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Coșuri abandonate</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {abandonedCarts.length} coșuri abandonate — clienți care au adăugat produse dar nu au
            finalizat comanda.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Produse</th>
              <th className="p-4 font-medium">Valoare</th>
              <th className="p-4 font-medium">Abandonat la</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {abandonedCarts.map((cart) => (
              <tr key={cart.id}>
                <td className="p-4 font-medium text-foreground">{cart.email}</td>
                <td className="p-4 text-muted-foreground">{cart.items}</td>
                <td className="p-4 text-muted-foreground">{cart.value} lei</td>
                <td className="p-4 text-muted-foreground">{formatDate(cart.abandonedAt)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => deleteAbandonedCart(cart.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {abandonedCarts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-sm text-muted-foreground">
                  Nu există coșuri abandonate momentan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
