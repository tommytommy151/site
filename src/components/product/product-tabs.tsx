"use client";

import { useState } from "react";
import { MessageCircleQuestion, ThumbsUp, BadgeCheck } from "lucide-react";
import { RatingStars } from "@/components/ui/rating-stars";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { Product } from "@/types/product";

export function ProductTabs({ product }: { product: Product }) {
  const ratingBuckets = [5, 4, 3, 2, 1].map((star) => {
    const count = product.reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = product.reviews.length ? Math.round((count / product.reviews.length) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <div className="mt-16 flex flex-col divide-y divide-border">
      <section className="pb-12">
        <h2 className="mb-5 text-xl font-semibold tracking-tight">Descriere</h2>
        <div className="max-w-2xl text-[15px] leading-relaxed text-foreground/90">
          {product.description}
        </div>
      </section>

      <section className="py-12">
        <h2 className="mb-5 text-xl font-semibold tracking-tight">Caracteristici</h2>
        <ul className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/90">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-emerald" />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="py-12">
        <h2 className="mb-5 text-xl font-semibold tracking-tight">
          Recenzii ({product.reviews.length})
        </h2>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-semibold tracking-tight">{product.rating.toFixed(1)}</span>
              <div>
                <RatingStars rating={product.rating} size={16} />
                <p className="mt-1 text-sm text-muted-foreground">{product.reviewCount} recenzii</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              {ratingBuckets.map((b) => (
                <div key={b.star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-muted-foreground">{b.star}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand-emerald" style={{ width: `${b.pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{b.count}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-6 w-full">
              Scrie o recenzie
            </Button>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {product.reviews.map((review) => (
              <div key={review.id} className="py-5 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={review.rating} size={13} />
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs font-medium text-brand-emerald">
                        <BadgeCheck className="size-3.5" /> Achiziție verificată
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{review.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{review.author}</span>
                  <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <ThumbsUp className="size-3.5" /> Util ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-12">
        <h2 className="mb-5 text-xl font-semibold tracking-tight">Întrebări & Răspunsuri</h2>
        <QuestionsAndAnswers />
      </section>
    </div>
  );
}

function QuestionsAndAnswers() {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border p-6">
        <MessageCircleQuestion className="size-6 text-brand-emerald" />
        <p className="text-sm font-medium text-foreground">Nicio întrebare încă</p>
        <p className="text-sm text-muted-foreground">
          Fii primul care pune o întrebare despre acest produs.
        </p>
        {submitted ? (
          <p className="text-sm font-medium text-brand-emerald">
            Mulțumim — te vom anunța când primește un răspuns.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (question.trim()) setSubmitted(true);
            }}
            className="flex w-full flex-col gap-3 sm:flex-row"
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Pune o întrebare despre acest produs..."
              className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-emerald"
            />
            <Button type="submit" size="sm" className="h-10">
              Trimite
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
