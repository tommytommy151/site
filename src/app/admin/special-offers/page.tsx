"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useSpecialOfferStore, type SpecialOffer } from "@/lib/store/special-offers-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<SpecialOffer, "id">;

const EMPTY_FORM: FormState = {
  title: "",
  discountPct: 10,
  startDate: "",
  endDate: "",
  active: true,
};

export default function AdminSpecialOffersPage() {
  const specialOffers = useSpecialOfferStore((s) => s.specialOffers);
  const addSpecialOffer = useSpecialOfferStore((s) => s.addSpecialOffer);
  const updateSpecialOffer = useSpecialOfferStore((s) => s.updateSpecialOffer);
  const deleteSpecialOffer = useSpecialOfferStore((s) => s.deleteSpecialOffer);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(offer: SpecialOffer) {
    setEditingId(offer.id);
    setForm({
      title: offer.title,
      discountPct: offer.discountPct,
      startDate: offer.startDate,
      endDate: offer.endDate,
      active: offer.active,
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingId) {
      updateSpecialOffer(editingId, form);
    } else {
      addSpecialOffer(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Oferte promoționale</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {specialOffers.length} oferte — perioade limitate cu reducere procentuală.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă ofertă
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Titlu</th>
              <th className="p-4 font-medium">Reducere</th>
              <th className="p-4 font-medium">Început</th>
              <th className="p-4 font-medium">Sfârșit</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {specialOffers.map((offer) => (
              <tr key={offer.id}>
                <td className="p-4 font-medium text-foreground">{offer.title}</td>
                <td className="p-4 text-muted-foreground">{offer.discountPct}%</td>
                <td className="p-4 text-muted-foreground">{offer.startDate}</td>
                <td className="p-4 text-muted-foreground">{offer.endDate}</td>
                <td className="p-4">
                  <span
                    className={
                      offer.active
                        ? "rounded-full bg-brand-emerald-soft px-2.5 py-1 text-xs font-medium text-brand-emerald"
                        : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {offer.active ? "Activă" : "Inactivă"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(offer)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSpecialOffer(offer.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {specialOffers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted-foreground">
                  Nicio ofertă promoțională încă. Adaugă prima.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează oferta" : "Ofertă nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="offer-title" className="mb-1.5">
                Titlu
              </Label>
              <Input
                id="offer-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="ex. Ofertă de vară"
                required
              />
            </div>
            <div>
              <Label htmlFor="offer-pct" className="mb-1.5">
                Reducere (%)
              </Label>
              <Input
                id="offer-pct"
                type="number"
                min={1}
                max={100}
                value={form.discountPct}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountPct: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offer-start" className="mb-1.5">
                  Data început
                </Label>
                <Input
                  id="offer-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="offer-end" className="mb-1.5">
                  Data sfârșit
                </Label>
                <Input
                  id="offer-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Activă</p>
                <p className="text-xs text-muted-foreground">
                  Doar ofertele active sunt vizibile clienților
                </p>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă oferta"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
