"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { useBlogStore } from "@/lib/store/blog-store";
import { formatDate } from "@/lib/format";

export default function BlogPage() {
  const posts = useBlogStore((s) => s.posts);

  return (
    <Container className="py-14 sm:py-16">
      <SectionHeading
        eyebrow="Blog"
        title="Blogul EstelaOferta"
      />
      <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <RevealItem key={post.id}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 360px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="glass absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-medium">
                  {post.category}
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-snug font-medium text-foreground group-hover:text-brand-emerald">
                {post.title}
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {formatDate(post.date)} · {post.readMinutes} min de citit
              </p>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Container>
  );
}
