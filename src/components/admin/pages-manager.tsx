"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useSiteStore, slugify } from "@/lib/store/site-store";
import type { CustomPage } from "@/types/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<CustomPage, "id" | "createdAt">;

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  showInHeader: false,
  showInFooter: false,
};

export function PagesManager() {
  const pages = useSiteStore((s) => s.pages);
  const addPage = useSiteStore((s) => s.addPage);
  const updatePage = useSiteStore((s) => s.updatePage);
  const deletePage = useSiteStore((s) => s.deletePage);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlugEdited(false);
    setOpen(true);
  }

  function openEdit(page: CustomPage) {
    setEditingId(page.id);
    setForm({
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      showInHeader: page.showInHeader,
      showInFooter: page.showInFooter,
    });
    setSlugEdited(true);
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    const payload: FormState = {
      ...form,
      slug: slugify(form.slug),
      metaTitle: form.metaTitle.trim() || form.title.trim(),
      metaDescription: form.metaDescription.trim(),
    };
    if (editingId) {
      updatePage(editingId, payload);
    } else {
      addPage(payload);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Pagini personalizate</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Creează pagini precum &ldquo;Despre noi&rdquo; sau &ldquo;Livrare&rdquo;, fiecare cu titlu și
            descriere SEO proprii.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă pagină
        </Button>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nu ai nicio pagină încă. Adaugă prima ta pagină și alege dacă apare în meniul principal
          sau doar ca link direct.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                <th className="p-4 font-medium">Pagină</th>
                <th className="p-4 font-medium">URL</th>
                <th className="p-4 font-medium">Apare în</th>
                <th className="p-4 text-right font-medium">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{page.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {page.metaTitle}
                    </p>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/pages/${page.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
                    >
                      /pages/{page.slug}
                      <ExternalLink className="size-3" />
                    </Link>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {page.showInHeader && (
                        <span className="rounded-full bg-brand-indigo-soft px-2 py-0.5 text-[11px] font-medium text-brand-indigo">
                          Meniu principal
                        </span>
                      )}
                      {!page.showInHeader && (
                        <span className="text-xs text-muted-foreground">Doar link direct</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(page)}
                        aria-label="Editează"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => deletePage(page.id)}
                        aria-label="Șterge"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează pagina" : "Pagină nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="page-title" className="mb-1.5">
                Titlu pagină
              </Label>
              <Input
                id="page-title"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({
                    ...f,
                    title,
                    slug: slugEdited ? f.slug : slugify(title),
                  }));
                }}
                placeholder="ex. Despre noi"
                required
              />
            </div>
            <div>
              <Label htmlFor="page-slug" className="mb-1.5">
                URL (slug)
              </Label>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">/pages/</span>
                <Input
                  id="page-slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  placeholder="despre-noi"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="page-content" className="mb-1.5">
                Conținut
              </Label>
              <Textarea
                id="page-content"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Textul paginii..."
                className="min-h-32"
              />
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase">
                SEO
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <Label htmlFor="page-meta-title" className="mb-1.5">
                    Titlu SEO (tab browser / Google)
                  </Label>
                  <Input
                    id="page-meta-title"
                    value={form.metaTitle}
                    onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
                    placeholder={form.title || "Titlu pagină"}
                  />
                </div>
                <div>
                  <Label htmlFor="page-meta-description" className="mb-1.5">
                    Descriere SEO
                  </Label>
                  <Textarea
                    id="page-meta-description"
                    value={form.metaDescription}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, metaDescription: e.target.value }))
                    }
                    placeholder="Descriere scurtă afișată în rezultatele Google (max ~160 caractere)"
                    className="min-h-16"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Unde apare pagina
              </p>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Meniu principal (header)</p>
                  <p className="text-xs text-muted-foreground">
                    Apare ca link în bara de navigare din partea de sus a site-ului
                  </p>
                </div>
                <Switch
                  checked={form.showInHeader}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, showInHeader: checked }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Dacă dezactivezi, pagina rămâne accesibilă doar la adresa ei directă.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Creează pagina"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
