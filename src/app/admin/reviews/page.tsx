"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useReviewStore, type Review, type ReviewStatus } from "@/lib/store/reviews-store";
import { RatingStars } from "@/components/ui/rating-stars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type FormState = Omit<Review, "id">;

const EMPTY_FORM: FormState = {
  productName: "",
  customerName: "",
  rating: 5,
  comment: "",
  status: "pending",
};

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "În așteptare",
  approved: "Aprobată",
  rejected: "Respinsă",
};

const STATUS_CLASSES: Record<ReviewStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  approved: "bg-brand-emerald-soft text-brand-emerald",
  rejected: "bg-destructive/10 text-destructive",
};

export default function AdminReviewsPage() {
  const reviews = useReviewStore((s) => s.reviews);
  const addReview = useReviewStore((s) => s.addReview);
  const updateReview = useReviewStore((s) => s.updateReview);
  const deleteReview = useReviewStore((s) => s.deleteReview);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(review: Review) {
    setEditingId(review.id);
    setForm({
      productName: review.productName,
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.productName.trim() || !form.customerName.trim()) return;
    if (editingId) {
      updateReview(editingId, form);
    } else {
      addReview(form);
    }
    setOpen(false);
  }

  function setStatus(review: Review, status: ReviewStatus) {
    updateReview(review.id, { ...review, status });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evaluări și recenzii</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {reviews.length} recenzii — moderează comentariile lăsate de clienți.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă recenzie
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Produs</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Rating</th>
              <th className="p-4 font-medium">Comentariu</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="p-4 font-medium text-foreground">{review.productName}</td>
                <td className="p-4 text-muted-foreground">{review.customerName}</td>
                <td className="p-4">
                  <RatingStars rating={review.rating} />
                </td>
                <td className="p-4 max-w-xs text-muted-foreground">
                  <p className="line-clamp-2">{review.comment}</p>
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[review.status]}`}
                  >
                    {STATUS_LABELS[review.status]}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    {review.status !== "approved" && (
                      <button
                        onClick={() => setStatus(review, "approved")}
                        aria-label="Aprobă"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-brand-emerald-soft hover:text-brand-emerald"
                      >
                        <Check className="size-3.5" />
                      </button>
                    )}
                    {review.status !== "rejected" && (
                      <button
                        onClick={() => setStatus(review, "rejected")}
                        aria-label="Respinge"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(review)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted-foreground">
                  Nicio recenzie încă.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează recenzia" : "Recenzie nouă"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="review-product" className="mb-1.5">
                Produs
              </Label>
              <Input
                id="review-product"
                value={form.productName}
                onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value }))}
                placeholder="ex. Cremă hidratantă"
                required
              />
            </div>
            <div>
              <Label htmlFor="review-customer" className="mb-1.5">
                Client
              </Label>
              <Input
                id="review-customer"
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                placeholder="ex. Ioana Marinescu"
                required
              />
            </div>
            <div>
              <Label htmlFor="review-rating" className="mb-1.5">
                Rating (1-5)
              </Label>
              <Input
                id="review-rating"
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    rating: Math.min(5, Math.max(1, Number(e.target.value) || 1)),
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="review-comment" className="mb-1.5">
                Comentariu
              </Label>
              <Textarea
                id="review-comment"
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                placeholder="Comentariul clientului"
              />
            </div>
            <div>
              <Label className="mb-1.5">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, status: value as ReviewStatus }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">În așteptare</SelectItem>
                  <SelectItem value="approved">Aprobată</SelectItem>
                  <SelectItem value="rejected">Respinsă</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă recenzia"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
