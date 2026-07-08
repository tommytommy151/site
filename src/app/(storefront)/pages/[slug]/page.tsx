"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useSiteStore } from "@/lib/store/site-store";

export default function CustomPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const pages = useSiteStore((s) => s.pages);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const page = pages.find((p) => p.slug === slug);

  useEffect(() => {
    if (!page) return;
    document.title = page.metaTitle || page.title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", page.metaDescription || "");
  }, [page]);

  if (!mounted) return null;

  if (!page) {
    return (
      <Container className="flex flex-col items-center justify-center gap-4 py-32 text-center">
        <FileQuestion className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Pagina nu a fost găsită</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Pagina căutată nu există sau a fost ștearsă.
        </p>
        <Button asChild>
          <Link href="/">Înapoi la magazin</Link>
        </Button>
      </Container>
    );
  }

  return (
    <Container className="max-w-3xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
        {page.content}
      </div>
    </Container>
  );
}
