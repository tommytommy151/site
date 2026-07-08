import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";

const COLLECTIONS = [
  {
    title: "Colecția Studio",
    description: "Esențiale audio și de birou pentru cei care lucrează de acasă.",
    href: "/categories/audio",
    image: "https://picsum.photos/seed/lucent-collection-1/1000/1200",
    size: "large",
  },
  {
    title: "Genți pentru sezon cald",
    description: "Genți ușoare, construite pentru sezonul de călătorii.",
    href: "/categories/bags",
    image: "https://picsum.photos/seed/lucent-collection-2/800/600",
    size: "small",
  },
  {
    title: "Esențiale atent alese",
    description: "Fibre naturale, croite să reziste ani la rând.",
    href: "/categories/apparel",
    image: "https://picsum.photos/seed/lucent-collection-3/800/600",
    size: "small",
  },
];

export function FeaturedCollections() {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Colecții"
          title="Colecții recomandate"
          description="Loturi grupate în jurul unei singure idei, nu al unui filtru de categorie."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Reveal>
            <Link
              href={COLLECTIONS[0].href}
              className="group relative block aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-auto lg:h-full"
            >
              <Image
                src={COLLECTIONS[0].image}
                alt={COLLECTIONS[0].title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="font-heading text-2xl font-semibold text-white">
                  {COLLECTIONS[0].title}
                </p>
                <p className="mt-1.5 max-w-sm text-sm text-white/80">{COLLECTIONS[0].description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white">
                  Vezi colecția <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-rows-2">
            {COLLECTIONS.slice(1).map((col, i) => (
              <Reveal key={col.title} delay={0.1 * (i + 1)}>
                <Link
                  href={col.href}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-3xl sm:h-full"
                >
                  <Image
                    src={col.image}
                    alt={col.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-heading text-xl font-semibold text-white">{col.title}</p>
                    <p className="mt-1 max-w-xs text-xs text-white/80">{col.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
