import Image from "next/image";
import { Heart } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { InstagramIcon } from "@/components/icons/social-icons";
import { instagramFeed } from "@/lib/data/content";

export function InstagramFeedSection() {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="@estelaoferta"
          title="Cumpără din feed"
          description="Etichetează-ne pentru șansa de a fi prezentat."
        />
        <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {instagramFeed.map((post) => (
            <RevealItem key={post.id}>
              <a
                href="#"
                className="group relative block aspect-square overflow-hidden rounded-2xl bg-muted"
              >
                <Image
                  src={post.image}
                  alt="Postare Instagram"
                  fill
                  sizes="(max-width: 768px) 45vw, 150px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 text-white opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                  <Heart className="size-3.5" fill="currentColor" />
                  <span className="text-xs font-medium">{post.likes}</span>
                </div>
                <InstagramIcon className="absolute top-2 right-2 size-4 text-white drop-shadow" />
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
