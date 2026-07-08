"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  useCustomerFieldStore,
  type CustomerField,
} from "@/lib/store/customer-fields-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

type FormState = Omit<CustomerField, "id">;

const EMPTY_FORM: FormState = { label: "", type: "text", required: false };

const TYPE_LABELS: Record<CustomerField["type"], string> = {
  text: "Text",
  number: "Număr",
  select: "Listă (select)",
};

export default function AdminCustomerFieldsPage() {
  const customerFields = useCustomerFieldStore((s) => s.customerFields);
  const addCustomerField = useCustomerFieldStore((s) => s.addCustomerField);
  const updateCustomerField = useCustomerFieldStore((s) => s.updateCustomerField);
  const deleteCustomerField = useCustomerFieldStore((s) => s.deleteCustomerField);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(field: CustomerField) {
    setEditingId(field.id);
    setForm({ label: field.label, type: field.type, required: field.required });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim()) return;
    if (editingId) {
      updateCustomerField(editingId, form);
    } else {
      addCustomerField(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Câmpuri clienți</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customerFields.length} câmpuri personalizate colectate la înregistrarea clienților.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă câmp
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Etichetă</th>
              <th className="p-4 font-medium">Tip</th>
              <th className="p-4 font-medium">Obligatoriu</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customerFields.map((field) => (
              <tr key={field.id}>
                <td className="p-4 font-medium text-foreground">{field.label}</td>
                <td className="p-4 text-muted-foreground">{TYPE_LABELS[field.type]}</td>
                <td className="p-4">
                  <span
                    className={
                      field.required
                        ? "rounded-full bg-brand-emerald-soft px-2.5 py-1 text-xs font-medium text-brand-emerald"
                        : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {field.required ? "Da" : "Nu"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(field)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCustomerField(field.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {customerFields.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                  Nu ai niciun câmp personalizat încă. Adaugă primul.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează câmpul" : "Câmp nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="field-label" className="mb-1.5">
                Etichetă
              </Label>
              <Input
                id="field-label"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="ex. CNP"
                required
              />
            </div>
            <div>
              <Label className="mb-1.5">Tip câmp</Label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, type: value as CustomerField["type"] }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Alege tipul" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Număr</SelectItem>
                  <SelectItem value="select">Listă (select)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Obligatoriu</p>
                <p className="text-xs text-muted-foreground">
                  Clientul trebuie să completeze acest câmp
                </p>
              </div>
              <Switch
                checked={form.required}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, required: checked }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă câmpul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
