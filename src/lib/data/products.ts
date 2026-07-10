import type { Product, ProductBadge, ProductVariant } from "@/types/product";
import { generateReviews, generateFixedRatioReviews } from "./reviews";

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
  imgKeyword: string;
  realImage?: string;
  weightGrams?: number;
  freeShipping?: boolean;
}

const SEEDS: Seed[] = [
  // Electrocasnice
  {
    id: "robot-bucatarie-multichef-900",
    name: "Robot de Bucătărie MultiChef 900",
    brand: "Kessel", brandSlug: "kessel",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "9 accesorii, un singur motor de 900W care le face pe toate.",
    description:
      "MultiChef 900 înlocuiește o bucătărie întreagă de gadgeturi cu un singur robot: bol de inox de 5L, tel, cârlig de frământat și disc de tocat, toate acționate de un motor de 900W cu 8 viteze. Bolul și accesoriile merg direct la mașina de spălat vase.",
    price: 899, compareAtPrice: 1299,
    colors: ["black", "white"],
    rating: 4.7, reviewCount: 268,
    badges: ["bestseller", "flash-deal"],
    features: ["Motor 900W, 8 viteze", "Bol din inox de 5L", "9 accesorii incluse", "Protecție la supraîncălzire", "Componente lavabile la mașina de spălat vase"],
    stock: 64, seedImg: "appliance-1", imgKeyword: "blender", weightGrams: 4200, freeShipping: true,
  },
  {
    id: "aspirator-robot-navclean-x2",
    name: "Aspirator Robot NavClean X2",
    brand: "Vantage", brandSlug: "vantage",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "Cartografiere laser și golire automată a rezervorului.",
    description:
      "NavClean X2 mapează fiecare cameră cu laser LiDAR, evită obstacolele în timp real și revine singur la stația de andocare pentru a-și goli rezervorul de praf. Aspirare și mopping în aceeași trecere.",
    price: 1799, compareAtPrice: 2399,
    colors: ["black", "white"],
    rating: 4.6, reviewCount: 194,
    badges: ["flash-deal"],
    features: ["Cartografiere LiDAR", "Stație cu golire automată", "Aspirare + mopping simultan", "Control din aplicație", "Autonomie 150 minute"],
    stock: 28, seedImg: "appliance-2", imgKeyword: "vacuum,cleaner", weightGrams: 3600, freeShipping: true,
  },
  {
    id: "espressor-brewmaster-pro",
    name: "Espressor Automat BrewMaster Pro",
    brand: "Auric", brandSlug: "auric",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "Boabe proaspăt măcinate, espresso de nivel de cafenea acasă.",
    description:
      "BrewMaster Pro macină boabele la fiecare preparare, controlează presiunea la 15 bar și spumează laptele automat pentru cappuccino sau latte cu un singur buton.",
    price: 2199,
    colors: ["black", "stone"],
    rating: 4.8, reviewCount: 121,
    badges: ["new"],
    features: ["Râșniță integrată cu boabe", "Presiune 15 bar", "Spumator automat de lapte", "Rezervor apă 1.8L", "Programe pentru 5 tipuri de cafea"],
    stock: 22, seedImg: "appliance-3", imgKeyword: "espresso,coffee", weightGrams: 8900,
  },
  {
    id: "friteuza-aircrisp-5l",
    name: "Friteuză cu Aer Cald AirCrisp 5L",
    brand: "Norr", brandSlug: "norr",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "Crocant fără ulei, capacitate pentru toată familia.",
    description:
      "AirCrisp 5L folosește circulație rapidă de aer cald pentru rezultate crocante cu până la 90% mai puțin ulei. Capacitatea de 5L acoperă mese pentru 4-6 persoane, iar coșul antiaderent se spală ușor.",
    price: 549, compareAtPrice: 699,
    colors: ["black", "white"],
    rating: 4.7, reviewCount: 356,
    badges: ["bestseller", "flash-deal"],
    features: ["Capacitate 5L", "8 programe presetate", "Coș antiaderent detașabil", "Ecran digital tactil", "Oprire automată"],
    stock: 110, seedImg: "appliance-4", imgKeyword: "airfryer", weightGrams: 5100, freeShipping: true,
  },
  {
    id: "prajitor-retro-toast",
    name: "Prăjitor de Pâine Retro Toast",
    brand: "Loam", brandSlug: "loam",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "Design retro, 6 nivele de rumenire și fantă extra-lată.",
    description:
      "Un prăjitor de pâine cu carcasă metalică retro, fantă extra-lată pentru felii groase și 6 nivele de rumenire reglabile, cu funcții dedicate pentru dezghețare și reîncălzire.",
    price: 279,
    colors: ["cognac", "black", "white"],
    rating: 4.5, reviewCount: 143,
    badges: [],
    features: ["Fantă extra-lată", "6 nivele de rumenire", "Funcții dezghețare/reîncălzire", "Carcasă metalică retro"],
    stock: 85, seedImg: "appliance-5", imgKeyword: "toaster",
  },
  {
    id: "mixer-powerblend-700",
    name: "Mixer de Mână PowerBlend 700",
    brand: "Halcyon", brandSlug: "halcyon",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "700W într-un corp ușor, cu 5 viteze și pulse.",
    description:
      "PowerBlend 700 combină putere de 700W cu un corp ergonomic ușor, 5 viteze plus funcție pulse și tele/cârlige din inox detașabile pentru curățare rapidă.",
    price: 199, compareAtPrice: 249,
    colors: ["black", "white", "sand"],
    rating: 4.6, reviewCount: 227,
    badges: ["flash-deal"],
    features: ["Motor 700W", "5 viteze + pulse", "Tele și cârlige din inox", "Design ergonomic ușor"],
    stock: 150, seedImg: "appliance-6", imgKeyword: "cooking", freeShipping: true,
  },
  {
    id: "statie-calcat-steampress-pro",
    name: "Stație de Călcat cu Abur SteamPress Pro",
    brand: "Kessel", brandSlug: "kessel",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "Presiune de 6 bar și jet de abur continuu de 120g/min.",
    description:
      "SteamPress Pro livrează un jet de abur continuu de 120g/min la o presiune de 6 bar, cu talpă din ceramică ce alunecă fără efort pe orice țesătură, chiar și pe cele groase.",
    price: 699, compareAtPrice: 849,
    colors: ["black", "white"],
    rating: 4.7, reviewCount: 98,
    badges: ["new"],
    features: ["Presiune 6 bar", "Abur continuu 120g/min", "Talpă din ceramică", "Rezervor detașabil 1.2L"],
    stock: 36, seedImg: "appliance-7", imgKeyword: "ironing", weightGrams: 3800,
  },
  {
    id: "ceainic-clearboil",
    name: "Ceainic Electric din Sticlă ClearBoil",
    brand: "Norr", brandSlug: "norr",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "Sticlă borosilicată, iluminare LED și oprire automată.",
    description:
      "Un ceainic electric din sticlă borosilicată rezistentă la temperaturi mari, cu iluminare LED albastră în timpul fierberii, filtru anticalcar detașabil și oprire automată la punctul de fierbere.",
    price: 179,
    colors: ["black", "white"],
    rating: 4.6, reviewCount: 189,
    badges: ["bestseller"],
    features: ["Sticlă borosilicată 1.7L", "Iluminare LED", "Filtru anticalcar detașabil", "Oprire automată"],
    stock: 132, seedImg: "appliance-8", imgKeyword: "kettle",
  },
  {
    id: "cuptor-compactwave",
    name: "Cuptor cu Microunde Grill CompactWave",
    brand: "Vantage", brandSlug: "vantage",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "Microunde + grill într-un format compact de bucătărie.",
    description:
      "CompactWave combină funcția de microunde de 800W cu un grill cuarț de 1000W, într-un format compact de 20L, cu 8 programe automate și buton rotativ pentru control rapid.",
    price: 449, compareAtPrice: 549,
    colors: ["black", "white"],
    rating: 4.5, reviewCount: 112,
    badges: ["flash-deal"],
    features: ["Microunde 800W + Grill 1000W", "Capacitate 20L", "8 programe automate", "Buton rotativ de control"],
    stock: 58, seedImg: "appliance-9", imgKeyword: "microwave", weightGrams: 12000,
  },
  {
    id: "storcator-slowjuice-200",
    name: "Storcător de Fructe SlowJuice 200",
    brand: "Auric", brandSlug: "auric",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "Presare lentă la rece, mai mult suc, mai puține vitamine pierdute.",
    description:
      "SlowJuice 200 presează la rece la doar 43 RPM, păstrând mai multe vitamine și enzime decât storcătoarele centrifugale clasice, cu funcționare aproape silențioasă.",
    price: 649,
    colors: ["black", "stone"],
    rating: 4.7, reviewCount: 76,
    badges: ["limited"],
    features: ["Presare la rece, 43 RPM", "Funcționare silențioasă", "Tub de alimentare larg", "Componente lavabile la mașina de spălat vase"],
    stock: 30, seedImg: "appliance-10", imgKeyword: "fruit",
  },
  {
    id: "blender-smoothblend-1200",
    name: "Blender de Blat SmoothBlend 1200",
    brand: "Auric", brandSlug: "auric",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "1200W și lame din inox pentru smoothie-uri perfect fine.",
    description:
      "SmoothBlend 1200 zdrobește gheață și fructe congelate în secunde, cu un motor de 1200W și lame din inox cu 6 fețe. Vasul din tritan de 1.8L nu reține mirosuri și rezistă la impact.",
    price: 429, compareAtPrice: 599,
    colors: ["black", "white"],
    rating: 4.6, reviewCount: 54,
    badges: ["new"],
    features: ["Motor 1200W", "Lame inox cu 6 fețe", "Vas tritan 1.8L", "3 programe presetate", "Funcție auto-curățare"],
    stock: 48, seedImg: "appliance-11", imgKeyword: "blender,smoothie", weightGrams: 3100,
  },
  {
    id: "cuptor-countertop-xl",
    name: "Cuptor Electric de Blat CompactBake XL",
    brand: "Loam", brandSlug: "loam",
    category: "Electrocasnice", categorySlug: "electrocasnice",
    tagline: "23L, convecție și grill, perfect pentru bucătării mici.",
    description:
      "CompactBake XL aduce coacere cu convecție și grill într-un format de 23L, ideal pentru bucătării mici. Termostat reglabil până la 230°C și timer cu oprire automată.",
    price: 399, compareAtPrice: 489,
    colors: ["black", "stone"],
    rating: 4.5, reviewCount: 39,
    badges: ["new"],
    features: ["Capacitate 23L", "Convecție + grill", "Termostat până la 230°C", "Timer cu oprire automată", "Tavă și grătar incluse"],
    stock: 40, seedImg: "appliance-12", imgKeyword: "oven,kitchen", weightGrams: 9200,
  },

  // Accesorii Telefon
  {
    id: "husa-piele-magsafe-pro",
    name: "Husă din Piele MagSafe Pro",
    brand: "Kessel", brandSlug: "kessel",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Piele naturală, compatibilă cu încărcare magnetică.",
    description:
      "O husă din piele naturală tăbăcită vegetal, cu magneți integrați compatibili cu încărcarea rapidă wireless, care capătă o patină unică în timp.",
    price: 199, compareAtPrice: 259,
    colors: ["cognac", "black", "navy"],
    rating: 4.7, reviewCount: 312,
    badges: ["bestseller", "flash-deal"],
    features: ["Piele naturală tăbăcită vegetal", "Magneți integrați pentru încărcare", "Protecție la colțuri întărită", "Interior microfibră anti-zgârieturi"],
    stock: 210, seedImg: "phone-1", imgKeyword: "phonecase", freeShipping: true,
  },
  {
    id: "folie-sticla-9h",
    name: "Folie Sticlă Securizată 9H",
    brand: "Norr", brandSlug: "norr",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Duritate 9H, kit de aplicare fără bule incluse.",
    description:
      "Sticlă securizată cu duritate 9H, tratată oleofob pentru amprente reduse, livrată cu un chenar de aplicare care garantează poziționare perfectă fără bule de aer.",
    price: 59, compareAtPrice: 89,
    colors: ["black"],
    rating: 4.5, reviewCount: 587,
    badges: ["flash-deal"],
    features: ["Duritate 9H anti-zgâriere", "Tratament oleofob", "Kit de aplicare fără bule", "Compatibilă cu majoritatea huselor"],
    stock: 400, seedImg: "phone-2", imgKeyword: "glass",
  },
  {
    id: "incarcator-wireless-15w",
    name: "Încărcător Wireless Rapid 15W",
    brand: "Vantage", brandSlug: "vantage",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Încărcare fără fir, până la 15W, cu răcire activă.",
    description:
      "Un încărcător wireless cu putere de până la 15W, ventilator intern silențios pentru răcire activă și indicator LED discret care nu deranjează în dormitor.",
    price: 149, compareAtPrice: 199,
    colors: ["black", "white"],
    rating: 4.6, reviewCount: 245,
    badges: ["new"],
    features: ["Putere de încărcare până la 15W", "Răcire activă silențioasă", "LED indicator discret", "Compatibil Qi"],
    stock: 160, seedImg: "phone-3", imgKeyword: "charger", freeShipping: true,
  },
  {
    id: "powerbank-20000",
    name: "Baterie Externă PowerBank 20000mAh",
    brand: "Auric", brandSlug: "auric",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Capacitate mare, două porturi USB-C cu încărcare rapidă.",
    description:
      "20000mAh acoperă mai multe încărcări complete pentru telefon, cu două porturi USB-C de încărcare rapidă la 20W și afișaj digital pentru procentul rămas.",
    price: 229,
    colors: ["black", "sand"],
    rating: 4.7, reviewCount: 198,
    badges: ["bestseller"],
    features: ["Capacitate 20000mAh", "Două porturi USB-C 20W", "Afișaj digital LED", "Încărcare pass-through"],
    stock: 140, seedImg: "phone-4", imgKeyword: "powerbank", weightGrams: 420,
  },
  {
    id: "suport-auto-magnetic",
    name: "Suport Auto Magnetic pentru Telefon",
    brand: "Loam", brandSlug: "loam",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Magneți N52, prindere fermă pe orice grilă de ventilație.",
    description:
      "Un suport auto cu magneți N52 de mare putere, care ține telefonul ferm chiar și pe drum accidentat, cu clemă rotativă pentru grila de ventilație.",
    price: 89, compareAtPrice: 119,
    colors: ["black"],
    rating: 4.6, reviewCount: 267,
    badges: ["flash-deal"],
    features: ["Magneți N52 de mare putere", "Clemă rotativă 360°", "Montare pe grilă de ventilație", "Compatibil MagSafe"],
    stock: 220, seedImg: "phone-5", imgKeyword: "dashboard",
  },
  {
    id: "cablu-usbc-tresat-2m",
    name: "Cablu USB-C la USB-C Tresat 2m",
    brand: "Halcyon", brandSlug: "halcyon",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Împletitură din nailon, rezistent la îndoiri repetate.",
    description:
      "Un cablu USB-C la USB-C cu împletitură din nailon rezistentă, testat la peste 20.000 de îndoiri, cu suport pentru încărcare rapidă până la 100W.",
    price: 69,
    colors: ["black", "white", "navy"],
    rating: 4.5, reviewCount: 341,
    badges: [],
    features: ["Împletitură din nailon", "Testat la 20.000+ îndoiri", "Suportă până la 100W", "Lungime 2 metri"],
    stock: 300, seedImg: "phone-6", imgKeyword: "usbcable", freeShipping: true,
  },
  {
    id: "casca-bluetooth-clearcall",
    name: "Cască Bluetooth In-Ear ClearCall",
    brand: "Kessel", brandSlug: "kessel",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Microfon dublu pentru apeluri clare, autonomie 30h cu carcasă.",
    description:
      "ClearCall reduce zgomotul de fundal la apeluri cu un sistem de microfon dublu și oferă până la 30 de ore de autonomie totală, inclusiv carcasa de încărcare.",
    price: 179, compareAtPrice: 229,
    colors: ["black", "white"],
    rating: 4.6, reviewCount: 176,
    badges: ["flash-deal"],
    features: ["Microfon dublu anti-zgomot", "30h autonomie totală", "Rezistență la apă IPX4", "Control tactil"],
    stock: 95, seedImg: "phone-7", imgKeyword: "earbuds",
  },
  {
    id: "trepied-selfie",
    name: "Trepied Selfie cu Telecomandă",
    brand: "Norr", brandSlug: "norr",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Extensibil până la 1.6m, telecomandă Bluetooth inclusă.",
    description:
      "Un trepied ușor de aluminiu, extensibil până la 1.6 metri, cu suport rotativ 360° pentru telefon și telecomandă Bluetooth inclusă pentru declanșare la distanță.",
    price: 99, compareAtPrice: 139,
    colors: ["black"],
    rating: 4.4, reviewCount: 154,
    badges: ["new"],
    features: ["Extensibil până la 1.6m", "Telecomandă Bluetooth inclusă", "Suport rotativ 360°", "Trepied din aluminiu ușor"],
    stock: 130, seedImg: "phone-8", imgKeyword: "camera",
  },
  {
    id: "adaptor-priza-dual",
    name: "Adaptor Priză Dublu USB-C + USB-A",
    brand: "Vantage", brandSlug: "vantage",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "20W GaN, format compact pentru călătorii.",
    description:
      "Un adaptor de priză compact cu tehnologie GaN, două porturi (USB-C 20W și USB-A), suficient de mic pentru orice trusă de călătorie.",
    price: 79,
    colors: ["black", "white"],
    rating: 4.6, reviewCount: 133,
    badges: [],
    features: ["Tehnologie GaN", "Port USB-C 20W + USB-A", "Format compact de călătorie", "Protecție la supraîncărcare"],
    stock: 175, seedImg: "phone-9", imgKeyword: "charger",
  },
  {
    id: "set-lentile-foto",
    name: "Set Lentile Foto pentru Telefon",
    brand: "Auric", brandSlug: "auric",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Wide, macro și fisheye — clip universal, sticlă optică.",
    description:
      "Un set de 3 lentile din sticlă optică — wide-angle, macro și fisheye — cu clip universal compatibil cu majoritatea telefoanelor și huselor subțiri.",
    price: 129, compareAtPrice: 169,
    colors: ["black"],
    rating: 4.3, reviewCount: 87,
    badges: ["limited"],
    features: ["3 lentile din sticlă optică", "Clip universal", "Husă de transport inclusă", "Compatibil cu huse subțiri"],
    stock: 45, seedImg: "phone-10", imgKeyword: "cameralens",
  },
  {
    id: "suport-birou-flexibil",
    name: "Suport Telefon cu Braț Flexibil pentru Birou",
    brand: "Halcyon", brandSlug: "halcyon",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Braț ajustabil pe 360°, clemă solidă pentru orice birou.",
    description:
      "Un suport cu braț flexibil din aluminiu, ajustabil pe 360° pentru unghiul perfect la apeluri video sau vizionat conținut, cu clemă din cauciuc care nu zgârie biroul.",
    price: 119, compareAtPrice: 149,
    colors: ["black", "white"],
    rating: 4.5, reviewCount: 42,
    badges: ["new"],
    features: ["Braț flexibil din aluminiu", "Ajustare 360°", "Clemă cu cauciuc antiderapant", "Compatibil cu majoritatea telefoanelor"],
    stock: 90, seedImg: "phone-11", imgKeyword: "phonestand,desk",
  },
  {
    id: "cablu-lightning-tresat-1m",
    name: "Cablu Lightning la USB-C Tresat 1m",
    brand: "Kessel", brandSlug: "kessel",
    category: "Accesorii Telefon", categorySlug: "accesorii-telefon",
    tagline: "Împletitură din nailon, certificat MFi, încărcare rapidă.",
    description:
      "Cablu Lightning la USB-C certificat MFi, cu împletitură din nailon rezistentă și conectori din aluminiu, pentru încărcare rapidă și transfer de date stabil.",
    price: 89,
    colors: ["black", "white"],
    rating: 4.6, reviewCount: 61,
    badges: ["new"],
    features: ["Certificat MFi", "Împletitură din nailon", "Conectori din aluminiu", "Lungime 1 metru"],
    stock: 180, seedImg: "phone-12", imgKeyword: "cable,lightning", freeShipping: true,
  },

  // Fashion
  {
    id: "tricou-bumbac-essential",
    name: "Tricou din Bumbac Organic Essential",
    brand: "Halcyon", brandSlug: "halcyon",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Bumbac organic greu, croială care își păstrează forma.",
    description:
      "Un tricou esențial din bumbac organic greu, preshrunk pentru a-și păstra forma spălare după spălare, cu guler întărit și croială curată, nici prea larg, nici prea mulat.",
    price: 129,
    colors: ["white", "black", "stone", "navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.6, reviewCount: 298,
    badges: ["bestseller"],
    features: ["Bumbac organic certificat GOTS", "Preshrunk", "Guler întărit", "Croială regular fit"],
    stock: 220, seedImg: "fashion-1", imgKeyword: "tshirt,cotton", freeShipping: true,
  },
  {
    id: "geaca-bomber-urbanshell",
    name: "Geacă Bomber Impermeabilă UrbanShell",
    brand: "Vantage", brandSlug: "vantage",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Membrană impermeabilă, croială bomber urbană.",
    description:
      "UrbanShell combină o membrană impermeabilă tehnică cu o croială bomber clasică, buzunare cu fermoar ascuns și manșete ajustabile pentru zilele de tranziție.",
    price: 549, compareAtPrice: 699,
    colors: ["black", "navy", "stone"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.7, reviewCount: 176,
    badges: ["flash-deal"],
    features: ["Membrană impermeabilă tehnică", "Buzunare cu fermoar ascuns", "Manșete ajustabile", "Căptușeală interioară moale"],
    stock: 70, seedImg: "fashion-2", imgKeyword: "jacket",
  },
  {
    id: "pantaloni-chino-slim",
    name: "Pantaloni Chino Slim Fit",
    brand: "Norr", brandSlug: "norr",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Bumbac elastic, croială slim care nu restricționează mișcarea.",
    description:
      "Pantaloni chino din bumbac cu adaos de elastan, croiți slim fit pentru o siluetă curată, dar suficient de elastici pentru purtat toată ziua fără disconfort.",
    price: 259, compareAtPrice: 319,
    colors: ["stone", "black", "navy"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5, reviewCount: 214,
    badges: ["flash-deal"],
    features: ["Bumbac cu elastan", "Croială slim fit", "Buzunare frontale oblice", "Talie ajustabilă cu curea interioară"],
    stock: 140, seedImg: "fashion-3", imgKeyword: "trousers",
  },
  {
    id: "rochie-midi-in",
    name: "Rochie Midi din In",
    brand: "Kessel", brandSlug: "kessel",
    category: "Fashion", categorySlug: "fashion",
    tagline: "In respirabil, croială fluidă pentru orice sezon cald.",
    description:
      "O rochie midi din in 100%, cu croială fluidă și curea ajustabilă la talie, respirabilă și confortabilă pentru zile lungi de vară.",
    price: 379,
    colors: ["sand", "white", "emerald"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.8, reviewCount: 132,
    badges: ["new"],
    features: ["100% in natural", "Curea ajustabilă la talie", "Buzunare laterale", "Croială fluidă respirabilă"],
    stock: 58, seedImg: "fashion-4", imgKeyword: "dress",
  },
  {
    id: "pulover-lana-merino",
    name: "Pulover din Lână Merino",
    brand: "Halcyon", brandSlug: "halcyon",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Merino fin de 17,5 microni, purtat direct pe piele.",
    description:
      "Un pulover tricotat din lână merino de 17,5 microni, suficient de fină pentru a fi purtată direct pe piele, cu reglare termică naturală pentru toate anotimpurile.",
    price: 449, compareAtPrice: 549,
    colors: ["navy", "stone", "black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.8, reviewCount: 245,
    badges: ["bestseller", "flash-deal"],
    features: ["Lână merino de 17,5 microni", "Reglare termică naturală", "Rezistență naturală la miros", "Lavabil la mașină"],
    stock: 96, seedImg: "fashion-5", imgKeyword: "sweater", freeShipping: true,
  },
  {
    id: "esarfa-matase",
    name: "Eșarfă din Mătase Imprimată",
    brand: "Loam", brandSlug: "loam",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Mătase 100%, imprimeu exclusiv, margini cusute manual.",
    description:
      "O eșarfă din mătase 100%, cu un imprimeu exclusiv creat pentru colecția de sezon și margini rulate, cusute manual pentru o finisare impecabilă.",
    price: 229,
    colors: ["emerald", "cognac", "black"],
    rating: 4.6, reviewCount: 91,
    badges: [],
    features: ["100% mătase naturală", "Imprimeu exclusiv de sezon", "Margini rulate cusute manual", "90 x 90cm"],
    stock: 64, seedImg: "fashion-6", imgKeyword: "silk",
  },
  {
    id: "curea-piele-reversibila",
    name: "Curea din Piele Reversibilă",
    brand: "Norr", brandSlug: "norr",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Două culori într-o singură curea, cataramă rotativă.",
    description:
      "O curea reversibilă din piele integrală — negru pe o parte, coniac pe cealaltă — cu cataramă rotativă care schimbă instant culoarea vizibilă.",
    price: 199,
    colors: ["black", "cognac"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7, reviewCount: 118,
    badges: [],
    features: ["Piele integrală reversibilă", "Cataramă rotativă", "Două culori într-o curea", "Lățime 3.5cm"],
    stock: 105, seedImg: "fashion-7", imgKeyword: "belt",
  },
  {
    id: "ochelari-aviator",
    name: "Ochelari de Soare Aviator",
    brand: "Vantage", brandSlug: "vantage",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Lentile polarizate UV400, ramă metalică ușoară.",
    description:
      "Un model aviator clasic reinterpretat, cu lentile polarizate UV400 și ramă metalică ultra-ușoară, finisată manual pentru un aspect premium.",
    price: 349, compareAtPrice: 429,
    colors: ["black", "cognac"],
    rating: 4.6, reviewCount: 156,
    badges: ["flash-deal"],
    features: ["Lentile polarizate UV400", "Ramă metalică ultra-ușoară", "Include husă rigidă", "Balamale elastice"],
    stock: 82, seedImg: "fashion-8", imgKeyword: "sunglasses",
  },
  {
    id: "geanta-crossbody",
    name: "Geantă Crossbody Compactă",
    brand: "Kessel", brandSlug: "kessel",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Piele integrală, format compact pentru esențiale zilnice.",
    description:
      "O geantă crossbody compactă din piele integrală, gândită exact pentru esențialele zilnice — telefon, card, chei — cu curea ajustabilă și fermoar securizat.",
    price: 329, compareAtPrice: 399,
    colors: ["cognac", "black", "stone"],
    rating: 4.7, reviewCount: 143,
    badges: ["new"],
    features: ["Piele integrală", "Curea crossbody ajustabilă", "Fermoar securizat", "Buzunar interior cu carduri"],
    stock: 74, seedImg: "fashion-9", imgKeyword: "handbag",
  },
  {
    id: "sneakers-minimalist",
    name: "Sneakers Casual Minimalist",
    brand: "Auric", brandSlug: "auric",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Piele întoarsă și talpă din cauciuc reciclat.",
    description:
      "Un sneaker minimalist din piele întoarsă premium, cu talpă din cauciuc reciclat pentru amortizare pe tot parcursul zilei și un design curat, fără elemente în plus.",
    price: 449, compareAtPrice: 549,
    colors: ["white", "black", "stone"],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    rating: 4.7, reviewCount: 289,
    badges: ["bestseller", "flash-deal"],
    features: ["Piele întoarsă premium", "Talpă din cauciuc reciclat", "Căptușeală respirabilă", "Design minimalist"],
    stock: 118, seedImg: "fashion-10", imgKeyword: "sneakers,shoes", freeShipping: true,
  },
  {
    id: "palton-lana-oversized",
    name: "Palton din Lână Oversized",
    brand: "Vantage", brandSlug: "vantage",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Amestec de lână, croială oversized pentru sezonul rece.",
    description:
      "Un palton dintr-un amestec premium de lână, cu croială oversized și căptușeală moale, gândit pentru straturi confortabile în sezonul rece.",
    price: 649, compareAtPrice: 799,
    colors: ["black", "stone", "navy"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7, reviewCount: 28,
    badges: ["new"],
    features: ["Amestec de lână premium", "Croială oversized", "Căptușeală interioară moale", "Buzunare laterale ascunse"],
    stock: 34, seedImg: "fashion-11", imgKeyword: "coat,wool",
  },
  {
    id: "rucsac-laptop-impermeabil",
    name: "Rucsac Laptop Impermeabil",
    brand: "Norr", brandSlug: "norr",
    category: "Fashion", categorySlug: "fashion",
    tagline: "Material impermeabil, compartiment dedicat pentru laptop de 16\".",
    description:
      "Un rucsac din material impermeabil cu compartiment căptușit pentru laptop de până la 16 inch, port USB extern pentru încărcare și spate ergonomic ventilat.",
    price: 289, compareAtPrice: 349,
    colors: ["black", "stone"],
    rating: 4.6, reviewCount: 47,
    badges: ["new"],
    features: ["Material impermeabil", "Compartiment laptop 16\"", "Port USB extern", "Spate ergonomic ventilat"],
    stock: 66, seedImg: "fashion-12", imgKeyword: "backpack,laptop", freeShipping: true,
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

export const products: Product[] = SEEDS.map((seed, index) => {
  const images = seed.realImage
    ? [seed.realImage]
    : [1, 2, 3, 4].map((n) => `https://picsum.photos/seed/${seed.id}-${n}/1200/1400`);

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
    reviews:
      (index + 1) % 3 === 0
        ? generateFixedRatioReviews(seed.id)
        : generateReviews(seed.id, Math.min(8, Math.max(3, Math.round(seed.reviewCount / 40)))),
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
