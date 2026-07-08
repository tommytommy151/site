"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  useAvailabilityLabelStore,
  type AvailabilityLabel,
} from "@/lib/store/availability-labels-store";
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

type FormState = Omit<AvailabilityLabel, "id">;

const EMPTY_FORM: FormState = { text: "", color: "#16a34a" };

export default function AdminAvailabilityLabelsPage() {
  const availabilityLabels = useAvailabilityLabelStore((s) => s.availabilityLabels);
  const addAvailabilityLabel = useAvailabilityLabelStore((s) => s.addAvailabilityLabel);
  const updateAvailabilityLabel = useAvailabilityLabelStore((s) => s.updateAvailabilityLabel);
  const deleteAvailabilityLabel = useAvailabilityLabelStore((s) => s.deleteAvailabilityLabel);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(label: AvailabilityLabel) {
    setEditingId(label.id);
    setForm({ text: label.text, color: label.color });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.text.trim()) return;
    if (editingId) {
      updateAvailabilityLabel(editingId, form);
    } else {
      addAvailabilityLabel(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Etichete de disponibilitate</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Etichete afișate pe produse pentru a indica starea stocului (ex. În stoc, Stoc
            limitat, Precomandă).
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă etichetă
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availabilityLabels.map((label) => (
          <div key={label.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: label.color }}
              >
                {label.text}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(label)}
                  aria-label="Editează"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => deleteAvailabilityLabel(label.id)}
                  aria-label="Șterge"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{label.color}</p>
          </div>
        ))}
        {availabilityLabels.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nu ai nicio etichetă de disponibilitate încă. Adaugă prima (ex. În stoc).
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează eticheta" : "Etichetă nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="avail-text" className="mb-1.5">
                Text etichetă
              </Label>
              <Input
                id="avail-text"
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                placeholder="ex. În stoc"
                required
              />
            </div>
            <div>
              <Label htmlFor="avail-color" className="mb-1.5">
                Culoare
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="avail-color"
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="size-10 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-1"
                />
                <Input
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  placeholder="#16a34a"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă eticheta"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
