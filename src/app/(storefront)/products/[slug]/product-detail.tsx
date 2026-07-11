"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/product/product-gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductRail } from "@/components/sections/product-rail";
import { TrackRecentlyViewed } from "@/components/product/track-recently-viewed";
import { useProductStore } from "@/lib/store/product-store";
import type { Product } from "@/types/product";

export function ProductDetail({ slug }: { slug: string }) {
  const products = useProductStore((s) => s.products);
  const [mounted, setMounted] = useState(false);
  const [remoteProduct, setRemoteProduct] = useState<Product | null>(null);
  const [remoteChecked, setRemoteChecked] = useState(false);
  useEffect(() => setMounted(true), []);

  const localProduct = products.find((p) => p.slug === slug);

  useEffect(() => {
    if (!mounted || localProduct) return;
    let cancelled = false;
    fetch(`/api/products/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setRemoteProduct(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setRemoteChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [mounted, localProduct, slug]);

  const product = localProduct ?? remoteProduct ?? undefined;

  useEffect(() => {
    if (product) document.title = product.name;
  }, [product]);

  if (!mounted) return null;
  if (!localProduct && !remoteChecked) return null;

  if (!product) {
    return (
      <Container className="flex flex-col items-center justify-center gap-4 py-32 text-center">
        <FileQuestion className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Produsul nu a fost găsit</h1>
        <Button asChild>
          <Link href="/products">Înapoi la produse</Link>
        </Button>
      </Container>
    );
  }

  const related = product.relatedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: product.reviews.length
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackRecentlyViewed productId={product.id} />
      <Container>
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Acasă</span> <span>/</span>
          <span>{product.category}</span> <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <ProductGallery images={product.images} name={product.name} />
          <VariantSelector product={product} />
        </div>

        <ProductTabs product={product} />
      </Container>

      {related.length > 0 && (
        <ProductRail
          eyebrow="S-ar putea să-ți placă"
          title="Produse similare"
          products={related}
        />
      )}
    </div>
  );
}
