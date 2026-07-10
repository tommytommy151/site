"use client";

import { Zap } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Countdown } from "@/components/sections/countdown";
import { ProductCarousel } from "@/components/product/product-carousel";
import { useProductStore } from "@/lib/store/product-store";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FlashDeals() {
  const products = useProductStore((s) => s.products);
  const deals = products.filter((p) => p.badges.includes("flash-deal"));
  if (deals.length === 0) return null;

  return (
    <section className="bg-brand-navy py-14 text-white sm:py-16 dark:bg-secondary">
      <Container>
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] text-brand-emerald uppercase">
              <Zap className="size-3.5" /> Black Friday
            </span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Reduceri de <span className="text-brand-indigo">până la 70%</span> — se termină curând
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Countdown hoursFromNow={14} />
            <Link
              href="/products"
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
