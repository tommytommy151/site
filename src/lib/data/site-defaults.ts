import type { HeroContent, HomeSection, MenuItem, SiteSettings } from "@/types/site";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoText: "EstelaOferta",
  logoImageUrl: null,
  siteTitle: "EstelaOferta — Comerț Premium",
  siteDescription:
    "EstelaOferta este o platformă de comerț premium pentru branduri care prețuiesc meșteșugul — produse atent alese, finalizare rapidă a comenzii și un magazin care arată la fel de bine pe cât se simte.",
};

export const DEFAULT_MENU: MenuItem[] = [
  { id: "menu-noutati", label: "Noutăți", href: "/products?sort=new" },
  { id: "menu-oferte", label: "Oferte Flash", href: "/deals" },
  { id: "menu-branduri", label: "Branduri", href: "/brands" },
  { id: "menu-jurnal", label: "Jurnal", href: "/blog" },
];

export const DEFAULT_HERO: HeroContent = {
  eyebrow: "Colecția de sezon este live",
  titleLine1: "Mai puține lucruri, mai bune —",
  titleLine2: "livrate frumos.",
  description:
    "Un catalog atent selectat de audio, ceasuri, genți și îmbrăcăminte de la creatori independenți — cu o finalizare a comenzii de sub un minut și un magazin pe măsura produselor.",
  ctaPrimaryLabel: "Vezi colecția",
  ctaPrimaryHref: "/products",
  ctaSecondaryLabel: "Vezi ofertele flash",
  ctaSecondaryHref: "/deals",
  imageUrl: "https://picsum.photos/seed/lucent-hero-main/1200/750",
};

export const DEFAULT_HOME_SECTIONS: HomeSection[] = [
  { id: "todays-offers", label: "Ofertele zilei", visible: true },
  { id: "featured-collections", label: "Colecții recomandate", visible: true },
  { id: "popular-rail", label: "Produse în tendințe", visible: true },
  { id: "categories-grid", label: "Grilă de categorii", visible: true },
  { id: "bestseller-rail", label: "Cele mai vândute", visible: true },
  { id: "flash-deals", label: "Oferte Flash", visible: true },
  { id: "brands-strip", label: "Branduri", visible: true },
  { id: "recently-viewed", label: "Văzute recent", visible: true },
  { id: "recommended-rail", label: "Produse recomandate", visible: true },
  { id: "testimonials", label: "Testimoniale", visible: true },
  { id: "newsletter", label: "Newsletter", visible: true },
  { id: "blog-preview", label: "Jurnal (blog)", visible: true },
  { id: "instagram-feed", label: "Feed Instagram", visible: true },
];
