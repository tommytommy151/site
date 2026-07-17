import type { Product, ProductBadge, ProductVariant } from "@/types/product";
import { generateSmallReviewSet } from "./reviews";

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
      "Robotul de bucătărie MultiChef 900 de la Kessel transformă prepararea zilnică a mâncării într-un proces simplu, cu un motor puternic de 900W și 9 accesorii incluse pentru orice rețetă. Bolul de inox de 5L, telul, cârligul de frământat și discul de tocat acoperă tot ce ai nevoie pentru aluaturi, creme sau tocaturi, iar cele 8 viteze dau control fin pe fiecare textură. Toate componentele merg direct la mașina de spălat vase, așa că îngrijirea zilnică durează câteva minute. Alege MultiChef 900 din categoria Electrocasnice de pe EstelaOferta pentru o bucătărie mai eficientă, cu livrare rapidă.",
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
      "Aspiratorul robot NavClean X2 de la Vantage automatizează curățenia acasă printr-o hartă precisă a fiecărei camere, generată cu tehnologie LiDAR. Evită obstacolele în timp real, aspiră și spală podeaua în aceeași trecere, apoi revine singur la stația de andocare pentru a-și goli rezervorul de praf. Cu autonomie de 150 de minute și control complet din aplicație, NavClean X2 acoperă apartamente și case cu mai multe camere fără supraveghere. Comandă acest aspirator robot din categoria Electrocasnice de pe EstelaOferta și primești livrare rapidă și garanție.",
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
      "Espressorul automat BrewMaster Pro de la Auric aduce experiența unei cafenele acasă, măcinând boabele proaspăt la fiecare preparare și controlând presiunea la 15 bar pentru un espresso consistent. Spumatorul automat de lapte pregătește cappuccino sau latte cu un singur buton, iar cele 5 programe presetate acoperă toate băuturile preferate. Rezervorul de 1.8L reduce numărul de realimentări în timpul zilei. Găsești BrewMaster Pro în categoria Electrocasnice de pe EstelaOferta, cu livrare rapidă.",
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
      "Friteuza cu aer cald AirCrisp 5L de la Norr obține rezultate crocante cu până la 90% mai puțin ulei, datorită circulației rapide de aer cald din interior. Capacitatea de 5 litri este suficientă pentru mese pentru 4-6 persoane, iar cele 8 programe presetate simplifică prepararea cartofilor prăjiți, puiului sau legumelor. Coșul antiaderent detașabil se spală ușor, iar oprirea automată previne gătirea excesivă. AirCrisp 5L este disponibilă în categoria Electrocasnice de pe EstelaOferta, cu livrare rapidă.",
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
      "Prăjitorul de pâine Retro Toast de la Loam îmbină un design retro cu carcasă metalică cu funcționalitate modernă: fantă extra-lată pentru felii groase și 6 nivele de rumenire reglabile. Funcțiile dedicate pentru dezghețare și reîncălzire îl fac practic pentru orice dimineață, indiferent de tipul de pâine folosit. Este un accesoriu de bucătărie potrivit atât pentru bucătării moderne, cât și pentru cele cu decor clasic. Descoperă Prăjitorul de Pâine Retro Toast și restul gamei Electrocasnice pe EstelaOferta.",
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
      "Mixerul de mână PowerBlend 700 de la Halcyon oferă 700W de putere într-un corp ergonomic ușor, ideal pentru bătut albușuri, frișcă sau aluaturi în bucătăria de zi cu zi. Cele 5 viteze plus funcția pulse dau control precis asupra texturii, iar telele și cârligele din inox se detașează rapid pentru spălare. Este o soluție compactă pentru cei care gătesc și coc frecvent, dar nu au loc pentru un robot mare. PowerBlend 700 este disponibil în categoria Electrocasnice de pe EstelaOferta, cu livrare rapidă.",
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
      "Stația de călcat cu abur SteamPress Pro de la Kessel livrează un jet de abur continuu de 120g/min la o presiune de 6 bar, suficient pentru a netezi rapid chiar și țesăturile groase. Talpa din ceramică alunecă fără efort pe orice material, iar rezervorul detașabil de 1.2L reduce pauzele pentru realimentare cu apă. Este alegerea potrivită pentru cei care calcă des și vor rezultate de nivel profesionist acasă. Comandă SteamPress Pro din categoria Electrocasnice de pe EstelaOferta, cu livrare rapidă și garanție.",
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
      "Ceainicul electric din sticlă ClearBoil de la Norr este realizat din sticlă borosilicată rezistentă la temperaturi mari și are o iluminare LED albastră ce se activează pe durata fierberii. Filtrul anticalcar detașabil păstrează apa curată, iar oprirea automată la punctul de fierbere elimină riscul de supraîncălzire. Capacitatea de 1.7L acoperă nevoile unei familii sau ale unui birou mic. ClearBoil face parte din categoria Electrocasnice de pe EstelaOferta.",
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
      "Cuptorul cu microunde și grill CompactWave de la Vantage combină o funcție de microunde de 800W cu un grill din cuarț de 1000W, într-un format compact de 20L potrivit pentru bucătării mici. Cele 8 programe automate și butonul rotativ simplifică prepararea zilnică, de la reîncălzire rapidă la gratinare. Este o soluție 2-în-1 pentru cei care vor să economisească spațiu pe blat. Găsești CompactWave în categoria Electrocasnice de pe EstelaOferta, cu livrare rapidă.",
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
      "Storcătorul de fructe SlowJuice 200 de la Auric presează la rece, la doar 43 RPM, păstrând mai multe vitamine și enzime decât storcătoarele centrifugale clasice. Funcționarea aproape silențioasă îl face potrivit pentru pregătirea sucurilor dimineața devreme, fără să deranjezi restul casei. Componentele lavabile la mașina de spălat vase reduc timpul de curățare de după fiecare utilizare. SlowJuice 200 este disponibil în stoc limitat în categoria Electrocasnice de pe EstelaOferta.",
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
      "Blenderul de blat SmoothBlend 1200 de la Auric zdrobește gheață și fructe congelate în câteva secunde, datorită motorului de 1200W și lamelor din inox cu 6 fețe. Vasul din tritan de 1.8L nu reține mirosuri și rezistă la impact, iar funcția de auto-curățare scurtează timpul petrecut la spălat. Cele 3 programe presetate acoperă smoothie-uri, shake-uri și gheață pisată. SmoothBlend 1200 este disponibil în categoria Electrocasnice de pe EstelaOferta, cu livrare rapidă.",
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
      "Cuptorul electric de blat CompactBake XL de la Loam aduce coacere cu convecție și grill într-un format de 23L, ideal pentru bucătării mici sau ca a doua sursă de coacere. Termostatul reglabil până la 230°C și timerul cu oprire automată dau control precis asupra fiecărei preparări, iar tava și grătarul incluse acoperă majoritatea rețetelor. Este o alegere practică pentru cei care nu au spațiu pentru un cuptor încorporat. Comandă CompactBake XL din categoria Electrocasnice de pe EstelaOferta, cu livrare rapidă și garanție.",
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
      "Husa din piele MagSafe Pro de la Kessel este realizată din piele naturală tăbăcită vegetal, care capătă o patină unică pe măsură ce o folosești. Magneții integrați sunt compatibili cu încărcarea rapidă wireless, iar colțurile întărite și interiorul din microfibră protejează telefonul de zgârieturi și impact. Este alegerea potrivită pentru cei care vor o husă premium, nu doar una funcțională. Husa din Piele MagSafe Pro este disponibilă în categoria Accesorii Telefon de pe EstelaOferta, cu livrare rapidă.",
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
      "Folia de sticlă securizată 9H de la Norr protejează ecranul telefonului împotriva zgârieturilor și loviturilor ușoare, cu un tratament oleofob care reduce urmele de amprente. Chenarul de aplicare inclus garantează poziționare perfectă, fără bule de aer, chiar și pentru cei care o montează prima dată. Este compatibilă cu majoritatea huselor de pe piață, fără să afecteze sensibilitatea la atingere. Folia Sticlă Securizată 9H face parte din categoria Accesorii Telefon de pe EstelaOferta.",
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
      "Încărcătorul wireless rapid de 15W de la Vantage alimentează telefonul fără cabluri, cu un ventilator intern silențios care menține o temperatură optimă de încărcare. Indicatorul LED discret nu deranjează în dormitor, iar compatibilitatea Qi îl face potrivit pentru majoritatea telefoanelor moderne. Este un accesoriu practic pentru birou sau noptieră. Încărcătorul Wireless Rapid 15W este disponibil în categoria Accesorii Telefon de pe EstelaOferta, cu livrare rapidă.",
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
      "Bateria externă PowerBank 20000mAh de la Auric acoperă mai multe încărcări complete pentru telefon, fiind ideală pentru călătorii sau zile lungi departe de priză. Cele două porturi USB-C de 20W permit încărcare rapidă simultană pentru două dispozitive, iar afișajul digital arată exact procentul rămas. Funcția pass-through permite încărcarea bateriei și a telefonului în același timp. PowerBank 20000mAh face parte din categoria Accesorii Telefon de pe EstelaOferta.",
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
      "Suportul auto magnetic pentru telefon de la Loam folosește magneți N52 de mare putere pentru a ține telefonul ferm, chiar și pe drum accidentat. Clema rotativă se montează simplu pe grila de ventilație și permite rotirea telefonului pe 360° pentru orientare portrait sau landscape. Este compatibil cu tehnologia MagSafe, dar funcționează la fel de bine cu majoritatea huselor. Comandă Suportul Auto Magnetic din categoria Accesorii Telefon de pe EstelaOferta, cu livrare rapidă și garanție.",
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
      "Cablul USB-C la USB-C tresat de 2m de la Halcyon are o împletitură din nailon rezistentă, testată la peste 20.000 de îndoiri, pentru o durată de viață mult mai lungă decât a cablurilor obișnuite. Suportă încărcare rapidă până la 100W, suficient pentru laptopuri și telefoane deopotrivă. Lungimea de 2 metri oferă libertate de mișcare în timpul încărcării. Cablul USB-C Tresat 2m este disponibil în categoria Accesorii Telefon de pe EstelaOferta.",
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
      "Căștile bluetooth in-ear ClearCall de la Kessel folosesc un sistem de microfon dublu pentru a reduce zgomotul de fundal la apeluri, ideal pentru muncă de acasă sau deplasări. Autonomia totală de 30 de ore, inclusiv carcasa de încărcare, acoperă zile întregi de utilizare, iar rezistența la apă IPX4 le face potrivite și pentru antrenamente. Controlul tactil simplifică schimbarea melodiilor și răspunsul la apeluri. ClearCall este disponibilă în categoria Accesorii Telefon de pe EstelaOferta, cu livrare rapidă.",
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
      "Trepiedul selfie cu telecomandă de la Norr este extensibil până la 1.6 metri și are un suport rotativ 360° pentru orice unghi de filmare sau fotografiere. Telecomanda Bluetooth inclusă permite declanșarea de la distanță, fără a atinge telefonul. Structura ușoară din aluminiu îl face practic pentru călătorii și conținut pentru social media. Trepiedul Selfie cu Telecomandă face parte din categoria Accesorii Telefon de pe EstelaOferta.",
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
      "Adaptorul de priză dublu USB-C + USB-A de la Vantage folosește tehnologie GaN pentru un format compact, fără a compromite puterea de încărcare. Portul USB-C de 20W încarcă rapid telefonul, iar portul USB-A rămâne util pentru accesorii mai vechi. Protecția la supraîncărcare îl face sigur pentru utilizare zilnică sau în călătorii. Adaptorul Priză Dublu este disponibil în categoria Accesorii Telefon de pe EstelaOferta, cu livrare rapidă.",
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
      "Setul de lentile foto pentru telefon de la Auric include 3 lentile din sticlă optică — wide-angle, macro și fisheye — pentru fotografii creative direct de pe telefon. Clipul universal este compatibil cu majoritatea telefoanelor și huselor subțiri, iar husa de transport inclusă protejează lentilele pe drum. Este un accesoriu potrivit pentru cei pasionați de fotografie mobilă. Setul de Lentile Foto este disponibil în stoc limitat în categoria Accesorii Telefon de pe EstelaOferta.",
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
      "Suportul de telefon cu braț flexibil pentru birou de la Halcyon se ajustează pe 360° pentru unghiul perfect la apeluri video sau vizionat conținut. Brațul din aluminiu este suficient de rigid pentru a menține telefonul stabil, iar clema din cauciuc antiderapant nu zgârie biroul. Este compatibil cu majoritatea telefoanelor, indiferent de dimensiune. Comandă Suportul Birou Flexibil din categoria Accesorii Telefon de pe EstelaOferta, cu livrare rapidă și garanție.",
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
      "Cablul Lightning la USB-C tresat de 1m de la Kessel este certificat MFi, garantând compatibilitate completă cu dispozitivele Apple. Împletitura din nailon și conectorii din aluminiu îi oferă rezistență la uz zilnic, iar transferul de date rămâne stabil chiar și la încărcare rapidă. Lungimea de 1 metru este ideală pentru încărcare de pe birou sau noptieră. Cablul Lightning Tresat 1m face parte din categoria Accesorii Telefon de pe EstelaOferta.",
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
      "Tricoul din bumbac organic Essential de la Halcyon este realizat dintr-un bumbac organic certificat GOTS, greu și rezistent, preshrunk pentru a-și păstra forma spălare după spălare. Gulerul întărit și croiala regular fit fac acest tricou versatil, potrivit atât pentru purtat zilnic, cât și sub o jachetă. Este disponibil în mai multe culori și mărimi, de la XS la XL. Tricoul Essential face parte din categoria Fashion de pe EstelaOferta, cu livrare rapidă.",
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
      "Geaca bomber impermeabilă UrbanShell de la Vantage combină o membrană tehnică impermeabilă cu o croială bomber clasică, potrivită pentru zilele de tranziție dintre sezoane. Buzunarele cu fermoar ascuns și manșetele ajustabile adaugă funcționalitate fără să afecteze silueta, iar căptușeala interioară moale oferă confort suplimentar. Este disponibilă în mai multe mărimi, de la S la XXL. Comandă UrbanShell din categoria Fashion de pe EstelaOferta, cu livrare rapidă.",
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
      "Pantalonii chino slim fit de la Norr sunt confecționați din bumbac cu adaos de elastan, pentru o siluetă curată care nu restricționează mișcarea pe parcursul zilei. Buzunarele frontale oblice și talia ajustabilă cu curea interioară completează o croială gândită pentru purtat zilnic, la birou sau în oraș. Sunt disponibili în culori neutre, ușor de asortat. Pantalonii Chino Slim Fit fac parte din categoria Fashion de pe EstelaOferta.",
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
      "Rochia midi din in de la Kessel este confecționată din in 100%, un material respirabil, potrivit pentru zile lungi de vară. Croiala fluidă și cureaua ajustabilă la talie oferă o siluetă flatantă, fără să limiteze mișcarea, iar buzunarele laterale adaugă practicitate rar întâlnită la rochii. Este disponibilă în mai multe culori, de la nisipiu la smarald. Rochia Midi din In face parte din categoria Fashion de pe EstelaOferta, cu livrare rapidă.",
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
      "Puloverul din lână merino de la Halcyon este tricotat din fire fine de 17,5 microni, suficient de moi pentru a fi purtate direct pe piele, fără disconfort. Lâna merino reglează temperatura corpului în mod natural și rezistă la mirosuri, ceea ce îl face potrivit pentru purtat mai multe zile la rând între spălări. Este lavabil la mașină și disponibil în mărimi de la XS la XL. Puloverul din Lână Merino face parte din categoria Fashion de pe EstelaOferta.",
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
      "Eșarfa din mătase imprimată de la Loam este realizată din mătase 100%, cu un imprimeu exclusiv creat pentru colecția de sezon. Marginile rulate, cusute manual, adaugă o finisare impecabilă, tipică pieselor lucrate cu atenție la detalii. Cu dimensiunea de 90x90cm, este versatilă — o poți purta la gât, ca accesoriu de păr sau eșarfă de geantă. Eșarfa din Mătase Imprimată face parte din categoria Fashion de pe EstelaOferta.",
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
      "Cureaua din piele reversibilă de la Norr este realizată din piele integrală, cu negru pe o parte și coniac pe cealaltă, astfel încât o singură curea acoperă două ținute diferite. Catarama rotativă schimbă instant culoarea vizibilă, fără a scoate cureaua din pantaloni. Lățimea de 3.5cm o face potrivită atât pentru ținute casual, cât și office. Cureaua din Piele Reversibilă este disponibilă în categoria Fashion de pe EstelaOferta, cu livrare rapidă.",
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
      "Ochelarii de soare aviator de la Vantage reinterpretează un model clasic, cu lentile polarizate UV400 care reduc strălucirea și protejează ochii pe zile însorite. Rama metalică ultra-ușoară este finisată manual pentru un aspect premium, iar balamalele elastice se adaptează formei feței pentru un confort mai bun. Vin cu husă rigidă inclusă pentru protecție pe drum. Ochelarii Aviator fac parte din categoria Fashion de pe EstelaOferta.",
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
      "Geanta crossbody compactă de la Kessel este realizată din piele integrală și gândită exact pentru esențialele zilnice — telefon, card, chei. Cureaua ajustabilă și fermoarul securizat oferă confort și siguranță, iar buzunarul interior cu compartimente pentru carduri organizează spațiul intern. Este disponibilă în mai multe culori, de la coniac la negru. Comandă Geanta Crossbody Compactă din categoria Fashion de pe EstelaOferta, cu livrare rapidă și garanție.",
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
      "Sneakers-ii casual minimalist de la Auric sunt realizați din piele întoarsă premium, cu talpă din cauciuc reciclat care amortizează pasul pe tot parcursul zilei. Designul curat, fără elemente în plus, îi face ușor de asortat cu ținute casual sau smart-casual, iar căptușeala respirabilă menține confortul pe orele lungi. Sunt disponibili în mărimile 39-45. Sneakers Minimalist face parte din categoria Fashion de pe EstelaOferta, cu livrare rapidă.",
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
      "Paltonul din lână oversized de la Vantage este confecționat dintr-un amestec premium de lână, cu o croială largă, gândită pentru straturi confortabile în sezonul rece. Căptușeala interioară moale și buzunarele laterale ascunse completează o piesă practică, la fel de potrivită pentru oraș cât și pentru ținute mai elegante. Este disponibil în mărimi de la S la XL. Paltonul din Lână Oversized face parte din categoria Fashion de pe EstelaOferta.",
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
      "Rucsacul laptop impermeabil de la Norr are un compartiment căptușit pentru laptopuri de până la 16 inch, protejat de un material exterior rezistent la stropi și ploaie ușoară. Portul USB extern permite încărcarea telefonului direct din rucsac, iar spatele ergonomic ventilat reduce transpirația pe parcursul zilei. Este potrivit atât pentru navetă, cât și pentru călătorii scurte. Rucsacul Laptop Impermeabil este disponibil în categoria Fashion de pe EstelaOferta, cu livrare rapidă.",
    price: 289, compareAtPrice: 349,
    colors: ["black", "stone"],
    rating: 4.6, reviewCount: 47,
    badges: ["new"],
    features: ["Material impermeabil", "Compartiment laptop 16\"", "Port USB extern", "Spate ergonomic ventilat"],
    stock: 66, seedImg: "fashion-12", imgKeyword: "backpack,laptop", freeShipping: true,
  },
  // Bucătărie
  {
    id: "set-cutite-chefline-pro",
    name: "Set Cuțite Bucătărie ChefLine Pro",
    brand: "Norr", brandSlug: "norr",
    category: "Bucătărie", categorySlug: "bucatarie",
    tagline: "6 cuțite din oțel inoxidabil german, cu suport din lemn inclus.",
    description:
      "Setul de cuțite de bucătărie ChefLine Pro de la Norr include 6 cuțite din oțel inoxidabil de înaltă calitate, ascuțite din fabrică la un unghi de 15° pentru tăiere precisă. Mânerele ergonomice antiderapante oferă control sigur, iar suportul din lemn de fag inclus păstrează cuțitele organizate și protejate. Este un set complet pentru orice bucătărie, de la tăiat legume la dezosat carne. Setul ChefLine Pro face parte din categoria Bucătărie de pe EstelaOferta, cu livrare rapidă.",
    price: 249, compareAtPrice: 349,
    colors: ["black", "stone"],
    rating: 4.6, reviewCount: 94,
    badges: ["bestseller"],
    features: ["Oțel inoxidabil german", "6 cuțite + suport din lemn", "Ascuțire din fabrică 15°", "Mânere ergonomice antiderapante"],
    stock: 40, seedImg: "kitchen-1", imgKeyword: "knife,kitchen", freeShipping: true,
  },
  {
    id: "vas-fonta-emailata-5l",
    name: "Vas Gătit din Fontă Emailată 5L",
    brand: "Kessel", brandSlug: "kessel",
    category: "Bucătărie", categorySlug: "bucatarie",
    tagline: "Distribuție uniformă a căldurii, potrivit pentru toate tipurile de plite.",
    description:
      "Vasul de gătit din fontă emailată de 5L de la Kessel distribuie căldura uniform, ideal pentru tocănițe și fripturi gătite la foc mic, timp îndelungat. Este compatibil cu toate tipurile de plite, inclusiv inducție, și poate fi folosit direct în cuptor. Capacul cu etanșare păstrează umiditatea în vas, pentru preparate mai fragede. Vasul din Fontă Emailată 5L este disponibil în categoria Bucătărie de pe EstelaOferta.",
    price: 389, compareAtPrice: 499,
    colors: ["emerald", "black"],
    rating: 4.8, reviewCount: 61,
    badges: ["new"],
    features: ["Fontă emailată 5L", "Compatibil inducție și cuptor", "Distribuție uniformă a căldurii", "Capac cu etanșare pentru umiditate"],
    stock: 22, seedImg: "kitchen-2", imgKeyword: "cookware,pot", weightGrams: 4800,
  },
  {
    id: "set-recipiente-freshbox",
    name: "Set Recipiente Depozitare Alimente FreshBox",
    brand: "Loam", brandSlug: "loam",
    category: "Bucătărie", categorySlug: "bucatarie",
    tagline: "10 recipiente ermetice, fără BPA, stivuibile.",
    description:
      "Setul de recipiente de depozitare FreshBox de la Loam include 10 recipiente din plastic fără BPA, cu capace ermetice care păstrează alimentele proaspete mai mult timp. Sunt sigure pentru frigider, congelator și microunde, iar designul stivuibil economisește spațiu în dulap sau cămară. Este o soluție practică pentru organizarea meselor pregătite din timp. Setul FreshBox face parte din categoria Bucătărie de pe EstelaOferta, cu livrare rapidă.",
    price: 129,
    colors: ["white", "sand"],
    rating: 4.5, reviewCount: 38,
    badges: [],
    features: ["10 recipiente + capace", "Fără BPA", "Sigur la frigider, congelator, microunde", "Design stivuibil"],
    stock: 55, seedImg: "kitchen-3", imgKeyword: "food,container", freeShipping: true,
  },
  {
    id: "balanta-digitala-preciweigh",
    name: "Balanță Bucătărie Digitală PreciWeigh",
    brand: "Auric", brandSlug: "auric",
    category: "Bucătărie", categorySlug: "bucatarie",
    tagline: "Precizie de 1g, platformă din sticlă călită.",
    description:
      "Balanța digitală de bucătărie PreciWeigh de la Auric cântărește cu precizie de 1 gram, utilă pentru rețete unde dozajul contează. Platforma din sticlă călită este ușor de curățat, iar funcția de tarare permite cântărirea ingredientelor direct în bol, fără vase suplimentare. Oprirea automată prelungește durata de viață a bateriei. Balanța PreciWeigh este disponibilă în categoria Bucătărie de pe EstelaOferta.",
    price: 89,
    colors: ["black", "white"],
    rating: 4.4, reviewCount: 27,
    badges: [],
    features: ["Precizie 1g", "Platformă sticlă călită", "Funcție de tarare", "Oprire automată"],
    stock: 48, seedImg: "kitchen-4", imgKeyword: "kitchen,scale",
  },
  // Baie
  {
    id: "set-prosoape-softtouch",
    name: "Set Prosoape Bumbac Organic SoftTouch",
    brand: "Loam", brandSlug: "loam",
    category: "Baie", categorySlug: "baie",
    tagline: "6 prosoape din bumbac organic 100%, absorbție ridicată.",
    description:
      "Setul de prosoape SoftTouch de la Loam include 6 piese (2 față, 2 mâini, 2 baie) din bumbac organic 100%, certificate OEKO-TEX. Absorbția ridicată și uscarea rapidă le fac potrivite pentru utilizare zilnică, iar textura moale se păstrează spălare după spălare. Este un set complet pentru o baie organizată, fără cumpărături separate pentru fiecare piesă. Setul SoftTouch face parte din categoria Baie de pe EstelaOferta, cu livrare rapidă.",
    price: 159, compareAtPrice: 219,
    colors: ["white", "sand", "stone"],
    rating: 4.7, reviewCount: 52,
    badges: ["bestseller"],
    features: ["Bumbac organic 100%", "Certificat OEKO-TEX", "6 prosoape incluse", "Absorbție ridicată"],
    stock: 60, seedImg: "bath-1", imgKeyword: "towels,bathroom", freeShipping: true,
  },
  {
    id: "covor-baie-plushstep",
    name: "Covor Baie Antiderapant PlushStep",
    brand: "Norr", brandSlug: "norr",
    category: "Baie", categorySlug: "baie",
    tagline: "Talpă antiderapantă, se usucă rapid.",
    description:
      "Covorul de baie antiderapant PlushStep de la Norr este realizat din microfibră moale, cu talpă din cauciuc care previne alunecarea pe suprafețe umede. Se usucă rapid și poate fi spălat la mașină, ceea ce simplifică întreținerea pe termen lung. Este disponibil în mai multe culori, potrivite pentru orice stil de baie. Covorul PlushStep este disponibil în categoria Baie de pe EstelaOferta.",
    price: 99,
    colors: ["navy", "sand"],
    rating: 4.5, reviewCount: 33,
    badges: ["new"],
    features: ["Talpă antiderapantă", "Microfibră moale", "Lavabil la mașină", "Uscare rapidă"],
    stock: 45, seedImg: "bath-2", imgKeyword: "bath,mat",
  },
  {
    id: "dozator-sapun-purebath",
    name: "Dozator Săpun Lichid din Ceramică PureBath",
    brand: "Auric", brandSlug: "auric",
    category: "Baie", categorySlug: "baie",
    tagline: "Design minimalist din ceramică, pompă din inox.",
    description:
      "Dozatorul de săpun lichid din ceramică PureBath de la Auric are un design minimalist, potrivit pentru băi moderne sau clasice deopotrivă. Pompa din inox rezistă la coroziune, chiar și la utilizare zilnică intensă, iar capacitatea de 400ml reduce nevoia de realimentări frecvente. Este un accesoriu discret care completează orice decor de baie. Dozatorul PureBath face parte din categoria Baie de pe EstelaOferta.",
    price: 69,
    colors: ["white", "black"],
    rating: 4.3, reviewCount: 19,
    badges: [],
    features: ["Ceramică premium", "Pompă din inox", "Capacitate 400ml", "Design minimalist"],
    stock: 70, seedImg: "bath-3", imgKeyword: "soap,dispenser",
  },
  {
    id: "oglinda-led-halo",
    name: "Oglindă Baie cu Iluminare LED Halo",
    brand: "Vantage", brandSlug: "vantage",
    category: "Baie", categorySlug: "baie",
    tagline: "Iluminare LED circulară, anti-aburire.",
    description:
      "Oglinda de baie cu iluminare LED Halo de la Vantage are o formă rotundă și o iluminare circulară reglabilă, ideală pentru machiaj sau bărbierit cu lumină uniformă. Funcția anti-aburire menține suprafața clară chiar și după duș fierbinte, iar montajul pe perete este simplu, cu alimentare printr-un buton tactil. Este o piesă funcțională care aduce și un plus estetic băii. Oglinda LED Halo este disponibilă în categoria Baie de pe EstelaOferta, cu livrare rapidă.",
    price: 449, compareAtPrice: 599,
    colors: ["black"],
    rating: 4.8, reviewCount: 24,
    badges: ["flash-deal"],
    features: ["Iluminare LED reglabilă", "Funcție anti-aburire", "Buton tactil", "Montaj simplu pe perete"],
    stock: 18, seedImg: "bath-4", imgKeyword: "mirror,bathroom", weightGrams: 6200,
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
    categorySlugs: [seed.categorySlug],
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
    reviews: generateSmallReviewSet(seed.id),
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
