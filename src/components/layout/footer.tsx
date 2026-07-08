"use client";

import Link from "next/link";
import { Banknote, Landmark } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/site-logo";
import { useStoreSettingsStore } from "@/lib/store/store-settings-store";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons";
import {
  MastercardIcon,
  PaypalIcon,
  StripeIcon,
  VisaIcon,
} from "@/components/icons/payment-icons";
import { DisputeResolutionBadges } from "@/components/legal/dispute-resolution-badges";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Cumpără",
    links: [
      { label: "Noutăți", href: "/products?sort=new" },
      { label: "Cele mai vândute", href: "/products?sort=bestseller" },
      { label: "Oferte Flash", href: "/deals" },
      { label: "Carduri cadou", href: "/gift-cards" },
      { label: "Branduri", href: "/brands" },
    ],
  },
  {
    title: "Asistență",
    links: [
      { label: "Centru de ajutor", href: "/help" },
      { label: "Urmărește comanda", href: "/account/orders" },
      { label: "Retururi & Schimburi", href: "/returns" },
      { label: "Informații livrare", href: "/shipping" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Companie",
    links: [
      { label: "Despre EstelaOferta", href: "/about" },
      { label: "Jurnal", href: "/blog" },
      { label: "Cariere", href: "/careers" },
      { label: "Sustenabilitate", href: "/sustainability" },
      { label: "Afiliere", href: "/affiliates" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termeni și condiții", href: "/terms" },
      { label: "Politica de confidențialitate", href: "/privacy" },
      { label: "Politica de cookie-uri", href: "/cookies" },
      { label: "Politica de retur", href: "/returns" },
      { label: "Accesibilitate", href: "/accessibility" },
      { label: "ANPC", href: "https://anpc.ro", external: true },
      {
        label: "Soluționarea online a litigiilor",
        href: "https://ec.europa.eu/consumers/odr",
        external: true,
      },
    ],
  },
];

const PAYMENT_LOGOS = [
  { label: "Visa", icon: VisaIcon },
  { label: "Mastercard", icon: MastercardIcon },
  { label: "PayPal", icon: PaypalIcon },
  { label: "Stripe", icon: StripeIcon },
];

const PAYMENT_TEXT_METHODS = [
  { label: "Ramburs", icon: Banknote },
  { label: "Transfer bancar", icon: Landmark },
];

export function Footer() {
  const settings = useStoreSettingsStore((s) => s.settings);

  return (
    <footer className="border-t border-border bg-surface-sunken">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <SiteLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Produse atent alese de la creatori independenți. Finalizare rapidă și sigură a
              comenzii și un magazin construit să se simtă la fel de bine ca ceea ce cumperi.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[InstagramIcon, TwitterIcon, FacebookIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Link social"
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand-emerald hover:text-brand-emerald"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-sm font-semibold text-foreground">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {settings.storeName}. Toate drepturile rezervate.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENT_LOGOS.map(({ label, icon: Icon }) => (
              <Icon key={label} className="h-6 w-auto rounded-md shadow-sm" />
            ))}
            {PAYMENT_TEXT_METHODS.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                <Icon className="size-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <DisputeResolutionBadges className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-6 sm:justify-start" />
      </Container>
    </footer>
  );
}
