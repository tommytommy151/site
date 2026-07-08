"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function AccountSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    backInStock: false,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Setări cont</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Actualizează informațiile personale și preferințele de notificare.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">Informații personale</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" className="mb-1.5">
              Nume complet
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email" className="mb-1.5">
              Email
            </Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <Button type="submit" className="mt-5">
          {saved ? (
            <>
              <Check className="size-4" /> Salvat
            </>
          ) : (
            "Salvează modificările"
          )}
        </Button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Bell className="size-4" /> Notificări
        </h2>
        <div className="mt-5 flex flex-col divide-y divide-border">
          {[
            {
              key: "orderUpdates" as const,
              label: "Actualizări comenzi",
              description: "Primești un email la fiecare schimbare de status a comenzii.",
            },
            {
              key: "promotions" as const,
              label: "Oferte și promoții",
              description: "Reduceri exclusive și acces timpuriu la lansări.",
            },
            {
              key: "backInStock" as const,
              label: "Produs revenit în stoc",
              description: "Te anunțăm când un produs epuizat devine disponibil.",
            },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(v) => setNotifications((n) => ({ ...n, [item.key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <h2 className="text-base font-semibold text-destructive">Zonă cu risc</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Ștergerea contului este permanentă și nu poate fi anulată.
        </p>
        <Button variant="destructive" className="mt-4">
          Șterge contul
        </Button>
      </div>
    </div>
  );
}
