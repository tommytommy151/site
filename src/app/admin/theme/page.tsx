"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Heart, RotateCcw, ShoppingBag } from "lucide-react";
import { useThemeStore } from "@/lib/store/theme-store";
import { THEME_PRESETS } from "@/lib/data/theme-presets";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RatingStars } from "@/components/ui/rating-stars";
import { ProductBadgePill } from "@/components/product/product-badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PagesManager } from "@/components/admin/pages-manager";
import { LogoSeoManager } from "@/components/admin/logo-seo-manager";
import { MenuManager } from "@/components/admin/menu-manager";
import { HeroBannerManager } from "@/components/admin/hero-banner-manager";
import { HomeSectionsManager } from "@/components/admin/home-sections-manager";
import { cn } from "@/lib/utils";

export default function AdminThemePage() {
  return (
    <Suspense fallback={null}>
      <AdminThemePageContent />
    </Suspense>
  );
}

function AdminThemePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") ?? "colors";

  function handleTabChange(tab: string) {
    router.replace(`/admin/theme?tab=${tab}`, { scroll: false });
  }

  const settings = useThemeStore((s) => s.settings);
  const setPrimaryColor = useThemeStore((s) => s.setPrimaryColor);
  const setAccentColor = useThemeStore((s) => s.setAccentColor);
  const setRadius = useThemeStore((s) => s.setRadius);
  const applyPreset = useThemeStore((s) => s.applyPreset);
  const reset = useThemeStore((s) => s.reset);

  const [justReset, setJustReset] = useState(false);

  const activePresetId = THEME_PRESETS.find(
    (p) => p.primaryColor === settings.primaryColor && p.accentColor === settings.accentColor,
  )?.id;

  function handleReset() {
    reset();
    setJustReset(true);
    setTimeout(() => setJustReset(false), 1600);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Design</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Culori, meniu, banner principal, structura paginii, pagini și SEO — totul într-un singur
          loc.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>

        <TabsContent value="colors" className="mt-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleReset}>
                {justReset ? (
                  <>
                    <Check className="size-4" /> Resetat
                  </>
                ) : (
                  <>
                    <RotateCcw className="size-4" /> Resetează la implicit
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Presetări de culoare</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.primaryColor, preset.accentColor)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors",
                    activePresetId === preset.id
                      ? "border-brand-emerald bg-brand-emerald-soft"
                      : "border-border hover:border-foreground/30",
                  )}
                >
                  <span
                    className="size-9 rounded-full shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${preset.primaryColor} 50%, ${preset.accentColor} 50%)`,
                    }}
                  />
                  <span className="text-xs font-medium text-foreground">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold">Culori personalizate</h2>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Culoare principală</p>
                  <p className="text-xs text-muted-foreground">Butoane, linkuri, evaluări</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground uppercase">
                    {settings.primaryColor}
                  </span>
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="size-9 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Culoare accent</p>
                  <p className="text-xs text-muted-foreground">Badge-uri secundare, detalii</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground uppercase">
                    {settings.accentColor}
                  </span>
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="size-9 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Colțuri rotunjite</h2>
              <span className="font-mono text-xs text-muted-foreground">
                {settings.radius.toFixed(2)}rem
              </span>
            </div>
            <Slider
              className="mt-5"
              value={[settings.radius]}
              min={0}
              max={1.5}
              step={0.125}
              onValueChange={([v]) => setRadius(v)}
            />
            <div className="mt-4 flex items-center gap-3">
              {[0, 0.5, 1, 1.5].map((r) => (
                <div
                  key={r}
                  className="flex size-12 items-center justify-center border border-border bg-muted text-[10px] text-muted-foreground"
                  style={{ borderRadius: `${r}rem` }}
                >
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Previzualizare live</h2>
          <div className="mt-5 flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <ProductBadgePill badge="new" />
              <ProductBadgePill badge="bestseller" />
              <ProductBadgePill badge="flash-deal" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button>
                <ShoppingBag className="size-4" /> Adaugă în coș
              </Button>
              <Button variant="outline">Detalii produs</Button>
              <button
                aria-label="Favorite"
                className="flex size-9 items-center justify-center rounded-xl border border-border text-brand-emerald"
              >
                <Heart className="size-4" fill="currentColor" />
              </button>
            </div>

            <RatingStars rating={4.6} showValue />

            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="text-sm font-medium text-foreground">Card exemplu</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Colțuri și accente aplicate live, pe măsură ce ajustezi setările din stânga.
              </p>
            </div>

            <div className="gradient-mesh rounded-2xl border border-border p-5">
              <span className="gradient-text text-lg font-semibold">EstelaOferta</span>
              <p className="mt-1 text-xs text-muted-foreground">Fundal cu gradient de brand</p>
            </div>
          </div>
        </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="mt-6">
          <MenuManager />
        </TabsContent>

        <TabsContent value="banner" className="mt-6">
          <HeroBannerManager />
        </TabsContent>

        <TabsContent value="layout" className="mt-6">
          <HomeSectionsManager />
        </TabsContent>

        <TabsContent value="pages" className="mt-6">
          <PagesManager />
        </TabsContent>

        <TabsContent value="logo-seo" className="mt-6">
          <LogoSeoManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
