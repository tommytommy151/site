"use client";

import { useState } from "react";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";
import { useAccountStore } from "@/lib/store/account-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const EMPTY_FORM = {
  label: "",
  fullName: "",
  phone: "",
  line1: "",
  city: "",
  county: "",
  postalCode: "",
};

export default function AccountAddressesPage() {
  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const removeAddress = useAccountStore((s) => s.removeAddress);
  const setDefaultAddress = useAccountStore((s) => s.setDefaultAddress);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.line1 || !form.city) return;
    addAddress({ ...form, isDefault: addresses.length === 0 });
    setForm(EMPTY_FORM);
    setOpen(false);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Adresele mele</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestionează adresele de livrare pentru comenzile tale.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Adaugă adresă
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adresă nouă</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="label" className="mb-1.5">
                  Etichetă
                </Label>
                <Input
                  id="label"
                  placeholder="ex. Acasă, Birou"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="fullName" className="mb-1.5">
                  Nume complet
                </Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1.5">
                  Telefon
                </Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="line1" className="mb-1.5">
                  Adresă
                </Label>
                <Input
                  id="line1"
                  value={form.line1}
                  onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city" className="mb-1.5">
                    Oraș
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="county" className="mb-1.5">
                    Județ
                  </Label>
                  <Input
                    id="county"
                    value={form.county}
                    onChange={(e) => setForm((f) => ({ ...f, county: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="postalCode" className="mb-1.5">
                  Cod poștal
                </Label>
                <Input
                  id="postalCode"
                  value={form.postalCode}
                  onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">
                  Salvează adresa
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <MapPin className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Nu ai nicio adresă salvată</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {address.label || "Adresă"}
                  </span>
                  {address.isDefault && (
                    <span className="rounded-full bg-brand-emerald-soft px-2 py-0.5 text-[11px] font-medium text-brand-emerald">
                      Implicită
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeAddress(address.id)}
                  aria-label="Șterge adresa"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-foreground">{address.fullName}</p>
              <p className="text-sm text-muted-foreground">{address.phone}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {address.line1}, {address.city}, {address.county} {address.postalCode}
              </p>
              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-emerald hover:underline"
                >
                  <Star className="size-3.5" />
                  Setează ca implicită
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
