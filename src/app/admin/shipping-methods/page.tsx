"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useShippingMethodStore, type ShippingMethod } from "@/lib/store/shipping-methods-store";
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

type FormState = Omit<ShippingMethod, "id">;

const EMPTY_FORM: FormState = { name: "", price: 0, active: true };

export default function AdminShippingMethodsPage() {
  const shippingMethods = useShippingMethodStore((s) => s.shippingMethods);
  const addShippingMethod = useShippingMethodStore((s) => s.addShippingMethod);
  const updateShippingMethod = useShippingMethodStore((s) => s.updateShippingMethod);
  const deleteShippingMethod = useShippingMethodStore((s) => s.deleteShippingMethod);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(method: ShippingMethod) {
    setEditingId(method.id);
    setForm({ name: method.name, price: method.price, active: method.active });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateShippingMethod(editingId, form);
    } else {
      addShippingMethod(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Plată & livrare</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {shippingMethods.length} metode de livrare disponibile la checkout.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă metodă
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Nume</th>
              <th className="p-4 font-medium">Preț</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shippingMethods.map((method) => (
              <tr key={method.id}>
                <td className="p-4 font-medium text-foreground">{method.name}</td>
                <td className="p-4 text-muted-foreground">
                  {method.price === 0 ? "Gratuit" : `${method.price.toFixed(2)} lei`}
                </td>
                <td className="p-4">
                  <span
                    className={
                      method.active
                        ? "rounded-full bg-brand-emerald-soft px-2.5 py-1 text-xs font-medium text-brand-emerald"
                        : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {method.active ? "Activ" : "Inactiv"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(method)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteShippingMethod(method.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {shippingMethods.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                  Nu ai nicio metodă de livrare încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează metoda" : "Metodă de livrare nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="ship-name" className="mb-1.5">
                Nume
              </Label>
              <Input
                id="ship-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Curier rapid"
                required
              />
            </div>
            <div>
              <Label htmlFor="ship-price" className="mb-1.5">
                Preț (lei)
              </Label>
              <Input
                id="ship-price"
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
                required
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Activă</p>
                <p className="text-xs text-muted-foreground">
                  Doar metodele active pot fi alese la checkout
                </p>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă metoda"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
