"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsletterStore } from "@/lib/store/newsletter-store";

export function Newsletter() {
  const subscribe = useNewsletterStore((s) => s.subscribe);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    subscribe(email);
    setSubmitted(true);
  }

  return (
    <section className="py-14 sm:py-16">
      <Container>
        <Reveal className="gradient-mesh relative overflow-hidden rounded-3xl border border-border px-8 py-14 text-center sm:px-16">
          <div className="mx-auto flex max-w-lg flex-col items-center">
            <div className="glass flex size-12 items-center justify-center rounded-full">
              <Mail className="size-5 text-brand-emerald" />
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Primești 10% reducere la prima comandă
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">
              Abonează-te pentru acces timpuriu la lansări, restocuri și prețuri exclusive pentru
              abonați.
            </p>

            {submitted ? (
              <div className="mt-7 flex items-center gap-2 rounded-full bg-brand-emerald-soft px-5 py-3 text-sm font-medium text-brand-emerald">
                <CheckCircle2 className="size-4" />
                Ești pe listă — verifică-ți inboxul.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 flex w-full max-w-sm gap-2">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@exemplu.com"
                  className="h-11 rounded-full bg-background/80"
                />
                <Button type="submit" size="lg" className="h-11 shrink-0 rounded-full px-5">
                  Abonează-te
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Fără spam. Te poți dezabona oricând.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
