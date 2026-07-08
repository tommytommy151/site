import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductRail } from "@/components/sections/product-rail";
import { TrackRecentlyViewed } from "@/components/product/track-recently-viewed";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: product.images[0] }],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

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

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
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
