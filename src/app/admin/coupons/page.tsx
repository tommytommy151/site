"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCouponStore, type Coupon } from "@/lib/store/coupon-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type FormState = Omit<Coupon, "id">;

const EMPTY_FORM: FormState = { code: "", discountPct: 10, active: true };

export default function AdminCouponsPage() {
  const coupons = useCouponStore((s) => s.coupons);
  const addCoupon = useCouponStore((s) => s.addCoupon);
  const updateCoupon = useCouponStore((s) => s.updateCoupon);
  const deleteCoupon = useCouponStore((s) => s.deleteCoupon);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditingId(coupon.id);
    setForm({ code: coupon.code, discountPct: coupon.discountPct, active: coupon.active });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim()) return;
    const payload: FormState = { ...form, code: form.code.trim().toUpperCase() };
    if (editingId) {
      updateCoupon(editingId, payload);
    } else {
      addCoupon(payload);
    }
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cupoane de reducere</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {coupons.length} cupoane — clienții le pot folosi în coșul de cumpărături.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Adaugă cupon
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <th className="p-4 font-medium">Cod</th>
              <th className="p-4 font-medium">Reducere</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 text-right font-medium">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="p-4 font-mono font-medium text-foreground">{coupon.code}</td>
                <td className="p-4 text-muted-foreground">{coupon.discountPct}%</td>
                <td className="p-4">
                  <span
                    className={
                      coupon.active
                        ? "rounded-full bg-brand-emerald-soft px-2.5 py-1 text-xs font-medium text-brand-emerald"
                        : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {coupon.active ? "Activ" : "Inactiv"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(coupon)}
                      aria-label="Editează"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      aria-label="Șterge"
                      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editează cuponul" : "Cupon nou"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="coupon-code" className="mb-1.5">
                Cod cupon
              </Label>
              <Input
                id="coupon-code"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="ex. VARA20"
                required
              />
            </div>
            <div>
              <Label htmlFor="coupon-pct" className="mb-1.5">
                Reducere (%)
              </Label>
              <Input
                id="coupon-pct"
                type="number"
                min={1}
                max={100}
                value={form.discountPct}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountPct: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Activ</p>
                <p className="text-xs text-muted-foreground">
                  Doar cupoanele active pot fi folosite la checkout
                </p>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {editingId ? "Salvează modificările" : "Adaugă cuponul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
