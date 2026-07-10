"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Truck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/motion/counter";
import { useSiteStore } from "@/lib/store/site-store";

const TRUST_POINTS = [
  { icon: Truck, label: "Livrare gratuită peste 300 RON" },
];

export function Hero() {
  const hero = useSiteStore((s) => s.hero);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yMain = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const ySide = useTransform(scrollYProgress, [0, 1], [0, 130]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="gradient-mesh absolute inset-0 -z-10" />
      <Container className="grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-foreground"
          >
            <Sparkles className="size-3.5 text-brand-emerald" />
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-[4.25rem]"
          >
            {hero.titleLine1}
            <br />
            <span className="gradient-text">{hero.titleLine2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-lg text-[17px] leading-relaxed text-muted-foreground"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" className="h-12 rounded-full px-7 text-[15px]" asChild>
              <Link href={hero.ctaPrimaryHref}>
                {hero.ctaPrimaryLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 rounded-full px-7 text-[15px]" asChild>
              <Link href={hero.ctaSecondaryHref}>{hero.ctaSecondaryLabel}</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3"
          >
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="size-4 text-brand-emerald" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative grid grid-cols-2 gap-4">
            <motion.div
              style={{ y: yMain }}
              className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-3xl shadow-2xl"
            >
              <Image
                src={hero.imageUrl}
                alt="Produs recomandat"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 90vw, 600px"
                className="object-cover"
              />
            </motion.div>
            <motion.div
              style={{ y: ySide }}
              className="animate-float relative aspect-square overflow-hidden rounded-3xl shadow-xl [animation-delay:1.5s]"
            >
              <Image
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=600&fit=crop&q=80"
                alt="Pungi de cumpărături"
                fill
                sizes="(max-width: 1024px) 45vw, 280px"
                className="object-cover"
              />
            </motion.div>
            <motion.div
              style={{ y: ySide }}
              className="animate-float relative aspect-square overflow-hidden rounded-3xl shadow-xl [animation-delay:3s]"
            >
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=600&fit=crop&q=80"
                alt="Shopping cu reduceri"
                fill
                sizes="(max-width: 1024px) 45vw, 280px"
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="bg-brand-indigo text-white absolute -top-5 -right-5 flex size-24 rotate-6 flex-col items-center justify-center rounded-full text-center shadow-glow-indigo sm:size-28">
            <span className="text-2xl font-bold sm:text-3xl">-70%</span>
            <span className="text-[10px] font-semibold tracking-wide uppercase">Black Friday</span>
          </div>

          <div className="glass absolute -bottom-6 -left-6 hidden rounded-2xl px-5 py-4 shadow-xl sm:block">
            <p className="text-xs text-muted-foreground">Cu încrederea a</p>
            <p className="font-heading text-xl font-semibold">
              peste <Counter value={40000} suffix="+" /> de clienți
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
