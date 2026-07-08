import type { Product } from "@/types/product";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductCarousel } from "@/components/product/product-carousel";

export function ProductRail({
  eyebrow,
  title,
  description,
  href,
  products,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-14 sm:py-16">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} href={href} />
        <ProductCarousel products={products} />
      </Container>
    </section>
  );
}
