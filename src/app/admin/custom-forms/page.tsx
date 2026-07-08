"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCustomFormsStore, type CustomForm } from "@/lib/store/custom-forms-store";
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

type FormState = Omit<CustomForm, "id">;

const EMPTY_FORM: FormState = { name: "", fieldsCount: 0, submissionsCount: 0 };

export default function AdminCustomFormsPage() {
  const forms = useCustomFormsStore((s) => s.forms);
  const addForm = useCustomFormsStore((s) => s.addForm);
  const updateForm = useCustomFormsStore((s) => s.updateForm);
  const deleteForm = useCustomFormsStore((s) => s.deleteForm);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(f: CustomForm) {
    setEditingId(f.id);
    setForm({ name: f.name, fieldsCount: f.fieldsCount, submissionsCount: f.submissionsCount });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateForm(editingId, form);
    } else {
      addForm(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Formulare</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Formulare personalizate afișate în magazin (contact, retur, parteneriat) și
            statisticile lor de bază.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă formular
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {forms.map((f) => (
          <div key={f.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-foreground">{f.name}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(f)}
                  aria-label="Editează"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => deleteForm(f.id)}
                  aria-label="Șterge"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                {f.fieldsCount} câmpuri
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                {f.submissionsCount} trimiteri
              </span>
            </div>
          </div>
        ))}
        {forms.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nu ai niciun formular încă. Adaugă primul (ex. Formular de contact).
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează formularul" : "Formular nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="form-name" className="mb-1.5">
                Nume formular
              </Label>
              <Input
                id="form-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Formular de contact"
                required
              />
            </div>
            <div>
              <Label htmlFor="form-fields" className="mb-1.5">
                Număr câmpuri
              </Label>
              <Input
                id="form-fields"
                type="number"
                min={0}
                value={form.fieldsCount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fieldsCount: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="form-submissions" className="mb-1.5">
                Număr trimiteri
              </Label>
              <Input
                id="form-submissions"
                type="number"
                min={0}
                value={form.submissionsCount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, submissionsCount: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă formularul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
