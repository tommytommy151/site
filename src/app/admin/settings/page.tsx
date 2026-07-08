"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useStoreSettingsStore } from "@/lib/store/store-settings-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  const settings = useStoreSettingsStore((s) => s.settings);
  const updateSettings = useStoreSettingsStore((s) => s.updateSettings);
  const resetSettings = useStoreSettingsStore((s) => s.resetSettings);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    updateSettings({ ...settings, [key]: value });
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Setări generale</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Numele magazinului și datele de contact — folosite în footer și pagina de contact.
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
            <Label htmlFor="store-name" className="mb-1.5">
              Nume companie
            </Label>
            <Input
              id="store-name"
              value={settings.storeName}
              onChange={(e) => set("storeName", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="store-email" className="mb-1.5">
              Email de contact
            </Label>
            <Input
              id="store-email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="store-phone" className="mb-1.5">
              Telefon de contact
            </Label>
            <Input
              id="store-phone"
              value={settings.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="store-address" className="mb-1.5">
              Adresă
            </Label>
            <Textarea
              id="store-address"
              value={settings.address}
              onChange={(e) => set("address", e.target.value)}
              className="min-h-20"
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
