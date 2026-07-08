"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useCatalogStore } from "@/lib/store/catalog-store";
import type { Attribute } from "@/types/product";
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

type FormState = Omit<Attribute, "id">;

const EMPTY_FORM: FormState = { name: "", values: [] };

export default function AdminAttributesPage() {
  const attributes = useCatalogStore((s) => s.attributes);
  const addAttribute = useCatalogStore((s) => s.addAttribute);
  const updateAttribute = useCatalogStore((s) => s.updateAttribute);
  const deleteAttribute = useCatalogStore((s) => s.deleteAttribute);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [valueDraft, setValueDraft] = useState("");

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setValueDraft("");
    setOpen(true);
  }

  function openEdit(attr: Attribute) {
    setEditingId(attr.id);
    setForm({ name: attr.name, values: attr.values });
    setValueDraft("");
    setOpen(true);
  }

  function addValue() {
    const v = valueDraft.trim();
    if (!v || form.values.includes(v)) return;
    setForm((f) => ({ ...f, values: [...f.values, v] }));
    setValueDraft("");
  }

  function removeValue(value: string) {
    setForm((f) => ({ ...f, values: f.values.filter((v) => v !== value) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || form.values.length === 0) return;
    if (editingId) {
      updateAttribute(editingId, form);
    } else {
      addAttribute(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Atribute</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Grupuri de atribute (ex. Culoare, Mărime) și valorile lor posibile — un catalog de
            referință pentru variantele de produs.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă atribut
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {attributes.map((attr) => (
          <div key={attr.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-foreground">{attr.name}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(attr)}
                  aria-label="Editează"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => deleteAttribute(attr.id)}
                  aria-label="Șterge"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {attr.values.map((v) => (
                <span
                  key={v}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        ))}
        {attributes.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nu ai niciun atribut încă. Adaugă primul (ex. Culoare).
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează atributul" : "Atribut nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="attr-name" className="mb-1.5">
                Nume atribut
              </Label>
              <Input
                id="attr-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Culoare"
                required
              />
            </div>
            <div>
              <Label className="mb-1.5">Valori posibile</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={valueDraft}
                  onChange={(e) => setValueDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addValue();
                    }
                  }}
                  placeholder="ex. Negru"
                />
                <Button type="button" variant="outline" onClick={addValue}>
                  Adaugă
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.values.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {v}
                    <button type="button" onClick={() => removeValue(v)} aria-label={`Șterge ${v}`}>
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                {form.values.length === 0 && (
                  <p className="text-xs text-muted-foreground">Adaugă cel puțin o valoare.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă atributul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
