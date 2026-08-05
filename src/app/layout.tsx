import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { ThemeApplier } from "@/components/theme-applier";
import { CookieConsent } from "@/components/cookie-consent";
import { ProductStoreHydrator } from "@/components/product-store-hydrator";
import { OrderStoreHydrator } from "@/components/order-store-hydrator";
import { CatalogStoreHydrator } from "@/components/catalog-store-hydrator";
import { MetaPixel } from "@/components/meta-pixel";
import { TikTokPixel } from "@/components/tiktok-pixel";
import { getAllCustomProducts } from "@/lib/products/server-products";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucent-commerce.vercel.app"),
  title: {
    default: "EstelaOferta — Comerț Premium",
    template: "%s · EstelaOferta",
  },
  description:
    "EstelaOferta este o platformă de comerț premium pentru branduri care prețuiesc meșteșugul — produse atent alese, finalizare rapidă a comenzii și un magazin care arată la fel de bine pe cât se simte.",
  openGraph: {
    type: "website",
    siteName: "EstelaOferta",
    title: "EstelaOferta — Comerț Premium",
    description:
      "Produse atent alese, finalizare rapidă a comenzii și un magazin care arată la fel de bine pe cât se simte.",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// Product data below is fetched once per build unless pages revalidate —
// without this, the server-seeded catalog would freeze at whatever existed
// at the last deploy instead of picking up products added/edited since.
export const revalidate = 60;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EstelaOferta",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucent-commerce.vercel.app",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EstelaOferta",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucent-commerce.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucent-commerce.vercel.app"}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialProducts = await getAllCustomProducts();
  return (
    <html lang="ro" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>
          <ThemeApplier />
          <ProductStoreHydrator initialProducts={initialProducts} />
          <OrderStoreHydrator />
          <CatalogStoreHydrator />
          <MetaPixel />
          <TikTokPixel />
          {children}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
