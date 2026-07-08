"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useSiteStore } from "@/lib/store/site-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function HeroBannerManager() {
  const hero = useSiteStore((s) => s.hero);
  const updateHero = useSiteStore((s) => s.updateHero);
  const resetHero = useSiteStore((s) => s.resetHero);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof typeof hero>(key: K, value: (typeof hero)[K]) {
    updateHero({ ...hero, [key]: value });
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Banner principal (hero)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Prima secțiune văzută pe pagina principală — textul, butoanele și imaginea.
          </p>
        </div>
        <Button variant="outline" onClick={resetHero}>
          <RotateCcw className="size-4" />
          Resetează
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="hero-eyebrow" className="mb-1.5">
              Etichetă (deasupra titlului)
            </Label>
            <Input
              id="hero-eyebrow"
              value={hero.eyebrow}
              onChange={(e) => set("eyebrow", e.target.value)}
              onBlur={flashSaved}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="hero-title-1" className="mb-1.5">
                Titlu (linia 1)
              </Label>
              <Input
                id="hero-title-1"
                value={hero.titleLine1}
                onChange={(e) => set("titleLine1", e.target.value)}
                onBlur={flashSaved}
              />
            </div>
            <div>
              <Label htmlFor="hero-title-2" className="mb-1.5">
                Titlu (linia 2, accent)
              </Label>
              <Input
                id="hero-title-2"
                value={hero.titleLine2}
                onChange={(e) => set("titleLine2", e.target.value)}
                onBlur={flashSaved}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="hero-description" className="mb-1.5">
              Descriere
            </Label>
            <Textarea
              id="hero-description"
              value={hero.description}
              onChange={(e) => set("description", e.target.value)}
              onBlur={flashSaved}
              className="min-h-24"
            />
          </div>
          <div>
            <Label htmlFor="hero-image" className="mb-1.5">
              URL imagine principală
            </Label>
            <Input
              id="hero-image"
              value={hero.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              onBlur={flashSaved}
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="hero-cta1-label" className="mb-1.5">
                Buton principal — text
              </Label>
              <Input
                id="hero-cta1-label"
                value={hero.ctaPrimaryLabel}
                onChange={(e) => set("ctaPrimaryLabel", e.target.value)}
                onBlur={flashSaved}
              />
            </div>
            <div>
              <Label htmlFor="hero-cta1-href" className="mb-1.5">
                Buton principal — link
              </Label>
              <Input
                id="hero-cta1-href"
                value={hero.ctaPrimaryHref}
                onChange={(e) => set("ctaPrimaryHref", e.target.value)}
                onBlur={flashSaved}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="hero-cta2-label" className="mb-1.5">
                Buton secundar — text
              </Label>
              <Input
                id="hero-cta2-label"
                value={hero.ctaSecondaryLabel}
                onChange={(e) => set("ctaSecondaryLabel", e.target.value)}
                onBlur={flashSaved}
              />
            </div>
            <div>
              <Label htmlFor="hero-cta2-href" className="mb-1.5">
                Buton secundar — link
              </Label>
              <Input
                id="hero-cta2-href"
                value={hero.ctaSecondaryHref}
                onChange={(e) => set("ctaSecondaryHref", e.target.value)}
                onBlur={flashSaved}
              />
            </div>
          </div>
          {saved && (
            <p className="flex items-center gap-1.5 text-xs text-brand-emerald">
              <Check className="size-3.5" /> Salvat
            </p>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-border bg-secondary p-6">
          <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase">
            Previzualizare
          </p>
          <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-foreground">
            {hero.eyebrow}
          </span>
          <h3 className="text-2xl leading-tight font-semibold tracking-tight text-balance">
            {hero.titleLine1}
            <br />
            <span className="gradient-text">{hero.titleLine2}</span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {hero.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background">
              {hero.ctaPrimaryLabel}
            </span>
            <span className="rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground">
              {hero.ctaSecondaryLabel}
            </span>
          </div>
          {hero.imageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={hero.imageUrl}
              alt="Previzualizare banner"
              className="mt-5 aspect-video w-full rounded-xl object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
