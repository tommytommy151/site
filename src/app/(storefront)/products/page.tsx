import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ProductListing } from "@/app/(storefront)/products/product-listing";

export const metadata: Metadata = {
  title: "Toate Produsele",
  description:
    "Explorează întregul catalog EstelaOferta — audio, ceasuri, genți, îmbrăcăminte, casă și accesorii.",
};

export default function ProductsPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Toate Produsele</h1>
          <p className="mt-2 text-muted-foreground">
            Produse atent alese de la creatori independenți, filtrate după preferințele tale.
          </p>
        </div>
        <Suspense>
          <ProductListing />
        </Suspense>
      </Container>
    </div>
  );
}
