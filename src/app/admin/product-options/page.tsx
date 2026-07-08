"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useProductOptionStore, type ProductOption } from "@/lib/store/product-options-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<ProductOption, "id">;

const EMPTY_FORM: FormState = { name: "", extraPrice: 0 };

export default function AdminProductOptionsPage() {
  const productOptions = useProductOptionStore((s) => s.productOptions);
  const addProductOption = useProductOptionStore((s) => s.addProductOption);
  const updateProductOption = useProductOptionStore((s) => s.updateProductOption);
  const deleteProductOption = useProductOptionStore((s) => s.deleteProductOption);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(option: ProductOption) {
    setEditingId(option.id);
    setForm({ name: option.name, extraPrice: option.extraPrice });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateProductOption(editingId, form);
    } else {
      addProductOption(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Opțiuni produse</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Opțiuni suplimentare care pot fi adăugate la un produs (ex. ambalaj cadou, gravură),
            fiecare cu un cost suplimentar.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă opțiune
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productOptions.map((option) => (
          <div key={option.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-foreground">{option.name}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(option)}
                  aria-label="Editează"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => deleteProductOption(option.id)}
                  aria-label="Șterge"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Cost suplimentar: <span className="font-medium text-foreground">{option.extraPrice} lei</span>
            </p>
          </div>
        ))}
        {productOptions.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nu ai nicio opțiune de produs încă. Adaugă prima (ex. Ambalaj cadou).
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează opțiunea" : "Opțiune nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="option-name" className="mb-1.5">
                Nume opțiune
              </Label>
              <Input
                id="option-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Ambalaj cadou"
                required
              />
            </div>
            <div>
              <Label htmlFor="option-extra-price" className="mb-1.5">
                Cost suplimentar (lei)
              </Label>
              <Input
                id="option-extra-price"
                type="number"
                min={0}
                step="0.01"
                value={form.extraPrice}
                onChange={(e) => setForm((f) => ({ ...f, extraPrice: Number(e.target.value) }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă opțiunea"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
