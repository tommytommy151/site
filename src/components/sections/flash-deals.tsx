import { Zap } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Countdown } from "@/components/sections/countdown";
import { ProductCarousel } from "@/components/product/product-carousel";
import { getProductsByBadge } from "@/lib/data/products";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FlashDeals() {
  const deals = getProductsByBadge("flash-deal");
  if (deals.length === 0) return null;

  return (
    <section className="bg-brand-navy py-14 text-white sm:py-16 dark:bg-secondary">
      <Container>
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] text-brand-emerald uppercase">
              <Zap className="size-3.5" /> Oferte Flash
            </span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ofertele de azi se termină curând
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Countdown hoursFromNow={14} />
            <Link
              href="/deals"
              className="group hidden items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white sm:flex"
            >
              Vezi tot
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <ProductCarousel products={deals} />
      </Container>
    </section>
  );
}
