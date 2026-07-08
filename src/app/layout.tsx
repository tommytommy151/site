import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { ThemeApplier } from "@/components/theme-applier";
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
  metadataBase: new URL("https://estelaoferta.example"),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}
      >
        <Providers>
          <ThemeApplier />
          {children}
        </Providers>
      </body>
    </html>
  );
}
