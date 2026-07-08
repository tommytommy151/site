"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useBasicSeoStore } from "@/lib/store/basic-seo-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminBasicSeoPage() {
  const settings = useBasicSeoStore((s) => s.settings);
  const updateSettings = useBasicSeoStore((s) => s.updateSettings);
  const resetSettings = useBasicSeoStore((s) => s.resetSettings);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    updateSettings({ ...settings, [key]: value });
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">SEO de bază</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Meta titlu, descriere și imagine de partajare — folosite pentru motoarele de căutare
            și rețelele sociale.
          </p>
        </div>
        <Button variant="outline" onClick={resetSettings}>
          <RotateCcw className="size-4" />
          Resetează
        </Button>
      </div>

      <div className="max-w-xl rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="seo-title" className="mb-1.5">
              Meta titlu
            </Label>
            <Input
              id="seo-title"
              value={settings.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="seo-description" className="mb-1.5">
              Meta descriere
            </Label>
            <Textarea
              id="seo-description"
              value={settings.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
              className="min-h-20"
            />
          </div>
          <div>
            <Label htmlFor="seo-keywords" className="mb-1.5">
              Cuvinte cheie
            </Label>
            <Input
              id="seo-keywords"
              value={settings.keywords}
              onChange={(e) => set("keywords", e.target.value)}
              placeholder="separate prin virgulă"
            />
          </div>
          <div>
            <Label htmlFor="seo-og-image" className="mb-1.5">
              Imagine partajare (OG image)
            </Label>
            <Input
              id="seo-og-image"
              value={settings.ogImage}
              onChange={(e) => set("ogImage", e.target.value)}
              placeholder="/og-image.jpg"
            />
          </div>
        </div>
        {saved && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-emerald">
            <Check className="size-3.5" /> Salvat automat
          </p>
        )}
      </div>
    </div>
  );
}
