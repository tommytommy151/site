"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start">
      <div className="flex shrink-0 gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setActive(i)}
            className={cn(
              "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:size-18",
              active === i ? "border-brand-emerald" : "border-transparent hover:border-border",
            )}
          >
            <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      <div
        className="group relative flex-1 cursor-zoom-in overflow-hidden rounded-3xl bg-muted"
        onClick={() => setZoomed((z) => !z)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative aspect-square w-full"
          >
            <Image
              src={images[active]}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 560px"
              className={cn(
                "object-cover transition-transform duration-300",
                zoomed ? "scale-150" : "scale-100 group-hover:scale-105",
              )}
            />
          </motion.div>
        </AnimatePresence>
        <span className="glass pointer-events-none absolute right-4 bottom-4 flex size-9 items-center justify-center rounded-full">
          <ZoomIn className="size-4" />
        </span>
      </div>
    </div>
  );
}
