"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useLoyaltyPointsStore } from "@/lib/store/loyalty-points-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoyaltyPointsPage() {
  const settings = useLoyaltyPointsStore((s) => s.settings);
  const updateSettings = useLoyaltyPointsStore((s) => s.updateSettings);
  const resetSettings = useLoyaltyPointsStore((s) => s.resetSettings);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    updateSettings({ ...settings, [key]: value });
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Puncte bonus</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configurează programul de fidelitate — câte puncte primesc clienții și cât valorează
            la răscumpărare.
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
            <Label htmlFor="points-per-leu" className="mb-1.5">
              Puncte per leu cheltuit
            </Label>
            <Input
              id="points-per-leu"
              type="number"
              min={0}
              step={0.1}
              value={settings.pointsPerLeu}
              onChange={(e) => set("pointsPerLeu", Number(e.target.value) || 0)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Câte puncte de fidelitate primește clientul pentru fiecare leu cheltuit.
            </p>
          </div>
          <div>
            <Label htmlFor="redeem-rate" className="mb-1.5">
              Valoare răscumpărare (lei / punct)
            </Label>
            <Input
              id="redeem-rate"
              type="number"
              min={0}
              step={0.01}
              value={settings.redeemRateLei}
              onChange={(e) => set("redeemRateLei", Number(e.target.value) || 0)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Câți lei valorează un punct atunci când clientul îl folosește la checkout.
            </p>
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
