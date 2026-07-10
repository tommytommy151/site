"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { useReturnsStore, RETURN_REASONS, type ReturnReason } from "@/lib/store/returns-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMPTY_FORM = {
  orderNumber: "",
  customerName: "",
  email: "",
  productName: "",
  reason: "" as ReturnReason | "",
  comments: "",
};

export function ReturnRequestForm() {
  const addRequest = useReturnsStore((s) => s.addRequest);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.reason) return;
    addRequest({
      orderNumber: form.orderNumber,
      customerName: form.customerName,
      email: form.email,
      productName: form.productName,
      reason: form.reason,
      comments: form.comments,
    });
    setSubmitted(true);
    setForm(EMPTY_FORM);
  }

  return (
    <Container className="max-w-3xl pb-16">
      <SectionHeading
        title="Solicită un retur"
        description="Completează formularul și te contactăm cu pașii următori."
      />

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 className="size-8 text-brand-emerald" />
            <p className="font-medium text-foreground">Cererea de retur a fost trimisă</p>
            <p className="text-sm text-muted-foreground">
              Îți răspundem în cel mai scurt timp posibil, de obicei în aceeași zi lucrătoare.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
              Trimite o altă cerere
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="return-order" className="mb-1.5">
                  Număr comandă
                </Label>
                <Input
                  id="return-order"
                  required
                  placeholder="ex. LC-10234"
                  value={form.orderNumber}
                  onChange={(e) => setForm((f) => ({ ...f, orderNumber: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="return-product" className="mb-1.5">
                  Produs
                </Label>
                <Input
                  id="return-product"
                  required
                  placeholder="Numele produsului"
                  value={form.productName}
                  onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="return-name" className="mb-1.5">
                  Nume
                </Label>
                <Input
                  id="return-name"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="return-email" className="mb-1.5">
                  Email
                </Label>
                <Input
                  id="return-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label className="mb-1.5">Motivul returului</Label>
              <Select
                required
                value={form.reason}
                onValueChange={(value) => setForm((f) => ({ ...f, reason: value as ReturnReason }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Alege un motiv" />
                </SelectTrigger>
                <SelectContent>
                  {RETURN_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="return-comments" className="mb-1.5">
                Detalii suplimentare (opțional)
              </Label>
              <Textarea
                id="return-comments"
                rows={4}
                value={form.comments}
                onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
              />
            </div>
            <Button type="submit" className="mt-2">
              Trimite cererea de retur
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
}
