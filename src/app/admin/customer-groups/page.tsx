"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  useCustomerGroupStore,
  type CustomerGroup,
} from "@/lib/store/customer-groups-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<CustomerGroup, "id">;

const EMPTY_FORM: FormState = { name: "", discountPct: 5, description: "" };

export default function AdminCustomerGroupsPage() {
  const customerGroups = useCustomerGroupStore((s) => s.customerGroups);
  const addCustomerGroup = useCustomerGroupStore((s) => s.addCustomerGroup);
  const updateCustomerGroup = useCustomerGroupStore((s) => s.updateCustomerGroup);
  const deleteCustomerGroup = useCustomerGroupStore((s) => s.deleteCustomerGroup);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(group: CustomerGroup) {
    setEditingId(group.id);
    setForm({
      name: group.name,
      discountPct: group.discountPct,
      description: group.description,
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateCustomerGroup(editingId, form);
    } else {
      addCustomerGroup(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Grupuri clienți</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Segmentează clienții și oferă reduceri automate pe grup.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă grup
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {customerGroups.map((group) => (
          <div key={group.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">{group.name}</p>
                <span className="mt-1 inline-block rounded-full bg-brand-emerald-soft px-2.5 py-1 text-xs font-medium text-brand-emerald">
                  {group.discountPct}% reducere
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(group)}
                  aria-label="Editează"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => deleteCustomerGroup(group.id)}
                  aria-label="Șterge"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{group.description}</p>
          </div>
        ))}
        {customerGroups.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nu ai niciun grup de clienți încă. Adaugă primul.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează grupul" : "Grup nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="group-name" className="mb-1.5">
                Nume grup
              </Label>
              <Input
                id="group-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Clienți VIP"
                required
              />
            </div>
            <div>
              <Label htmlFor="group-pct" className="mb-1.5">
                Reducere (%)
              </Label>
              <Input
                id="group-pct"
                type="number"
                min={0}
                max={100}
                value={form.discountPct}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountPct: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="group-desc" className="mb-1.5">
                Descriere
              </Label>
              <Textarea
                id="group-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="min-h-20"
                placeholder="Cine face parte din acest grup"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă grupul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
