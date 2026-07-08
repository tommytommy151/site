import type { Product, ProductBadge, ProductVariant } from "@/types/product";
import { generateReviews } from "./reviews";

const COLORS = {
  black: { name: "Negru Onyx", hex: "#161616" },
  navy: { name: "Bleumarin Închis", hex: "#1e2a44" },
  sand: { name: "Nisipiu", hex: "#d8cbb4" },
  emerald: { name: "Smarald", hex: "#0f7a5c" },
  stone: { name: "Gri Piatră", hex: "#9a9690" },
  cognac: { name: "Coniac", hex: "#8a4a2b" },
  white: { name: "Alb Crem", hex: "#f3f1eb" },
  indigo: { name: "Indigo", hex: "#3e3b8c" },
};

interface Seed {
  id: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  colors: (keyof typeof COLORS)[];
  sizes?: string[];
  rating: number;
  reviewCount: number;
  badges: ProductBadge[];
  features: string[];
  stock: number;
  seedImg: string;
  weightGrams?: number;
  freeShipping?: boolean;
}

const SEEDS: Seed[] = [
  // Audio
  {
    id: "field-monitor-40",
    name: "Field Monitor 40",
    brand: "Auric", brandSlug: "auric",
    category: "Audio", categorySlug: "audio",
    tagline: "Sunet de referință, învelit în spumă cu memorie și aluminiu.",
    description:
      "Field Monitor 40 aduce reglaje de referință de studio într-o formă over-ear pentru uz zilnic. Un driver dinamic de 40mm este calibrat manual pentru echilibru, pernițele sunt finisate cu spumă cu memorie ventilată, iar arcada este frezată dintr-un singur bloc de aluminiu. Include anulare activă a zgomotului cu mod de transparență pentru apeluri.",
    price: 1899, compareAtPrice: 2299,
    colors: ["black", "sand", "navy"],
    rating: 4.8, reviewCount: 214,
    badges: ["bestseller"],
    features: ["Driver de 40mm calibrat manual", "Anulare activă a zgomotului", "Autonomie de 38 de ore", "Încărcare rapidă USB-C", "Bluetooth 5.3 multipunct"],
    stock: 42, seedImg: "audio-1", weightGrams: 285, freeShipping: true,
  },
  {
    id: "capsule-earbuds",
    name: "Capsule Earbuds",
    brand: "Norr", brandSlug: "norr",
    category: "Audio", categorySlug: "audio",
    tagline: "Wireless adevărat, reglat pentru claritate, nu pentru senzațional.",
    description:
      "Capsule elimină basul exagerat al căștilor wireless obișnuite în favoarea unui răspuns plat și precis, pe care îl poți asculta ore în șir. Carcasa de încărcare este frezată din aluminiu reciclat și rezistă o săptămână întreagă între încărcări.",
    price: 749, compareAtPrice: 899,
    colors: ["white", "black"],
    rating: 4.6, reviewCount: 358,
    badges: ["flash-deal"],
    features: ["Driver de 6mm cu strat de titan", "Rezistență la apă IPX5", "24h autonomie totală (cu carcasă)", "Carcasă cu încărcare wireless", "EQ adaptiv"],
    stock: 96, seedImg: "audio-2", weightGrams: 52, freeShipping: true,
  },
  {
    id: "desk-speaker-one",
    name: "Desk Speaker One",
    brand: "Kessel", brandSlug: "kessel",
    category: "Audio", categorySlug: "audio",
    tagline: "Un singur boxă care umple toată camera.",
    description:
      "Desk Speaker One combină un woofer de 3 inch cu un tweeter cu dom din mătase, într-o incintă sigilată din lemn de nuc. Bluetooth, USB-C și o intrare de 3.5mm acoperă orice sursă, iar butonul de volum este cu adevărat analogic, nu un panou tactil.",
    price: 1249,
    colors: ["black", "sand"],
    rating: 4.7, reviewCount: 122,
    badges: ["new"],
    features: ["Incintă din lemn masiv de nuc", "Control analogic al volumului", "Bluetooth 5.2 + USB-C + AUX", "Amplificator clasa D de 40W"],
    stock: 30, seedImg: "audio-3", weightGrams: 1400,
  },
  {
    id: "vinyl-turntable-mk2",
    name: "Turntable MK2",
    brand: "Auric", brandSlug: "auric",
    category: "Audio", categorySlug: "audio",
    tagline: "Analog cu curea de transmisie, construit pentru ascultare zilnică.",
    description:
      "Un pick-up cu curea de transmisie, cu platan din aluminiu turnat și cap de pickup magnetic preinstalat. Preamplificatorul phono integrat înseamnă că se conectează la orice boxă, fără echipament suplimentar necesar.",
    price: 2199,
    colors: ["black", "sand"],
    rating: 4.9, reviewCount: 76,
    badges: ["limited"],
    features: ["Motor DC cu curea de transmisie", "Cap de pickup MM preinstalat", "Preamplificator phono integrat", "33/45 RPM"],
    stock: 12, seedImg: "audio-4",
  },
  {
    id: "travel-radio-mini",
    name: "Travel Radio Mini",
    brand: "Loam", brandSlug: "loam",
    category: "Audio", categorySlug: "audio",
    tagline: "Compact, rezistent la intemperii, surprinzător de puternic.",
    description:
      "O boxă Bluetooth robustă, suficient de mică pentru un buzunar de geacă, certificată IP67 și construită în jurul unui radiator pasiv pentru un bas surprinzător de puternic.",
    price: 349, compareAtPrice: 429,
    colors: ["emerald", "stone", "black"],
    rating: 4.5, reviewCount: 289,
    badges: ["flash-deal", "bestseller"],
    features: ["Rezistență IP67 la apă și praf", "Autonomie de 12 ore", "Radiator pasiv pentru bas", "Include carabină"],
    stock: 140, seedImg: "audio-5", freeShipping: true,
  },
  {
    id: "studio-cans-pro",
    name: "Studio Cans Pro",
    brand: "Vantage", brandSlug: "vantage",
    category: "Audio", categorySlug: "audio",
    tagline: "Monitorizare open-back pentru ascultare critică.",
    description:
      "O cască de referință open-back concepută pentru mixaj și mastering, cu un soundstage larg și natural și pernițe interschimbabile.",
    price: 1599,
    colors: ["black"],
    rating: 4.8, reviewCount: 58,
    badges: [],
    features: ["Design open-back", "Cablu OFC detașabil", "Pernițe interschimbabile", "Driver neodim de 50mm"],
    stock: 22, seedImg: "audio-6",
  },

  // Watches
  {
    id: "meridian-auto",
    name: "Meridian Automatic",
    brand: "Vantage", brandSlug: "vantage",
    category: "Ceasuri", categorySlug: "watches",
    tagline: "Un mecanism automatic elvețian într-o carcasă de 39mm.",
    description:
      "Meridian găzduiește un mecanism automatic elvețian într-o carcasă din oțel inoxidabil 316L periat, acoperită cu cristal safir. Cadranul este finisat cu un model subtil sunray care se schimbă în funcție de lumină.",
    price: 3499,
    colors: ["black", "navy"],
    rating: 4.9, reviewCount: 143,
    badges: ["bestseller"],
    features: ["Mecanism automatic elvețian", "Carcasă inox 316L de 39mm", "Cristal safir, anti-reflexie", "Rezistență la apă 100m", "Cadran finisat sunray"],
    stock: 18, seedImg: "watch-1", freeShipping: true,
  },
  {
    id: "field-chrono",
    name: "Field Chronograph",
    brand: "Norr", brandSlug: "norr",
    category: "Ceasuri", categorySlug: "watches",
    tagline: "Un cronograf cu cuarț de precizie pentru purtat zilnic.",
    description:
      "Field Chronograph combină un mecanism cu cuarț de precizie cu o carcasă robustă din inox, rezistentă la 200m. Aplicarea completă de lume îl menține lizibil zi și noapte.",
    price: 1299, compareAtPrice: 1549,
    colors: ["black", "sand"],
    rating: 4.6, reviewCount: 201,
    badges: ["flash-deal"],
    features: ["Cronograf cu cuarț de precizie", "Rezistență la apă 200m", "Repere luminoase complete", "Cristal mineral acoperit cu safir"],
    stock: 54, seedImg: "watch-2",
  },
  {
    id: "atelier-dress",
    name: "Atelier Dress Watch",
    brand: "Kessel", brandSlug: "kessel",
    category: "Ceasuri", categorySlug: "watches",
    tagline: "Cadran minimalist, curea din piele cusută manual.",
    description:
      "Un ceas elegant cu cristal safir bombat și un cadran redus doar la esențial. Cureaua este din piele tăbăcită vegetal, cusută manual dintr-o singură bucată.",
    price: 1099,
    colors: ["cognac", "black"],
    rating: 4.7, reviewCount: 89,
    badges: ["new"],
    features: ["Cristal safir bombat", "Curea din piele cusută manual", "Mecanism cu cuarț japonez", "Rezistență la apă 5ATM"],
    stock: 40, seedImg: "watch-3",
  },
  {
    id: "expedition-gmt",
    name: "Expedition GMT",
    brand: "Vantage", brandSlug: "vantage",
    category: "Ceasuri", categorySlug: "watches",
    tagline: "Urmărește două fusuri orare fără să atingi telefonul.",
    description:
      "Construit pentru călătorii, Expedition GMT adaugă un al doilea ac de fus orar și o lunetă bidirecțională unei carcase rezistente la 300m, certificate pentru scufundări.",
    price: 2799,
    colors: ["black", "indigo"],
    rating: 4.8, reviewCount: 67,
    badges: ["limited"],
    features: ["Complicație GMT", "Rezistență la apă 300m", "Lunetă ceramică bidirecțională", "Mecanism automatic"],
    stock: 15, seedImg: "watch-4",
  },
  {
    id: "minimalist-mesh",
    name: "Minimalist Mesh",
    brand: "Norr", brandSlug: "norr",
    category: "Ceasuri", categorySlug: "watches",
    tagline: "O carcasă subțire pe o brățară milaneză.",
    description:
      "O carcasă subțire de 36mm construită pentru purtat zilnic, asociată cu o brățară milaneză complet ajustabilă, care se potrivește oricărui încheietură fără verigi suplimentare.",
    price: 799,
    colors: ["black", "white"],
    rating: 4.5, reviewCount: 176,
    badges: [],
    features: ["Carcasă subțire de 36mm", "Brățară milaneză", "Mecanism cu cuarț japonez", "Rezistență la apă 3ATM"],
    stock: 63, seedImg: "watch-5",
  },

  // Bags
  {
    id: "transit-backpack",
    name: "Transit Backpack",
    brand: "Loam", brandSlug: "loam",
    category: "Genți & Carry", categorySlug: "bags",
    tagline: "Un rucsac zilnic de 22L din pânză tehnică reciclată.",
    description:
      "Transit Backpack este confecționat din pânză ripstop reciclată cu tratament hidrofug, structurat în jurul unui compartiment căptușit pentru laptop de 16 inch și o închidere magnetică ce se deschide cu o singură mână.",
    price: 899, compareAtPrice: 1099,
    colors: ["black", "stone", "navy"],
    rating: 4.8, reviewCount: 312,
    badges: ["bestseller", "flash-deal"],
    features: ["Capacitate 22L", "Compartiment căptușit laptop 16\"", "Pânză reciclată rezistentă la apă", "Închidere magnetică cu o mână", "Buzunar de siguranță ascuns"],
    stock: 88, seedImg: "bag-1", freeShipping: true,
  },
  {
    id: "weekender-duffel",
    name: "Weekender Duffel",
    brand: "Kessel", brandSlug: "kessel",
    category: "Genți & Carry", categorySlug: "bags",
    tagline: "Piele integrală, construită să îmbătrânească frumos.",
    description:
      "O geantă de weekend din piele integrală care capătă o patină tot mai bogată cu fiecare călătorie. Feronerie din alamă masivă și o curea de umăr detașabilă.",
    price: 1899,
    colors: ["cognac", "black"],
    rating: 4.9, reviewCount: 94,
    badges: ["limited"],
    features: ["Piele integrală", "Feronerie din alamă masivă", "Curea de umăr detașabilă", "Buzunar interior cu fermoar"],
    stock: 20, seedImg: "bag-2",
  },
  {
    id: "commuter-tote",
    name: "Commuter Tote",
    brand: "Norr", brandSlug: "norr",
    category: "Genți & Carry", categorySlug: "bags",
    tagline: "Geantă tote structurată din pânză, cu compartiment căptușit de 14 inch.",
    description:
      "O geantă tote structurată care își păstrează forma goală sau plină, cu un compartiment căptușit pentru laptop de 14 inch și o închidere cu fermoar care păstrează conținutul în siguranță.",
    price: 549,
    colors: ["sand", "black", "emerald"],
    rating: 4.6, reviewCount: 158,
    badges: ["new"],
    features: ["Construcție din pânză structurată", "Compartiment căptușit laptop 14\"", "Închidere cu fermoar", "Buzunare interioare de organizare"],
    stock: 70, seedImg: "bag-3",
  },
  {
    id: "everyday-sling",
    name: "Everyday Sling",
    brand: "Loam", brandSlug: "loam",
    category: "Genți & Carry", categorySlug: "bags",
    tagline: "O geantă sling minimalistă de 6L, doar pentru esențiale.",
    description:
      "Everyday Sling ține exact ce ai nevoie pentru o zi în oraș — telefon, portofel, chei, o tabletă subțire — într-o formă discretă care nu îți stă în cale.",
    price: 379, compareAtPrice: 449,
    colors: ["black", "stone"],
    rating: 4.7, reviewCount: 203,
    badges: ["flash-deal"],
    features: ["Capacitate 6L", "Curea cross-body ajustabilă", "Fermoare rezistente la apă", "Se potrivește tabletelor de 8\""],
    stock: 112, seedImg: "bag-4",
  },
  {
    id: "leather-briefcase",
    name: "Leather Briefcase",
    brand: "Kessel", brandSlug: "kessel",
    category: "Genți & Carry", categorySlug: "bags",
    tagline: "O servietă structurată pentru birou și nu numai.",
    description:
      "O servietă structurată din piele, cu compartiment dedicat pentru laptop, buzunare pentru documente și o curea care o transformă în geantă cross-body.",
    price: 2299,
    colors: ["cognac", "navy"],
    rating: 4.8, reviewCount: 51,
    badges: [],
    features: ["Piele integrală", "Compartiment căptușit laptop 15\"", "Curea cross-body convertibilă", "Închidere cu fermoar securizată"],
    stock: 16, seedImg: "bag-5",
  },

  // Apparel
  {
    id: "merino-crewneck",
    name: "Merino Crewneck",
    brand: "Halcyon", brandSlug: "halcyon",
    category: "Îmbrăcăminte", categorySlug: "apparel",
    tagline: "Merino de 17,5 microni, reglează temperatura toată ziua.",
    description:
      "Un pulover tricotat din lână merino de 17,5 microni, suficient de fină pentru a fi purtată direct pe piele, suficient de respirabilă pentru purtat toată ziua, în orice sezon.",
    price: 449,
    colors: ["navy", "stone", "black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.8, reviewCount: 267,
    badges: ["bestseller"],
    features: ["Lână merino de 17,5 microni", "Reglare termică", "Rezistență naturală la miros", "Lavabilă la mașină"],
    stock: 150, seedImg: "apparel-1", freeShipping: true,
  },
  {
    id: "organic-oxford-shirt",
    name: "Organic Oxford Shirt",
    brand: "Norr", brandSlug: "norr",
    category: "Îmbrăcăminte", categorySlug: "apparel",
    tagline: "Bumbac organic certificat, spălat pentru finisaj moale.",
    description:
      "O cămașă oxford lejeră din bumbac organic certificat, spălată pentru moliciune încă de la prima purtare.",
    price: 329, compareAtPrice: 389,
    colors: ["white", "sand", "navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.6, reviewCount: 184,
    badges: ["flash-deal"],
    features: ["Bumbac organic certificat GOTS", "Spălată pentru moliciune", "Nasturi din sidef", "Croială lejeră"],
    stock: 130, seedImg: "apparel-2",
  },
  {
    id: "tech-jogger",
    name: "Tech Jogger",
    brand: "Vantage", brandSlug: "vantage",
    category: "Îmbrăcăminte", categorySlug: "apparel",
    tagline: "Material elastic pe patru direcții, croială conică.",
    description:
      "Un pantalon jogger din material tehnic elastic pe patru direcții, cu finisaj DWR, conic pentru o siluetă curată fără a restricționa mișcarea.",
    price: 389,
    colors: ["black", "stone"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7, reviewCount: 221,
    badges: ["new"],
    features: ["Material elastic pe patru direcții", "Finisaj hidrofug DWR", "Croială conică", "Buzunare laterale cu fermoar"],
    stock: 95, seedImg: "apparel-3",
  },
  {
    id: "wool-overcoat",
    name: "Wool Overcoat",
    brand: "Kessel", brandSlug: "kessel",
    category: "Îmbrăcăminte", categorySlug: "apparel",
    tagline: "Lână italiană, croită pentru o siluetă elegantă.",
    description:
      "Un palton croit din lână italiană, cu construcție semi-canvas, care își păstrează forma sezon după sezon.",
    price: 1699,
    colors: ["navy", "black"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9, reviewCount: 43,
    badges: ["limited"],
    features: ["Amestec de lână italiană", "Construcție semi-canvas", "Nasturi din corn", "Buzunar interior la piept"],
    stock: 14, seedImg: "apparel-4",
  },
  {
    id: "everyday-tee-3pack",
    name: "Everyday Tee (Set de 3)",
    brand: "Halcyon", brandSlug: "halcyon",
    category: "Îmbrăcăminte", categorySlug: "apparel",
    tagline: "Esențiale din bumbac Pima, în trei culori.",
    description:
      "Tricoul de zi cu zi, oferit ca set de trei, dintr-un bumbac Pima greu, care rezistă la micșorare și își păstrează forma spălare după spălare.",
    price: 249,
    colors: ["white", "black", "stone"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.5, reviewCount: 312,
    badges: ["bestseller"],
    features: ["Bumbac Pima greu", "Set de 3 bucăți", "Preshrunk", "Guler întărit"],
    stock: 200, seedImg: "apparel-5", freeShipping: true,
  },

  // Home
  {
    id: "ceramic-pour-over",
    name: "Ceramic Pour-Over Set",
    brand: "Loam", brandSlug: "loam",
    category: "Casă", categorySlug: "home",
    tagline: "Ceramică glazurată manual, pentru o dimineață mai lentă.",
    description:
      "Un set de filtru pour-over și carafă, glazurat manual în loturi mici, conceput pentru o extracție uniformă, cu perete dublu pentru păstrarea căldurii.",
    price: 429,
    colors: ["sand", "black"],
    rating: 4.8, reviewCount: 96,
    badges: ["new"],
    features: ["Ceramică glazurată manual", "Perete dublu pentru păstrarea căldurii", "Include filtru reutilizabil", "Carafă de 600ml"],
    stock: 48, seedImg: "home-1",
  },
  {
    id: "linen-bedding-set",
    name: "Linen Bedding Set",
    brand: "Halcyon", brandSlug: "halcyon",
    category: "Casă", categorySlug: "home",
    tagline: "In european spălat cu piatră, devine mai moale cu fiecare spălare.",
    description:
      "Un set de lenjerie de pat și fețe de pernă din in european spălat cu piatră — respirabil, cu reglare termică și tot mai moale după fiecare spălare.",
    price: 799, compareAtPrice: 949,
    colors: ["white", "stone", "sand"],
    sizes: ["Queen", "King"],
    rating: 4.7, reviewCount: 143,
    badges: ["flash-deal"],
    features: ["100% in european", "Spălat cu piatră pentru moliciune", "Certificat OEKO-TEX", "Setul include lenjerie + 2 fețe de pernă"],
    stock: 60, seedImg: "home-2", freeShipping: true,
  },
  {
    id: "table-lamp-arc",
    name: "Table Lamp Arc",
    brand: "Kessel", brandSlug: "kessel",
    category: "Casă", categorySlug: "home",
    tagline: "Lumină caldă reglabilă, într-un abajur din aluminiu turnat.",
    description:
      "O lampă de masă cu abajur din aluminiu turnat și dimmer tactil continuu, reglată la o temperatură de culoare caldă de 2700K.",
    price: 549,
    colors: ["black", "sand"],
    rating: 4.6, reviewCount: 71,
    badges: [],
    features: ["Abajur din aluminiu turnat", "Dimmer tactil continuu", "LED cald 2700K, 15.000 ore", "Port USB-C la bază"],
    stock: 34, seedImg: "home-3",
  },
  {
    id: "wool-throw-blanket",
    name: "Wool Throw Blanket",
    brand: "Loam", brandSlug: "loam",
    category: "Casă", categorySlug: "home",
    tagline: "Lână reciclată, țesută într-o mică fabrică.",
    description:
      "O pătură țesută din fibre de lână reciclată într-o mică fabrică europeană, finisată cu o margine biciuită.",
    price: 379,
    colors: ["stone", "navy", "emerald"],
    rating: 4.7, reviewCount: 118,
    badges: ["bestseller"],
    features: ["Amestec de lână reciclată", "Finisaj țesut, margine biciuită", "130 x 180cm", "Lavabilă la mașină, ciclu rece"],
    stock: 55, seedImg: "home-4",
  },

  // Accessories
  {
    id: "cardholder-slim",
    name: "Slim Cardholder",
    brand: "Kessel", brandSlug: "kessel",
    category: "Accesorii", categorySlug: "accessories",
    tagline: "Piele integrală, ține până la 8 carduri.",
    description:
      "Un suport subțire pentru carduri, croit dintr-o singură bucată de piele integrală, ținând până la opt carduri cu o lamelă centrală de tragere pentru acces rapid.",
    price: 199,
    colors: ["cognac", "black", "navy"],
    rating: 4.7, reviewCount: 402,
    badges: ["bestseller"],
    features: ["Piele integrală", "Ține până la 8 carduri", "Lamelă centrală de tragere", "Strat de protecție RFID"],
    stock: 180, seedImg: "acc-1", freeShipping: true,
  },
  {
    id: "sunglasses-arc",
    name: "Arc Sunglasses",
    brand: "Vantage", brandSlug: "vantage",
    category: "Accesorii", categorySlug: "accessories",
    tagline: "Lentile polarizate într-o ramă din acetat.",
    description:
      "O ramă rotunjită din acetat, echipată cu lentile polarizate UV400, finisate și lustruite manual pentru un aspect premium.",
    price: 549, compareAtPrice: 649,
    colors: ["black", "cognac"],
    rating: 4.6, reviewCount: 88,
    badges: ["flash-deal"],
    features: ["Lentile polarizate UV400", "Ramă din acetat lustruită manual", "Include husă de protecție", "Balamale elastice"],
    stock: 40, seedImg: "acc-2",
  },
  {
    id: "leather-belt-classic",
    name: "Classic Leather Belt",
    brand: "Norr", brandSlug: "norr",
    category: "Accesorii", categorySlug: "accessories",
    tagline: "Piele integrală cu cataramă din alamă masivă.",
    description:
      "O curea clasică din piele integrală tăbăcită vegetal, finisată cu o cataramă din alamă masivă, care va rezista mai mult decât pielea însăși.",
    price: 249,
    colors: ["cognac", "black"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8, reviewCount: 156,
    badges: [],
    features: ["Piele integrală tăbăcită vegetal", "Cataramă din alamă masivă", "Lățime 3cm", "Margini cusute manual"],
    stock: 90, seedImg: "acc-3",
  },
  {
    id: "wool-scarf",
    name: "Wool Scarf",
    brand: "Halcyon", brandSlug: "halcyon",
    category: "Accesorii", categorySlug: "accessories",
    tagline: "Lână de miel, țesută într-un model herringbone.",
    description:
      "Un fular din lână de miel, țesut într-un model herringbone subtil, generos ca dimensiune și finisat cu franjuri legate manual.",
    price: 229,
    colors: ["navy", "stone", "emerald"],
    rating: 4.7, reviewCount: 134,
    badges: ["new"],
    features: ["100% lână de miel", "Țesătură herringbone", "Franjuri legate manual", "180 x 30cm"],
    stock: 75, seedImg: "acc-4",
  },
];

function buildVariants(seed: Seed): ProductVariant[] {
  const colors = seed.colors.length ? seed.colors : (["black"] as (keyof typeof COLORS)[]);
  const sizes = seed.sizes?.length ? seed.sizes : [null];
  const variants: ProductVariant[] = [];
  const perVariantStock = Math.max(1, Math.floor(seed.stock / (colors.length * sizes.length)));

  colors.forEach((color) => {
    sizes.forEach((size) => {
      const options: Record<string, string> = { Culoare: COLORS[color].name };
      if (size) options.Mărime = size;
      variants.push({
        id: `${seed.id}-${color}${size ? `-${size}` : ""}`,
        sku: `${seed.id.toUpperCase()}-${color.slice(0, 3).toUpperCase()}${size ? `-${size}` : ""}`,
        options,
        price: seed.price,
        compareAtPrice: seed.compareAtPrice,
        stock: perVariantStock,
      });
    });
  });

  return variants;
}

export const products: Product[] = SEEDS.map((seed) => {
  const images = [1, 2, 3, 4].map(
    (n) => `https://picsum.photos/seed/lucent-${seed.seedImg}-${n}/1200/1400`,
  );

  return {
    id: seed.id,
    slug: seed.id,
    name: seed.name,
    brand: seed.brand,
    brandSlug: seed.brandSlug,
    category: seed.category,
    categorySlug: seed.categorySlug,
    tagline: seed.tagline,
    description: seed.description,
    price: seed.price,
    compareAtPrice: seed.compareAtPrice,
    currency: "RON",
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    images,
    colorOptions: seed.colors.map((c) => COLORS[c]),
    sizeOptions: seed.sizes,
    variants: buildVariants(seed),
    badges: seed.badges,
    stock: seed.stock,
    sku: `LC-${seed.id.toUpperCase()}`,
    features: seed.features,
    reviews: generateReviews(seed.id, seed.rating, Math.min(8, Math.max(3, Math.round(seed.reviewCount / 40)))),
    relatedIds: [],
    weightGrams: seed.weightGrams,
    freeShipping: seed.freeShipping,
  };
});

// Wire up related products within the same category
products.forEach((product) => {
  product.relatedIds = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4)
    .map((p) => p.id);
});

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsByBrand(brandSlug: string) {
  return products.filter((p) => p.brandSlug === brandSlug);
}

export function getProductsByBadge(badge: Product["badges"][number]) {
  return products.filter((p) => p.badges.includes(badge));
}

export function getRelatedProducts(product: Product) {
  return product.relatedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}
