"use client";

import { motion } from "framer-motion";
import { Flame, Percent, Tag } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

const FLOATING_TAGS = [
  { icon: Percent, label: "-70%", className: "top-6 left-[8%] rotate-[-8deg]" },
  { icon: Tag, label: "-50%", className: "top-[55%] left-[2%] rotate-[6deg]" },
  { icon: Flame, label: "-60%", className: "top-10 right-[6%] rotate-[7deg]" },
  { icon: Percent, label: "-40%", className: "bottom-8 right-[10%] rotate-[-5deg]" },
];

export function PromoBanner() {
  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20">
      <motion.div
        className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,var(--brand-navy)_0%,var(--brand-indigo)_45%,var(--brand-emerald)_100%)] bg-[length:200%_200%]"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 -z-10 bg-black/35" />

      {FLOATING_TAGS.map(({ icon: Icon, label, className }) => (
        <motion.div
          key={label}
          className={`animate-float absolute hidden items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm sm:flex ${className}`}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="size-3.5" />
          {label}
        </motion.div>
      ))}

      <Container className="relative flex flex-col items-center gap-6 text-center text-white">
        <Reveal className="flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase ring-1 ring-white/25">
            <Flame className="size-3.5" />
            Black Friday e aici
          </span>

          <h2 className="max-w-3xl text-balance text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Cele mai bune oferte ale anului —{" "}
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              până la 70% reducere
            </span>
          </h2>

          <p className="max-w-xl text-[17px] leading-relaxed text-white/80">
            Mii de produse la prețuri reduse, stoc limitat și livrare rapidă. Ofertele se
            reînnoiesc constant — nu le rata.
          </p>

        </Reveal>
      </Container>
    </section>
  );
}
