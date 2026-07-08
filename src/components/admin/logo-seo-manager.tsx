"use client";

import { useRef, useState } from "react";
import { Check, RotateCcw, Upload, X } from "lucide-react";
import { useSiteStore } from "@/lib/store/site-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteLogo } from "@/components/site-logo";

const MAX_LOGO_BYTES = 500 * 1024;

export function LogoSeoManager() {
  const settings = useSiteStore((s) => s.settings);
  const setLogoText = useSiteStore((s) => s.setLogoText);
  const setLogoImageUrl = useSiteStore((s) => s.setLogoImageUrl);
  const setSiteTitle = useSiteStore((s) => s.setSiteTitle);
  const setSiteDescription = useSiteStore((s) => s.setSiteDescription);
  const resetSettings = useSiteStore((s) => s.resetSettings);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Alege un fișier imagine (PNG, JPG sau SVG).");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setError("Imaginea e prea mare — alege un fișier sub 500 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Logo</h2>
          <Button variant="outline" size="sm" onClick={resetSettings}>
            <RotateCcw className="size-3.5" />
            Resetează
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
            <SiteLogo />
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" />
              Încarcă imagine
            </Button>
            {settings.logoImageUrl && (
              <Button variant="ghost" onClick={() => setLogoImageUrl(null)}>
                <X className="size-4" />
                Elimină imaginea
              </Button>
            )}
          </div>
        </div>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

        <div className="mt-5">
          <Label htmlFor="logo-text" className="mb-1.5">
            Text logo (afișat dacă nu ai imagine, sau lângă ea)
          </Label>
          <Input
            id="logo-text"
            value={settings.logoText}
            onChange={(e) => setLogoText(e.target.value)}
            placeholder="Numele magazinului"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">SEO site</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Titlul și descrierea afișate în tab-ul browserului și în rezultatele motoarelor de
          căutare.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <Label htmlFor="site-title" className="mb-1.5">
              Titlu site
            </Label>
            <Input
              id="site-title"
              value={settings.siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              onBlur={flashSaved}
              placeholder="Numele magazinului tău"
            />
          </div>
          <div>
            <Label htmlFor="site-description" className="mb-1.5">
              Descriere site
            </Label>
            <Textarea
              id="site-description"
              value={settings.siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              onBlur={flashSaved}
              placeholder="O propoziție scurtă despre magazinul tău (ideal sub 160 caractere)"
              className="min-h-24"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {settings.siteDescription.length} caractere
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-secondary p-4">
          <p className="text-xs text-muted-foreground">Previzualizare rezultat Google</p>
          <p className="mt-2 truncate text-[15px] text-blue-500 dark:text-blue-400">
            {settings.siteTitle}
          </p>
          <p className="text-xs text-muted-foreground">estelaoferta.example</p>
          <p className="mt-1 line-clamp-2 text-sm text-foreground/80">
            {settings.siteDescription}
          </p>
        </div>

        {saved && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-emerald">
            <Check className="size-3.5" /> Salvat
          </p>
        )}
      </div>
    </div>
  );
}
