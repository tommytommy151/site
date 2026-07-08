"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useBlogStore } from "@/lib/store/blog-store";
import { formatDate } from "@/lib/format";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const posts = useBlogStore((s) => s.posts);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const post = posts.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) document.title = post.title;
  }, [post]);

  if (!mounted) return null;

  if (!post) {
    return (
      <Container className="flex flex-col items-center justify-center gap-4 py-32 text-center">
        <FileQuestion className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Articolul nu a fost găsit</h1>
        <Button asChild>
          <Link href="/blog">Înapoi la jurnal</Link>
        </Button>
      </Container>
    );
  }

  return (
    <Container className="max-w-3xl py-16">
      <span className="rounded-full bg-brand-emerald-soft px-2.5 py-1 text-[11px] font-medium text-brand-emerald">
        {post.category}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {post.author} · {formatDate(post.date)} · {post.readMinutes} min de citit
      </p>
      <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl bg-muted">
        <Image src={post.image} alt={post.title} fill className="object-cover" unoptimized />
      </div>
      <div className="mt-8 text-[15px] leading-relaxed whitespace-pre-wrap text-foreground/90">
        {post.content}
      </div>
    </Container>
  );
}
