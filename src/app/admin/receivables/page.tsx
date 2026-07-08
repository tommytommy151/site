"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useReceivableStore, type Receivable } from "@/lib/store/receivables-store";
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

type FormState = Omit<Receivable, "id">;

const EMPTY_FORM: FormState = {
  customerName: "",
  amount: 0,
  dueDate: "",
  status: "unpaid",
};

export default function AdminReceivablesPage() {
  const receivables = useReceivableStore((s) => s.receivables);
  const addReceivable = useReceivableStore((s) => s.addReceivable);
  const updateReceivable = useReceivableStore((s) => s.updateReceivable);
  const deleteReceivable = useReceivableStore((s) => s.deleteReceivable);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(receivable: Receivable) {
    setEditingId(receivable.id);
    setForm({
      customerName: receivable.customerName,
      amount: receivable.amount,
      dueDate: receivable.dueDate,
      status: receivable.status,
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName.trim() || !form.dueDate.trim()) return;
    if (editingId) {
      updateReceivable(editingId, form);
    } else {
      addReceivable(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Creanțe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {receivables.length} creanțe — sume de încasat de la clienți.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă creanță
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Sumă</th>
              <th className="p-4 font-medium">Scadență</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {receivables.map((receivable) => (
              <tr key={receivable.id}>
                <td className="p-4 font-medium text-foreground">{receivable.customerName}</td>
                <td className="p-4 text-muted-foreground">{receivable.amount} lei</td>
                <td className="p-4 text-muted-foreground">{receivable.dueDate}</td>
                <td className="p-4">
                  <span
                    className={
                      receivable.status === "paid"
                        ? "rounded-full bg-brand-emerald-soft px-2.5 py-1 text-xs font-medium text-brand-emerald"
                        : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
                    }
                  >
                    {receivable.status === "paid" ? "Achitat" : "Neachitat"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(receivable)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteReceivable(receivable.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {receivables.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-sm text-muted-foreground">
                  Nu ai nicio creanță înregistrată. Adaugă prima.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează creanța" : "Creanță nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="receivable-customer" className="mb-1.5">
                Client
              </Label>
              <Input
                id="receivable-customer"
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                placeholder="ex. Ana Popescu"
                required
              />
            </div>
            <div>
              <Label htmlFor="receivable-amount" className="mb-1.5">
                Sumă (lei)
              </Label>
              <Input
                id="receivable-amount"
                type="number"
                min={0}
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="receivable-due" className="mb-1.5">
                Scadență
              </Label>
              <Input
                id="receivable-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label className="mb-1.5">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, status: value as Receivable["status"] }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Alege statusul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Neachitat</SelectItem>
                  <SelectItem value="paid">Achitat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă creanța"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
