"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useDiscountStore, type Discount, type DiscountType } from "@/lib/store/discounts-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<Discount, "id">;

const EMPTY_FORM: FormState = { name: "", type: "percent", value: 10, appliesTo: "" };

const TYPE_LABELS: Record<DiscountType, string> = {
  percent: "Procentual",
  fixed: "Sumă fixă",
};

export default function AdminDiscountsPage() {
  const discounts = useDiscountStore((s) => s.discounts);
  const addDiscount = useDiscountStore((s) => s.addDiscount);
  const updateDiscount = useDiscountStore((s) => s.updateDiscount);
  const deleteDiscount = useDiscountStore((s) => s.deleteDiscount);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(discount: Discount) {
    setEditingId(discount.id);
    setForm({
      name: discount.name,
      type: discount.type,
      value: discount.value,
      appliesTo: discount.appliesTo,
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateDiscount(editingId, form);
    } else {
      addDiscount(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reduceri</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {discounts.length} reduceri — aplicate automat categoriilor sau comenzilor eligibile.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă reducere
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Nume</th>
              <th className="p-4 font-medium">Tip</th>
              <th className="p-4 font-medium">Valoare</th>
              <th className="p-4 font-medium">Se aplică la</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {discounts.map((discount) => (
              <tr key={discount.id}>
                <td className="p-4 font-medium text-foreground">{discount.name}</td>
                <td className="p-4 text-muted-foreground">{TYPE_LABELS[discount.type]}</td>
                <td className="p-4 text-muted-foreground">
                  {discount.type === "percent" ? `${discount.value}%` : `${discount.value} lei`}
                </td>
                <td className="p-4 text-muted-foreground">{discount.appliesTo}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(discount)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteDiscount(discount.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-muted-foreground">
                  Nicio reducere încă. Adaugă prima.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează reducerea" : "Reducere nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="discount-name" className="mb-1.5">
                Nume
              </Label>
              <Input
                id="discount-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Reducere îngrijire ten"
                required
              />
            </div>
            <div>
              <Label className="mb-1.5">Tip</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm((f) => ({ ...f, type: value as DiscountType }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Procentual</SelectItem>
                  <SelectItem value="fixed">Sumă fixă</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discount-value" className="mb-1.5">
                Valoare {form.type === "percent" ? "(%)" : "(lei)"}
              </Label>
              <Input
                id="discount-value"
                type="number"
                min={0}
                value={form.value}
                onChange={(e) =>
                  setForm((f) => ({ ...f, value: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="discount-applies" className="mb-1.5">
                Se aplică la
              </Label>
              <Input
                id="discount-applies"
                value={form.appliesTo}
                onChange={(e) => setForm((f) => ({ ...f, appliesTo: e.target.value }))}
                placeholder="ex. Categoria Parfumuri"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă reducerea"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
