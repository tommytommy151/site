"use client";

import { useState } from "react";
import Image from "next/image";
import { Link2, Loader2, Upload } from "lucide-react";
import { useProductStore } from "@/lib/store/product-store";
import { useCatalogStore, slugify } from "@/lib/store/catalog-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface ScrapedProduct {
  name: string;
  description: string;
  images: string[];
  tags: string[];
  price: number | null;
  currency: string | null;
  sourceUrl: string;
}

function UrlImportSection() {
  const addProduct = useProductStore((s) => s.addProduct);
  const categories = useCatalogStore((s) => s.categories);
  const brands = useCatalogStore((s) => s.brands);

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scraped, setScraped] = useState<ScrapedProduct | null>(null);
  const [added, setAdded] = useState(false);

  const [brandSlug, setBrandSlug] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [stock, setStock] = useState(20);

  async function handleFetch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScraped(null);
    setAdded(false);
    try {
      const res = await fetch("/api/admin/scrape-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Nu am putut importa produsul.");
        return;
      }
      setScraped(data as ScrapedProduct);
    } catch {
      setError("Nu am putut accesa adresa URL furnizată.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    if (!scraped) return;
    const brand = brands.find((b) => b.slug === brandSlug);
    const category = categories.find((c) => c.slug === categorySlug);
    addProduct({
      name: scraped.name,
      slug: slugify(scraped.name),
      brand: brand?.name ?? "Fără brand",
      brandSlug: brand?.slug ?? "fara-brand",
      category: category?.name ?? "Necategorizat",
      categorySlug: category?.slug ?? "necategorizat",
      price: scraped.price ?? 0,
      stock,
      image: scraped.images[0] ?? "",
      images: scraped.images,
      description: scraped.description,
      badges: ["new"],
      tags: scraped.tags,
    });
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Import de pe un alt site</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lipește adresa unei pagini de produs. Citim titlul, descrierea, imaginea și prețul
          (din datele Open Graph / schema.org ale paginii) și le pregătim pentru catalog.
        </p>
      </div>

      <form onSubmit={handleFetch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="url"
            required
            placeholder="https://alt-site.ro/produs/exemplu"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Preia produsul"}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {scraped && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row">
          <div className="flex shrink-0 flex-col gap-2 sm:w-40">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
              {scraped.images[0] ? (
                <Image
                  src={scraped.images[0]}
                  alt={scraped.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  Fără imagine
                </div>
              )}
            </div>
            {scraped.images.length > 1 && (
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-3">
                {scraped.images.slice(1).map((src) => (
                  <div
                    key={src}
                    className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                  >
                    <Image src={src} alt="" fill sizes="60px" className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {scraped.images.length} {scraped.images.length === 1 ? "imagine găsită" : "imagini găsite"}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div>
              <p className="font-medium text-foreground">{scraped.name}</p>
              {scraped.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {scraped.description}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Preț detectat:{" "}
                {scraped.price !== null
                  ? `${scraped.price} ${scraped.currency ?? "RON"}`
                  : "nedetectat — completează manual la editare"}
              </p>
              {scraped.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {scraped.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground/85"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <Label className="mb-1.5">Brand</Label>
                <Select value={brandSlug} onValueChange={setBrandSlug}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Alege brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.slug}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5">Categorie</Label>
                <Select value={categorySlug} onValueChange={setCategorySlug}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Alege categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="import-stock" className="mb-1.5">
                  Stoc inițial
                </Label>
                <Input
                  id="import-stock"
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleAdd}>Adaugă în catalog</Button>
              {added && (
                <span className="text-sm text-muted-foreground">
                  Produsul a fost adăugat. Îl poți edita din Produse.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CsvImportSection() {
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
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Import din CSV</h2>
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

export default function AdminImportPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import produse</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Adaugă produse rapid, fie dintr-o pagină de pe alt site, fie dintr-un fișier CSV.
        </p>
      </div>

      <UrlImportSection />

      <div className="border-t border-border pt-8">
        <CsvImportSection />
      </div>
    </div>
  );
}
