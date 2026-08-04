"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const goPrev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setActive((i) => (i + 1) % images.length);

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
        onClick={() => setOpen(true)}
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
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>
        <span className="glass pointer-events-none absolute right-4 bottom-4 flex size-9 items-center justify-center rounded-full">
          <ZoomIn className="size-4" />
        </span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="flex max-w-[calc(100%-2rem)] items-center justify-center border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-[90vw]"
        >
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <div className="relative flex aspect-square w-full max-w-3xl items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative size-full"
              >
                <Image
                  src={images[active]}
                  alt={name}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous image"
                  className="glass absolute top-1/2 left-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next image"
                  className="glass absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
