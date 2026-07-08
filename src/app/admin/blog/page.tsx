"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useBlogStore, slugify } from "@/lib/store/blog-store";
import type { BlogPost } from "@/types/product";
import { formatDate } from "@/lib/format";
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

type FormState = Omit<BlogPost, "id">;

const EMPTY_FORM: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  image: "",
  author: "Echipa EstelaOferta",
  date: new Date().toISOString().slice(0, 10),
  readMinutes: 4,
  category: "",
};

export default function AdminBlogPage() {
  const posts = useBlogStore((s) => s.posts);
  const addPost = useBlogStore((s) => s.addPost);
  const updatePost = useBlogStore((s) => s.updatePost);
  const deletePost = useBlogStore((s) => s.deletePost);

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

  function openEdit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      date: post.date,
      readMinutes: post.readMinutes,
      category: post.category,
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
      image: form.image.trim() || "https://picsum.photos/seed/new-blog-post/900/600",
    };
    if (editingId) {
      updatePost(editingId, payload);
    } else {
      addPost(payload);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {posts.length} articole — apar în &ldquo;Jurnal&rdquo; pe homepage și la /blog.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă articol
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Articol</th>
              <th className="p-4 font-medium">Categorie</th>
              <th className="p-4 font-medium">Dată</th>
              <th className="p-4 font-medium">URL</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="flex items-center gap-3 p-4">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="min-w-0 truncate font-medium text-foreground">{post.title}</p>
                </td>
                <td className="p-4 text-muted-foreground">{post.category}</td>
                <td className="p-4 text-muted-foreground">{formatDate(post.date)}</td>
                <td className="p-4">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
                  >
                    /blog/{post.slug}
                    <ExternalLink className="size-3" />
                  </Link>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(post)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează articolul" : "Articol nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="post-title" className="mb-1.5">
                Titlu
              </Label>
              <Input
                id="post-title"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: slugEdited ? f.slug : slugify(title) }));
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="post-slug" className="mb-1.5">
                URL (slug)
              </Label>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">/blog/</span>
                <Input
                  id="post-slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="post-category" className="mb-1.5">
                  Categorie
                </Label>
                <Input
                  id="post-category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="ex. Ghiduri"
                />
              </div>
              <div>
                <Label htmlFor="post-read" className="mb-1.5">
                  Minute citire
                </Label>
                <Input
                  id="post-read"
                  type="number"
                  min={1}
                  value={form.readMinutes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, readMinutes: Number(e.target.value) || 1 }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="post-author" className="mb-1.5">
                  Autor
                </Label>
                <Input
                  id="post-author"
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="post-date" className="mb-1.5">
                  Dată
                </Label>
                <Input
                  id="post-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="post-image" className="mb-1.5">
                URL imagine
              </Label>
              <Input
                id="post-image"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="post-excerpt" className="mb-1.5">
                Rezumat scurt
              </Label>
              <Textarea
                id="post-excerpt"
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                className="min-h-16"
              />
            </div>
            <div>
              <Label htmlFor="post-content" className="mb-1.5">
                Conținut complet
              </Label>
              <Textarea
                id="post-content"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="min-h-32"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Publică articolul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
