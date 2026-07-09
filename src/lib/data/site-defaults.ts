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
  { id: "menu-jurnal", label: "Jurnal", href: "/blog" },
];

export const DEFAULT_HERO: HeroContent = {
  eyebrow: "BLACK FRIDAY — reduceri de până la 70%",
  titleLine1: "Cele mai mari reduceri —",
  titleLine2: "doar în acest weekend.",
  description:
    "Un catalog atent selectat de audio, ceasuri, genți și îmbrăcăminte de la creatori independenți, acum la prețuri de Black Friday — cu o finalizare a comenzii de sub un minut și livrare rapidă.",
  ctaPrimaryLabel: "Cumpără reducerile",
  ctaPrimaryHref: "/deals",
  ctaSecondaryLabel: "Vezi toată colecția",
  ctaSecondaryHref: "/products",
  imageUrl: "https://picsum.photos/seed/lucent-hero-main/1200/750?grayscale",
};

export const DEFAULT_HOME_SECTIONS: HomeSection[] = [
  { id: "todays-offers", label: "Ofertele zilei", visible: true },
  { id: "featured-collections", label: "Colecții recomandate", visible: true },
  { id: "popular-rail", label: "Produse în tendințe", visible: true },
  { id: "categories-grid", label: "Grilă de categorii", visible: true },
  { id: "bestseller-rail", label: "Cele mai vândute", visible: true },
  { id: "flash-deals", label: "Oferte Flash", visible: true },
  { id: "recently-viewed", label: "Văzute recent", visible: true },
  { id: "recommended-rail", label: "Produse recomandate", visible: true },
  { id: "testimonials", label: "Testimoniale", visible: true },
  { id: "newsletter", label: "Newsletter", visible: true },
  { id: "blog-preview", label: "Jurnal (blog)", visible: true },
  { id: "instagram-feed", label: "Feed Instagram", visible: true },
];
