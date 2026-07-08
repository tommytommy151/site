import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SpotlightTile } from "@/components/motion/spotlight-tile";
import { brands } from "@/lib/data/categories";

export function BrandsStrip() {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <SectionHeading eyebrow="Creatori" title="Branduri pe care le vindem" href="/brands" />
        <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <RevealItem key={brand.id}>
              <Link href={`/brands/${brand.slug}`} className="group block">
                <SpotlightTile className="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand-emerald/40 group-hover:shadow-lg">
                  <span className="relative z-[2] font-heading text-lg font-semibold tracking-tight">
                    {brand.name}
                  </span>
                  <span className="relative z-[2] text-xs text-muted-foreground">
                    {brand.productCount} produse
                  </span>
                </SpotlightTile>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
