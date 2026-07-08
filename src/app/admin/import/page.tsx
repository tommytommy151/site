"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { useProductStore } from "@/lib/store/product-store";
import { slugify } from "@/lib/store/catalog-store";
import { Button } from "@/components/ui/button";

interface ParsedRow {
  name: string;
  price: number;
  stock: number;
}

function parseCsv(text: string): ParsedRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length === 0) return [];

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const nameIdx = header.indexOf("name");
  const priceIdx = header.indexOf("price");
  const stockIdx = header.indexOf("stock");

  const dataLines = nameIdx === -1 && priceIdx === -1 && stockIdx === -1 ? lines : lines.slice(1);
  const useIdx = nameIdx === -1 && priceIdx === -1 && stockIdx === -1
    ? { name: 0, price: 1, stock: 2 }
    : { name: nameIdx, price: priceIdx, stock: stockIdx };

  return dataLines
    .map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      const name = cols[useIdx.name] ?? "";
      const price = Number(cols[useIdx.price] ?? 0) || 0;
      const stock = Number(cols[useIdx.stock] ?? 0) || 0;
      return { name, price, stock };
    })
    .filter((row) => row.name.length > 0);
}

export default function AdminImportPage() {
  const addProduct = useProductStore((s) => s.addProduct);

  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [imported, setImported] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImported(false);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setRows(parseCsv(text));
    };
    reader.readAsText(file);
  }

  function handleImport() {
    for (const row of rows) {
      addProduct({
        name: row.name,
        slug: slugify(row.name),
        brand: "Fără brand",
        brandSlug: "fara-brand",
        category: "Necategorizat",
        categorySlug: "necategorizat",
        price: row.price,
        stock: row.stock,
        image: "",
        description: "",
        badges: [],
      });
    }
    setImported(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import produse</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Încarcă un fișier CSV cu coloanele <code className="rounded bg-muted px-1 py-0.5">name</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">price</code> și{" "}
          <code className="rounded bg-muted px-1 py-0.5">stock</code> pentru a adăuga rapid mai multe
          produse în catalog.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-card p-6">
        <label className="flex flex-col items-center gap-2 text-center">
          <Upload className="size-6 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {fileName ?? "Alege un fișier CSV"}
          </span>
          <span className="text-xs text-muted-foreground">
            ex. name,price,stock
          </span>
          <input type="file" accept=".csv" onChange={handleFileChange} className="mt-2 text-sm" />
        </label>
      </div>

      {rows.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Nume</th>
                  <th className="px-4 py-3 font-medium">Preț</th>
                  <th className="px-4 py-3 font-medium">Stoc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-foreground">{row.name}</td>
                    <td className="px-4 py-3 text-foreground">{row.price} lei</td>
                    <td className="px-4 py-3 text-foreground">{row.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleImport}>Importă {rows.length} produse</Button>
            {imported && (
              <span className="text-sm text-muted-foreground">
                Produsele au fost adăugate în catalog.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
