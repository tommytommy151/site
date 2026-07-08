export interface SiteSettings {
  logoText: string;
  logoImageUrl: string | null;
  siteTitle: string;
  siteDescription: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  showInHeader: boolean;
  showInFooter: boolean;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  imageUrl: string;
}

export interface HomeSection {
  id: string;
  label: string;
  visible: boolean;
}
