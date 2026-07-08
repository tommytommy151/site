"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  usePaymentMethodStore,
  type PaymentMethod,
} from "@/lib/store/payment-methods-store";
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

type FormState = Omit<PaymentMethod, "id">;

const EMPTY_FORM: FormState = { name: "", provider: "", enabled: true };

export default function AdminPaymentMethodsPage() {
  const paymentMethods = usePaymentMethodStore((s) => s.paymentMethods);
  const addPaymentMethod = usePaymentMethodStore((s) => s.addPaymentMethod);
  const updatePaymentMethod = usePaymentMethodStore((s) => s.updatePaymentMethod);
  const deletePaymentMethod = usePaymentMethodStore((s) => s.deletePaymentMethod);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(method: PaymentMethod) {
    setEditingId(method.id);
    setForm({ name: method.name, provider: method.provider, enabled: method.enabled });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updatePaymentMethod(editingId, form);
    } else {
      addPaymentMethod(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Plăți</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Metodele de plată disponibile la finalizarea comenzii.
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
              <th className="p-4 font-medium">Furnizor</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paymentMethods.map((method) => (
              <tr key={method.id}>
                <td className="p-4 font-medium text-foreground">{method.name}</td>
                <td className="p-4 text-muted-foreground">{method.provider}</td>
                <td className="p-4">
                  <Switch
                    checked={method.enabled}
                    onCheckedChange={(checked) =>
                      updatePaymentMethod(method.id, { ...method, enabled: checked })
                    }
                  />
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
                      onClick={() => deletePaymentMethod(method.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paymentMethods.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                  Nu ai nicio metodă de plată încă. Adaugă prima.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează metoda" : "Metodă nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="pay-name" className="mb-1.5">
                Nume metodă
              </Label>
              <Input
                id="pay-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Card bancar online"
                required
              />
            </div>
            <div>
              <Label htmlFor="pay-provider" className="mb-1.5">
                Furnizor
              </Label>
              <Input
                id="pay-provider"
                value={form.provider}
                onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
                placeholder="ex. Stripe"
                required
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Activă</p>
                <p className="text-xs text-muted-foreground">
                  Doar metodele active apar la checkout
                </p>
              </div>
              <Switch
                checked={form.enabled}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, enabled: checked }))}
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
