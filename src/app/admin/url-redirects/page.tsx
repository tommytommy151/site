"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useUrlRedirectStore, type UrlRedirect, type RedirectType } from "@/lib/store/url-redirects-store";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormState = Omit<UrlRedirect, "id">;

const EMPTY_FORM: FormState = { fromPath: "", toPath: "", type: "301" };

export default function AdminUrlRedirectsPage() {
  const urlRedirects = useUrlRedirectStore((s) => s.urlRedirects);
  const addUrlRedirect = useUrlRedirectStore((s) => s.addUrlRedirect);
  const updateUrlRedirect = useUrlRedirectStore((s) => s.updateUrlRedirect);
  const deleteUrlRedirect = useUrlRedirectStore((s) => s.deleteUrlRedirect);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(redirect: UrlRedirect) {
    setEditingId(redirect.id);
    setForm({ fromPath: redirect.fromPath, toPath: redirect.toPath, type: redirect.type });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fromPath.trim() || !form.toPath.trim()) return;
    if (editingId) {
      updateUrlRedirect(editingId, form);
    } else {
      addUrlRedirect(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Redirecționare URL-uri</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {urlRedirects.length} reguli de redirecționare active pentru linkuri vechi sau mutate.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă redirecționare
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">De la</th>
              <th className="p-4 font-medium">Către</th>
              <th className="p-4 font-medium">Tip</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {urlRedirects.map((redirect) => (
              <tr key={redirect.id}>
                <td className="p-4 font-mono text-foreground">{redirect.fromPath}</td>
                <td className="p-4 font-mono text-muted-foreground">{redirect.toPath}</td>
                <td className="p-4">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                    {redirect.type}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(redirect)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteUrlRedirect(redirect.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {urlRedirects.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                  Nu ai nicio regulă de redirecționare încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează redirecționarea" : "Redirecționare nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="redir-from" className="mb-1.5">
                De la (cale veche)
              </Label>
              <Input
                id="redir-from"
                value={form.fromPath}
                onChange={(e) => setForm((f) => ({ ...f, fromPath: e.target.value }))}
                placeholder="ex. /produse-vechi"
                required
              />
            </div>
            <div>
              <Label htmlFor="redir-to" className="mb-1.5">
                Către (cale nouă)
              </Label>
              <Input
                id="redir-to"
                value={form.toPath}
                onChange={(e) => setForm((f) => ({ ...f, toPath: e.target.value }))}
                placeholder="ex. /produse"
                required
              />
            </div>
            <div>
              <Label className="mb-1.5">Tip redirecționare</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm((f) => ({ ...f, type: value as RedirectType }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="301">301 — Permanentă</SelectItem>
                  <SelectItem value="302">302 — Temporară</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă redirecționarea"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
