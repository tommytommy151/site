"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useSiteStore } from "@/lib/store/site-store";
import type { MenuItem } from "@/types/site";
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

type FormState = Omit<MenuItem, "id">;

const EMPTY_FORM: FormState = { label: "", href: "" };

export function MenuManager() {
  const menu = useSiteStore((s) => s.menu);
  const addMenuItem = useSiteStore((s) => s.addMenuItem);
  const updateMenuItem = useSiteStore((s) => s.updateMenuItem);
  const deleteMenuItem = useSiteStore((s) => s.deleteMenuItem);
  const moveMenuItem = useSiteStore((s) => s.moveMenuItem);
  const resetMenu = useSiteStore((s) => s.resetMenu);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditingId(item.id);
    setForm({ label: item.label, href: item.href });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label.trim() || !form.href.trim()) return;
    if (editingId) {
      updateMenuItem(editingId, form);
    } else {
      addMenuItem(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Meniu principal</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Linkurile afișate în bara de navigare, lângă &ldquo;Categorii&rdquo; (fix). Ordinea de
            aici e ordinea din meniu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetMenu}>
            <RotateCcw className="size-4" />
            Resetează
          </Button>
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Adaugă link
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {menu.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{item.label}</p>
              <p className="truncate font-mono text-xs text-muted-foreground">{item.href}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => moveMenuItem(item.id, "up")}
                disabled={index === 0}
                aria-label="Mută în sus"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                onClick={() => moveMenuItem(item.id, "down")}
                disabled={index === menu.length - 1}
                aria-label="Mută în jos"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowDown className="size-3.5" />
              </button>
              <button
                onClick={() => openEdit(item)}
                aria-label="Editează"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                onClick={() => deleteMenuItem(item.id)}
                aria-label="Șterge"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
        {menu.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nu ai niciun link în meniu. Adaugă primul.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează linkul" : "Link nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="menu-label" className="mb-1.5">
                Text afișat
              </Label>
              <Input
                id="menu-label"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="ex. Noutăți"
                required
              />
            </div>
            <div>
              <Label htmlFor="menu-href" className="mb-1.5">
                Link (URL)
              </Label>
              <Input
                id="menu-href"
                value={form.href}
                onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                placeholder="/products sau https://..."
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă în meniu"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
