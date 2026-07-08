"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useSiteStore } from "@/lib/store/site-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeSectionsManager() {
  const homeSections = useSiteStore((s) => s.homeSections);
  const toggleSectionVisible = useSiteStore((s) => s.toggleSectionVisible);
  const moveSection = useSiteStore((s) => s.moveSection);
  const resetHomeSections = useSiteStore((s) => s.resetHomeSections);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Structura paginii principale</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ascunde secțiunile de care nu ai nevoie și schimbă ordinea lor pe pagina principală.
            Bannerul principal (hero) e mereu primul.
          </p>
        </div>
        <Button variant="outline" onClick={resetHomeSections}>
          <RotateCcw className="size-4" />
          Resetează
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
          <span>Banner principal (hero)</span>
          <span className="text-xs">Fix, mereu vizibil</span>
        </div>
        {homeSections.map((section, index) => (
          <div
            key={section.id}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3",
              !section.visible && "opacity-50",
            )}
          >
            <p className="font-medium text-foreground">{section.label}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveSection(section.id, "up")}
                disabled={index === 0}
                aria-label="Mută în sus"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                onClick={() => moveSection(section.id, "down")}
                disabled={index === homeSections.length - 1}
                aria-label="Mută în jos"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowDown className="size-3.5" />
              </button>
              <button
                onClick={() => toggleSectionVisible(section.id)}
                aria-label={section.visible ? "Ascunde secțiunea" : "Afișează secțiunea"}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {section.visible ? (
                  <Eye className="size-3.5" />
                ) : (
                  <EyeOff className="size-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
