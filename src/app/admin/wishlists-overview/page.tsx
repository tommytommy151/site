"use client";

import { Trash2 } from "lucide-react";
import { useWishlistOverviewStore } from "@/lib/store/wishlists-overview-store";

export default function AdminWishlistsOverviewPage() {
  const wishlists = useWishlistOverviewStore((s) => s.wishlists);
  const deleteWishlist = useWishlistOverviewStore((s) => s.deleteWishlist);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Liste de favorite</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {wishlists.length} liste — agregate din activitatea clienților în magazin.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Produse</th>
              <th className="p-4 font-medium">Actualizat</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {wishlists.map((wishlist) => (
              <tr key={wishlist.id}>
                <td className="p-4 font-medium text-foreground">{wishlist.customerName}</td>
                <td className="p-4 max-w-md text-muted-foreground">{wishlist.products}</td>
                <td className="p-4 text-muted-foreground">{wishlist.updatedAt}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => deleteWishlist(wishlist.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {wishlists.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-muted-foreground">
                  Nicio listă de favorite înregistrată încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
