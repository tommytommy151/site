import Link from "next/link";
import { Container } from "@/components/layout/container";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/icons/social-icons";

const FOOTER_COLUMNS = [
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
      { label: "Politica de confidențialitate", href: "/privacy" },
      { label: "Termeni și condiții", href: "/terms" },
      { label: "Politica de cookie-uri", href: "/cookies" },
      { label: "Accesibilitate", href: "/accessibility" },
    ],
  },
];

const PAYMENT_METHODS = ["Visa", "Mastercard", "PayPal", "Stripe", "Ramburs", "Transfer bancar"];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-sunken">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-emerald to-brand-indigo">
                <span className="size-2.5 rounded-full bg-white" />
              </span>
              <span className="font-heading text-lg font-semibold tracking-tight">
                Estela<span className="text-brand-emerald">Oferta</span>
              </span>
            </Link>
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
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EstelaOferta Commerce SRL. Toate drepturile rezervate.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
