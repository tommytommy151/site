import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Politica de retur",
  description:
    "Dreptul de retragere din contract în 14 zile și procedura de retur, conform legislației din România.",
};

export default function ReturnsPage() {
  return (
    <LegalPage title="Politica de retur" updated="8 iulie 2026">
      <p>
        Conform Ordonanței de Urgență a Guvernului nr. 34/2014 privind drepturile
        consumatorilor în cadrul contractelor la distanță, aveți dreptul de a vă retrage din
        contract, fără penalizări și fără a fi nevoit să justificați decizia.
      </p>

      <h2>1. Termenul de retragere</h2>
      <p>
        Aveți la dispoziție <strong>14 zile calendaristice</strong> de la data primirii
        produsului (sau a ultimului produs, în cazul unei comenzi cu mai multe colete) pentru a vă
        exercita dreptul de retragere.
      </p>

      <h2>2. Cum vă exercitați dreptul de retragere</h2>
      <p>
        Ne puteți notifica decizia de retragere printr-o declarație neechivocă, transmisă prin
        pagina de <a href="/contact">Contact</a> sau prin secțiunea{" "}
        <a href="/account/orders">Comenzile mele</a> din contul dumneavoastră.
      </p>

      <h2>3. Returnarea produselor</h2>
      <p>
        Produsele trebuie returnate în cel mult 14 zile de la comunicarea deciziei de retragere,
        în starea în care au fost primite, cu toate accesoriile și, pe cât posibil, în ambalajul
        original.
      </p>

      <h2>4. Costul returului</h2>
      <p>
        Costul direct al returnării produselor este suportat de client, cu excepția cazului în
        care produsul este defect sau livrarea a fost eronată, situație în care costul este
        suportat de Vânzător.
      </p>

      <h2>5. Rambursarea</h2>
      <p>
        Vânzătorul va rambursa toate sumele primite, inclusiv costurile standard de livrare, în
        cel mult 14 zile de la data la care este informat despre decizia de retragere, folosind
        aceeași modalitate de plată utilizată la comandă, cu excepția cazului în care s-a convenit
        altfel.
      </p>

      <h2>6. Excepții de la dreptul de retragere</h2>
      <p>Dreptul de retragere nu se aplică, printre altele, pentru:</p>
      <ul>
        <li>Produse personalizate sau realizate după specificațiile consumatorului</li>
        <li>
          Produse sigilate care nu pot fi returnate din motive de protecție a sănătății sau de
          igienă și care au fost desigilate după livrare
        </li>
        <li>Conținut digital furnizat imediat, cu acordul expres al consumatorului</li>
      </ul>

      <h2>7. Produse defecte sau neconforme</h2>
      <p>
        Dacă produsul primit este defect sau nu corespunde comenzii, aveți dreptul la înlocuire,
        reducere de preț sau rezoluțiunea contractului, conform Legii nr. 449/2003 privind
        vânzarea produselor și garanțiile asociate acestora, indiferent de termenul de 14 zile de
        mai sus.
      </p>

      <p className="text-xs text-muted-foreground">
        Acest text este un model general și nu constituie consultanță juridică. Recomandăm
        adaptarea lui de către un avocat, cu datele reale ale companiei.
      </p>
    </LegalPage>
  );
}
