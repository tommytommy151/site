import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Cum colectează, folosește și protejează EstelaOferta datele cu caracter personal, conform GDPR.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Politica de confidențialitate" updated="8 iulie 2026">
      <p>
        EstelaOferta Commerce SRL (&ldquo;noi&rdquo;) prelucrează datele dumneavoastră cu caracter
        personal cu respectarea Regulamentului (UE) 2016/679 (GDPR) și a legislației naționale
        aplicabile.
      </p>

      <h2>1. Ce date colectăm</h2>
      <ul>
        <li>Date de identificare: nume, prenume, adresă de e-mail, telefon</li>
        <li>Date de livrare și facturare: adresă, informații de contact</li>
        <li>Date despre comenzi și istoricul cumpărăturilor</li>
        <li>Date tehnice: adresă IP, tip dispozitiv, cookie-uri (vezi Politica de cookie-uri)</li>
      </ul>

      <h2>2. Scopul prelucrării</h2>
      <p>
        Datele sunt folosite pentru procesarea comenzilor, livrare, facturare, comunicare cu
        clienții, suport, prevenirea fraudei și, cu acordul dumneavoastră, în scopuri de marketing.
      </p>

      <h2>3. Temeiul legal</h2>
      <p>
        Prelucrarea se bazează pe executarea contractului (comenzi), obligații legale
        (facturare, contabilitate), interesul legitim (securitate, prevenirea fraudei) și
        consimțământ (newsletter, marketing).
      </p>

      <h2>4. Durata stocării</h2>
      <p>
        Datele sunt păstrate pe durata necesară îndeplinirii scopurilor de mai sus și, ulterior,
        conform obligațiilor legale de arhivare (de exemplu, documente financiar-contabile timp
        de 10 ani).
      </p>

      <h2>5. Drepturile dumneavoastră</h2>
      <p>Conform GDPR, aveți dreptul la:</p>
      <ul>
        <li>Acces la datele personale prelucrate</li>
        <li>Rectificarea datelor incorecte sau incomplete</li>
        <li>Ștergerea datelor (&ldquo;dreptul de a fi uitat&rdquo;)</li>
        <li>Restricționarea sau opoziția față de prelucrare</li>
        <li>Portabilitatea datelor</li>
        <li>Retragerea consimțământului, în orice moment, pentru prelucrările bazate pe acesta</li>
      </ul>
      <p>
        Aceste drepturi pot fi exercitate prin pagina de <a href="/contact">Contact</a>. Aveți
        totodată dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a
        Prelucrării Datelor cu Caracter Personal (ANSPDCP).
      </p>

      <h2>6. Partajarea datelor</h2>
      <p>
        Datele pot fi partajate cu curieri, procesatori de plăți și furnizori de servicii IT,
        exclusiv în scopul îndeplinirii comenzilor, în baza unor acorduri de confidențialitate.
        Nu vindem datele dumneavoastră către terți.
      </p>

      <h2>7. Securitate</h2>
      <p>
        Aplicăm măsuri tehnice și organizatorice rezonabile pentru protejarea datelor împotriva
        accesului neautorizat, pierderii sau distrugerii.
      </p>

      <p className="text-xs text-muted-foreground">
        Acest text este un model general și nu constituie consultanță juridică. Recomandăm
        adaptarea lui de către un specialist în protecția datelor, cu detaliile reale ale
        companiei și ale prelucrărilor efectuate.
      </p>
    </LegalPage>
  );
}
