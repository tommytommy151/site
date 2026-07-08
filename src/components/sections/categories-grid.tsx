import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SpotlightTile } from "@/components/motion/spotlight-tile";
import { categories } from "@/lib/data/categories";

export function CategoriesGrid() {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Explorează"
          title="Cumpără pe categorii"
          description="Fiecare categorie, selectată manual, nu generată automat."
        />
        <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <RevealItem key={cat.id}>
              <Link href={`/categories/${cat.slug}`} className="group block">
                <SpotlightTile className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-foreground/[0.04] transition-shadow duration-300 group-hover:shadow-xl">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 45vw, 200px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  <div className="absolute inset-x-0 bottom-0 z-[2] p-4">
                    <p className="font-heading text-[15px] font-semibold text-white">{cat.name}</p>
                    <p className="text-xs text-white/75">{cat.productCount} produse</p>
                  </div>
                </SpotlightTile>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
