import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Accesibilitate",
  description: "Angajamentul EstelaOferta pentru un site accesibil tuturor utilizatorilor.",
};

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accesibilitate" updated="8 iulie 2026">
      <p>
        EstelaOferta se angajează să ofere un site accesibil tuturor utilizatorilor, inclusiv
        persoanelor cu dizabilități, în linie cu recomandările internaționale de accesibilitate
        (WCAG 2.1) și cu Legea nr. 448/2006 privind protecția și promovarea drepturilor
        persoanelor cu handicap.
      </p>

      <h2>1. Ce facem</h2>
      <ul>
        <li>Structură clară de navigare și compatibilitate cu tehnologii asistive (screen readere)</li>
        <li>Contrast de culoare adecvat între text și fundal</li>
        <li>Navigare posibilă de la tastatură pentru elementele interactive</li>
        <li>Texte alternative pentru imagini relevante</li>
      </ul>

      <h2>2. Lucru în desfășurare</h2>
      <p>
        Depunem eforturi continue pentru a îmbunătăți accesibilitatea site-ului. Este posibil ca
        unele secțiuni să nu respecte încă în totalitate standardele de accesibilitate.
      </p>

      <h2>3. Feedback</h2>
      <p>
        Dacă întâmpinați dificultăți în utilizarea site-ului sau aveți sugestii de îmbunătățire a
        accesibilității, vă rugăm să ne contactați prin pagina de{" "}
        <a href="/contact">Contact</a>.
      </p>
    </LegalPage>
  );
}
