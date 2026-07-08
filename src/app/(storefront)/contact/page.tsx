"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { useStoreSettingsStore } from "@/lib/store/store-settings-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const settings = useStoreSettingsStore((s) => s.settings);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Container className="py-14 sm:py-16">
      <SectionHeading
        eyebrow="Suntem aici"
        title="Contactează-ne"
        description="Răspundem de obicei în aceeași zi lucrătoare."
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <Mail className="mt-0.5 size-5 shrink-0 text-brand-emerald" />
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {settings.contactEmail}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <Phone className="mt-0.5 size-5 shrink-0 text-brand-emerald" />
            <div>
              <p className="text-sm font-medium text-foreground">Telefon</p>
              <a
                href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {settings.contactPhone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-brand-emerald" />
            <div>
              <p className="text-sm font-medium text-foreground">Adresă</p>
              <p className="text-sm text-muted-foreground">{settings.address}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <CheckCircle2 className="size-8 text-brand-emerald" />
              <p className="font-medium text-foreground">Mesaj trimis</p>
              <p className="text-sm text-muted-foreground">
                Îți răspundem în cel mai scurt timp posibil.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="contact-name" className="mb-1.5">
                    Nume
                  </Label>
                  <Input id="contact-name" required />
                </div>
                <div>
                  <Label htmlFor="contact-email" className="mb-1.5">
                    Email
                  </Label>
                  <Input id="contact-email" type="email" required />
                </div>
              </div>
              <div>
                <Label htmlFor="contact-subject" className="mb-1.5">
                  Subiect
                </Label>
                <Input id="contact-subject" required />
              </div>
              <div>
                <Label htmlFor="contact-message" className="mb-1.5">
                  Mesaj
                </Label>
                <Textarea id="contact-message" className="min-h-32" required />
              </div>
              <Button type="submit" className="mt-2">
                Trimite mesajul
              </Button>
            </form>
          )}
        </div>
      </div>
    </Container>
  );
}
