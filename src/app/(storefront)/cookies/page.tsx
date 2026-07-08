import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Politica de cookie-uri",
  description: "Ce cookie-uri folosește EstelaOferta și cum le puteți gestiona.",
};

export default function CookiesPage() {
  return (
    <LegalPage title="Politica de cookie-uri" updated="8 iulie 2026">
      <p>
        Această politică explică ce sunt cookie-urile, ce tipuri folosim pe site-ul EstelaOferta
        și cum le puteți controla, în conformitate cu Legea nr. 506/2004 privind prelucrarea
        datelor cu caracter personal în sectorul comunicațiilor electronice.
      </p>

      <h2>1. Ce sunt cookie-urile</h2>
      <p>
        Cookie-urile sunt fișiere text de mici dimensiuni, stocate în browserul dumneavoastră, care
        permit site-ului să rețină preferințele și acțiunile pe o perioadă de timp.
      </p>

      <h2>2. Ce cookie-uri folosim</h2>
      <ul>
        <li>
          <strong>Necesare</strong> — asigură funcționarea de bază a site-ului: coș de cumpărături,
          autentificare, preferințe de temă. Nu pot fi dezactivate.
        </li>
        <li>
          <strong>Analitice</strong> — ne ajută să înțelegem cum este folosit site-ul, pentru a-l
          îmbunătăți.
        </li>
        <li>
          <strong>De marketing</strong> — folosite pentru a afișa oferte relevante, doar cu
          consimțământul dumneavoastră.
        </li>
      </ul>

      <h2>3. Cum vă gestionați preferințele</h2>
      <p>
        Puteți accepta, respinge sau modifica preferințele legate de cookie-uri din setările
        browserului dumneavoastră sau din bannerul de cookie-uri afișat la prima vizită. Blocarea
        cookie-urilor necesare poate afecta funcționarea site-ului (de exemplu, coșul de
        cumpărături).
      </p>

      <h2>4. Cookie-uri terțe</h2>
      <p>
        Unii furnizori de servicii (procesatori de plăți, instrumente de analiză) pot plasa
        propriile cookie-uri atunci când interacționați cu funcționalitățile lor pe site.
      </p>

      <p className="text-xs text-muted-foreground">
        Acest text este un model general și nu constituie consultanță juridică. Recomandăm
        adaptarea lui în funcție de cookie-urile efectiv folosite pe site.
      </p>
    </LegalPage>
  );
}
