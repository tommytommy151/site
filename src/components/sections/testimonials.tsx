import Image from "next/image";
import { Quote } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SpotlightTile } from "@/components/motion/spotlight-tile";
import { RatingStars } from "@/components/ui/rating-stars";
import { testimonials } from "@/lib/data/content";

export function Testimonials() {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Recenzii"
          title="Apreciat de mii de clienți"
          description="Păreri reale de la cumpărători verificați din toate categoriile."
        />
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <RevealItem key={t.id}>
              <SpotlightTile className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                <Quote className="relative z-[2] size-6 text-brand-emerald/40" />
                <p className="relative z-[2] mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <RatingStars rating={t.rating} size={13} className="relative z-[2] mt-5" />
                <div className="relative z-[2] mt-3 flex items-center gap-3">
                  <div className="relative size-9 overflow-hidden rounded-full bg-muted">
                    <Image src={t.avatar} alt={t.author} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </SpotlightTile>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
