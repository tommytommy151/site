"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTaxRateStore, type TaxRate } from "@/lib/store/tax-rates-store";
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

type FormState = Omit<TaxRate, "id">;

const EMPTY_FORM: FormState = { name: "", ratePct: 19, region: "" };

export default function AdminTaxRatesPage() {
  const taxRates = useTaxRateStore((s) => s.taxRates);
  const addTaxRate = useTaxRateStore((s) => s.addTaxRate);
  const updateTaxRate = useTaxRateStore((s) => s.updateTaxRate);
  const deleteTaxRate = useTaxRateStore((s) => s.deleteTaxRate);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(taxRate: TaxRate) {
    setEditingId(taxRate.id);
    setForm({ name: taxRate.name, ratePct: taxRate.ratePct, region: taxRate.region });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.region.trim()) return;
    if (editingId) {
      updateTaxRate(editingId, form);
    } else {
      addTaxRate(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Taxe & locații</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {taxRates.length} cote de taxare aplicate în funcție de regiune.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă cotă
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Nume</th>
              <th className="p-4 font-medium">Cotă</th>
              <th className="p-4 font-medium">Regiune</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {taxRates.map((taxRate) => (
              <tr key={taxRate.id}>
                <td className="p-4 font-medium text-foreground">{taxRate.name}</td>
                <td className="p-4 text-muted-foreground">{taxRate.ratePct}%</td>
                <td className="p-4 text-muted-foreground">{taxRate.region}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(taxRate)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTaxRate(taxRate.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {taxRates.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                  Nu ai nicio cotă de taxare încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează cota" : "Cotă nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="tax-name" className="mb-1.5">
                Nume
              </Label>
              <Input
                id="tax-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. TVA standard"
                required
              />
            </div>
            <div>
              <Label htmlFor="tax-rate" className="mb-1.5">
                Cotă (%)
              </Label>
              <Input
                id="tax-rate"
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={form.ratePct}
                onChange={(e) => setForm((f) => ({ ...f, ratePct: Number(e.target.value) || 0 }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="tax-region" className="mb-1.5">
                Regiune
              </Label>
              <Input
                id="tax-region"
                value={form.region}
                onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                placeholder="ex. România"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă cota"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
