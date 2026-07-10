import Link from "next/link";
import { ArrowRight, Gift, Percent, Truck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

const OFFERS = [
  {
    icon: Percent,
    title: "Până la 40% reducere",
    description: "Produse audio și ceasuri selectate, până la epuizarea stocului.",
    href: "/products",
    accentClass: "bg-brand-emerald-soft text-brand-emerald",
  },
  {
    icon: Truck,
    title: "Livrare expres gratuită",
    description: "Pentru orice comandă peste 300 RON, fără cod necesar.",
    href: "/shipping",
    accentClass: "bg-brand-indigo-soft text-brand-indigo",
  },
  {
    icon: Gift,
    title: "Ambalaj cadou gratuit",
    description: "Adaugă ambalaj cadou complimentar la finalizarea comenzii.",
    href: "/products",
    accentClass: "bg-brand-emerald-soft text-brand-emerald",
  },
];

export function TodaysOffers() {
  return (
    <section className="py-6 sm:py-8">
      <Container>
        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {OFFERS.map((offer) => (
            <RevealItem key={offer.title}>
              <Link
                href={offer.href}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${offer.accentClass}`}
                >
                  <offer.icon className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{offer.title}</p>
                  <p className="text-xs text-muted-foreground">{offer.description}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
