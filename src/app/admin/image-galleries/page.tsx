"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useImageGalleriesStore, type ImageGallery } from "@/lib/store/image-galleries-store";
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

type FormState = Omit<ImageGallery, "id">;

const EMPTY_FORM: FormState = { name: "", images: [] };

export default function AdminImageGalleriesPage() {
  const galleries = useImageGalleriesStore((s) => s.galleries);
  const addGallery = useImageGalleriesStore((s) => s.addGallery);
  const updateGallery = useImageGalleriesStore((s) => s.updateGallery);
  const deleteGallery = useImageGalleriesStore((s) => s.deleteGallery);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageDraft, setImageDraft] = useState("");

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageDraft("");
    setOpen(true);
  }

  function openEdit(gallery: ImageGallery) {
    setEditingId(gallery.id);
    setForm({ name: gallery.name, images: gallery.images });
    setImageDraft("");
    setOpen(true);
  }

  function addImage() {
    const v = imageDraft.trim();
    if (!v || form.images.includes(v)) return;
    setForm((f) => ({ ...f, images: [...f.images, v] }));
    setImageDraft("");
  }

  function removeImage(image: string) {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== image) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || form.images.length === 0) return;
    if (editingId) {
      updateGallery(editingId, form);
    } else {
      addGallery(form);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Galerii de imagini</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Colecții de imagini reutilizabile în pagini și secțiuni promoționale ale magazinului.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă galerie
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleries.map((gallery) => (
          <div key={gallery.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-foreground">{gallery.name}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(gallery)}
                  aria-label="Editează"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => deleteGallery(gallery.id)}
                  aria-label="Șterge"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {gallery.images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{gallery.images.length} imagini</p>
          </div>
        ))}
        {galleries.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nu ai nicio galerie încă. Adaugă prima (ex. Colecția de vară).
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează galeria" : "Galerie nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="gallery-name" className="mb-1.5">
                Nume galerie
              </Label>
              <Input
                id="gallery-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="ex. Colecția de vară"
                required
              />
            </div>
            <div>
              <Label className="mb-1.5">Imagini (URL)</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={imageDraft}
                  onChange={(e) => setImageDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                  placeholder="https://..."
                />
                <Button type="button" variant="outline" onClick={addImage}>
                  Adaugă
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.images.map((img) => (
                  <span
                    key={img}
                    className="inline-flex max-w-full items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    <span className="max-w-48 truncate">{img}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      aria-label={`Șterge ${img}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                {form.images.length === 0 && (
                  <p className="text-xs text-muted-foreground">Adaugă cel puțin o imagine.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă galeria"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
