# Ghid migrare EstelaOferta → Shopify

## 0. Ce ai deja generat
`scripts/shopify-products-export.csv` — export al celor 44 de produse din
`src/lib/data/products.ts` (nume, descriere, brand, categorie, preț, preț
tăiat, variante culoare/mărime, stoc, SKU, greutate) în formatul standard
"Import products" al Shopify.

⚠️ **Imaginile din CSV sunt placeholder** (poze random de pe Lorem Picsum,
nepotrivite cu produsul). Site-ul actual nu are nicio poză reală de produs în
cod — trebuie să încarci poze reale înainte să faci magazinul public, altfel
riști respingere de la procesatorul de plăți (Shopify Payments verifică
autenticitatea magazinului) și lipsă de încredere din partea clienților.

⚠️ Acest export conține doar produsele "seed" din cod. Dacă ai adăugat/editat
produse din panoul de admin al site-ului actual după deploy, acelea sunt
stocate separat (Netlify Blobs, în producție) și nu apar în acest CSV — spune-mi
dacă vrei și pe alea, trebuie extrase separat din storage-ul live.

## 1. Import produse
1. Shopify Admin → **Products** → **Import**.
2. Încarcă `shopify-products-export.csv`.
3. Bifează "Overwrite products with matching handles" doar dacă rulezi
   reimport (nu la prima încărcare).
4. După import, verifică 2-3 produse cu variante (culoare + mărime) ca să
   confirmi că opțiunile s-au legat corect.

## 2. Înlocuiește imaginile
Pentru fiecare produs (sau în bulk, dacă ai pozele denumite după `slug`):
Product → Media → șterge poza placeholder → încarcă poza reală.

## 3. Recreează categoriile ca Collections
Categoriile din site (`Electrocasnice`, etc.) devin **Collections** automate
în Shopify, filtrate după `Product Category`/`Type`/`Tags` (coloanele din CSV
le-au populat deja) — Shopify → Products → Collections → Create collection →
condiție automată pe `Product type is <categorie>`.

## 4. Configurează checkout-ul
Verifică dacă site-ul actual are ceva ce Shopify nu are din start:
- Plată ramburs (cash on delivery) — la unele produse `cardOnly: true` în
  cod dezactivează ramburs; în Shopify se face din **Settings → Payments →
  Manual payment methods** + reguli per-produs via un app de checkout
  extensions dacă vrei granularitate pe produs.
- Cod promoțional `VARA10` — Discounts → Create discount → cod, tip
  procentual.

## 5. Pixели / tracking (Meta, TikTok)
Codul actual are Meta Pixel + Conversions API și TikTok Pixel montate manual
(`src/lib/meta-capi.ts`). În Shopify:
- Settings → Customer events → Meta Pixel (integrare nativă, recomandat în
  locul celei manuale) sau instalezi din App Store.
- Aceeași logică pentru TikTok Pixel.
- Pentru Conversions API (server-side), ai nevoie de Shopify Plus sau un app
  dedicat (ex. Meta's own Shopify integration acoperă și asta nativ acum).

## 6. Domeniul estelaoferta.ro
Domeniul e la NS1 (`dns1-4.p05.nsone.net`) — deci probabil administrat prin
registrarul tău (nu prin Netlify DNS).
1. Shopify Admin → **Settings → Domains → Connect existing domain** →
   introdu `estelaoferta.ro`.
2. Shopify îți dă un CNAME (pt. `www`) și o adresă A pentru apex — le adaugi
   la providerul de DNS unde ai nameserverele NS1.
3. **Nu opri Netlify înainte să confirmi propagarea DNS** — schimbă DNS-ul,
   așteaptă propagare (câteva ore, TTL-dependent), verifică
   `https://www.estelaoferta.ro` servește din Shopify (`curl -I` → header
   `Server` devine Shopify), abia apoi dezactivezi site-ul Netlify.
4. Redirect 301 de la vechiul apex la `www` (sau invers) — Shopify face asta
   automat la conectare.

## 7. Ce rămâne pe vechiul site până la tăiere completă
- Comenzile plasate deja (`src/lib/data/orders.ts` / Postgres) — exportă-le
  separat dacă ai nevoie de istoric în noul sistem (Shopify nu le importă
  automat, nu sunt produse).
- Recenziile per produs (`reviews` din fiecare `Product`) — nu sunt în CSV-ul
  standard de import; se adaugă printr-un app de reviews (Judge.me, Loox etc.)
  manual sau prin CSV-ul lor propriu.

## Ordinea recomandată
1. Import CSV produse → 2. Poze reale → 3. Collections → 4. Checkout/promo →
5. Pixeli → 6. Testează magazinul pe `xxxx.myshopify.com` → 7. Abia atunci
schimbi DNS-ul domeniului.
