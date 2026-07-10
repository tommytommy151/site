"use client";

import { Hero } from "@/components/sections/hero";
import { HomeSections } from "@/components/sections/home-sections";
import { PromoBanner } from "@/components/sections/promo-banner";
import { TodaysOffers } from "@/components/sections/todays-offers";
import { FeaturedCollections } from "@/components/sections/featured-collections";
import { ProductRail } from "@/components/sections/product-rail";
import { CategoriesGrid } from "@/components/sections/categories-grid";
import { FlashDeals } from "@/components/sections/flash-deals";
import { RecentlyViewed } from "@/components/sections/recently-viewed";
import { Testimonials } from "@/components/sections/testimonials";
import { Newsletter } from "@/components/sections/newsletter";
import { BlogPreview } from "@/components/sections/blog-preview";
import { InstagramFeedSection } from "@/components/sections/instagram-feed";
import { useProductStore } from "@/lib/store/product-store";

export default function Home() {
  const products = useProductStore((s) => s.products);
  const trending = products.slice(0, 10);
  const bestSellers = products.filter((p) => p.badges.includes("bestseller"));
  const recommended = [...products].reverse().slice(0, 10);

  return (
    <>
      <Hero />
      <HomeSections
        sections={{
          "promo-banner": <PromoBanner />,
          "todays-offers": <TodaysOffers />,
          "featured-collections": <FeaturedCollections />,
          "popular-rail": (
            <ProductRail
              eyebrow="Popular acum"
              title="Produse în tendințe"
              description="Ce adaugă toată lumea în coș săptămâna aceasta."
              href="/products?sort=trending"
              products={trending}
            />
          ),
          "categories-grid": <CategoriesGrid />,
          "bestseller-rail": (
            <ProductRail
              eyebrow="Preferatele clienților"
              title="Cele mai vândute"
              description="Constant peste 4,5 stele, lună de lună."
              href="/products?sort=bestseller"
              products={bestSellers}
            />
          ),
          "flash-deals": <FlashDeals />,
          "recently-viewed": <RecentlyViewed />,
          "recommended-rail": (
            <ProductRail
              eyebrow="Special pentru tine"
              title="Produse recomandate"
              description="Alese pe baza tendințelor din categoriile tale preferate."
              products={recommended}
            />
          ),
          testimonials: <Testimonials />,
          newsletter: <Newsletter />,
          "blog-preview": <BlogPreview />,
          "instagram-feed": <InstagramFeedSection />,
        }}
      />
    </>
  );
}
