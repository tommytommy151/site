import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description:
    "Termenii și condițiile de utilizare a magazinului online EstelaOferta și de achiziționare a produselor.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Termeni și condiții" updated="8 iulie 2026">
      <p>
        Acești termeni și condiții reglementează utilizarea site-ului EstelaOferta și achiziția
        produselor comercializate prin intermediul acestuia. Prin plasarea unei comenzi sau prin
        simpla navigare pe site, sunteți de acord cu prevederile de mai jos.
      </p>

      <h2>1. Date de identificare</h2>
      <p>
        Operator: EstelaOferta Commerce SRL, cu sediul în România, înregistrată la Registrul
        Comerțului sub nr. [J00/000/2026], CUI [RO00000000] (&ldquo;Vânzătorul&rdquo;). Datele
        complete de contact sunt disponibile în pagina de{" "}
        <a href="/contact">Contact</a>.
      </p>

      <h2>2. Obiectul contractului</h2>
      <p>
        Vânzătorul comercializează produse prin intermediul site-ului, iar Cumpărătorul are
        posibilitatea de a plasa comenzi online, cu respectarea condițiilor de mai jos. Contractul
        se consideră încheiat în momentul confirmării comenzii de către Vânzător, prin e-mail sau
        prin contul de client.
      </p>

      <h2>3. Prețuri și modalități de plată</h2>
      <p>
        Toate prețurile afișate sunt exprimate în lei (RON) și includ TVA, conform legislației în
        vigoare. Plata se poate efectua online, cu cardul, sau ramburs la livrare, în funcție de
        opțiunile disponibile la finalizarea comenzii.
      </p>

      <h2>4. Livrarea</h2>
      <p>
        Termenele de livrare sunt orientative și sunt comunicate la momentul plasării comenzii.
        Vânzătorul nu răspunde pentru întârzieri cauzate de curier sau de evenimente independente
        de voința sa (forță majoră).
      </p>

      <h2>5. Dreptul de retragere</h2>
      <p>
        Conform Ordonanței de Urgență nr. 34/2014, aveți dreptul de a vă retrage din contract în
        termen de 14 zile calendaristice, fără a fi nevoie să justificați decizia. Detalii complete
        se regăsesc în <a href="/returns">Politica de retur</a>.
      </p>

      <h2>6. Garanții și reclamații</h2>
      <p>
        Produsele beneficiază de garanțiile legale prevăzute de Legea nr. 449/2003 și Ordonanța
        Guvernului nr. 21/1992 privind protecția consumatorilor. Reclamațiile pot fi transmise prin
        pagina de <a href="/contact">Contact</a> sau direct către{" "}
        <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer">
          ANPC
        </a>
        .
      </p>

      <h2>7. Soluționarea litigiilor</h2>
      <p>
        În cazul unui litigiu, consumatorii pot apela la platforma europeană de soluționare online
        a litigiilor (SOL), disponibilă la{" "}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          ec.europa.eu/consumers/odr
        </a>
        , sau se pot adresa Autorității Naționale pentru Protecția Consumatorilor (ANPC).
      </p>

      <h2>8. Legea aplicabilă</h2>
      <p>
        Acești termeni sunt guvernați de legislația română. Orice litigiu se supune instanțelor
        competente din România, cu excepția cazurilor în care legea prevede altfel în favoarea
        consumatorului.
      </p>

      <p className="text-xs text-muted-foreground">
        Acest text este un model general și nu constituie consultanță juridică. Recomandăm
        adaptarea lui de către un avocat, cu datele reale ale companiei.
      </p>
    </LegalPage>
  );
}
