"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { usePromotionStore, type Promotion } from "@/lib/store/promotions-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<Promotion, "id">;

const EMPTY_FORM: FormState = { name: "", description: "", active: true };

export default function AdminPromotionsPage() {
  const promotions = usePromotionStore((s) => s.promotions);
  const addPromotion = usePromotionStore((s) => s.addPromotion);
  const updatePromotion = usePromotionStore((s) => s.updatePromotion);
  const deletePromotion = usePromotionStore((s) => s.deletePromotion);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(promotion: Promotion) {
    setEditingId(promotion.id);
    setForm({
      name: promotion.name,
      description: promotion.description,
      active: promotion.active,
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updatePromotion(editingId, form);
    } else {
      addPromotion(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Promoții</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {promotions.length} promoții — mecanisme active în magazin (ex. 2+1 gratis).
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă promoție
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-foreground">{promotion.name}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(promotion)}
                  aria-label="Editează"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => deletePromotion(promotion.id)}
                  aria-label="Șterge"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{promotion.description}</p>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-medium text-foreground">
                {promotion.active ? "Activă" : "Inactivă"}
              </span>
              <Switch
                checked={promotion.active}
                onCheckedChange={(checked) =>
                  updatePromotion(promotion.id, { ...promotion, active: checked })
                }
              />
            </div>
          </div>
        ))}
        {promotions.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nicio promoție încă. Adaugă prima.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează promoția" : "Promoție nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="promo-name" className="mb-1.5">
                Nume
              </Label>
              <Input
                id="promo-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. 2+1 gratis"
                required
              />
            </div>
            <div>
              <Label htmlFor="promo-description" className="mb-1.5">
                Descriere
              </Label>
              <Textarea
                id="promo-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Descrie mecanismul promoției"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Activă</p>
                <p className="text-xs text-muted-foreground">
                  Doar promoțiile active sunt vizibile clienților
                </p>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă promoția"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
