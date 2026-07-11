"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, Check, Loader2, Upload } from "lucide-react";
import { useProductStore } from "@/lib/store/product-store";
import { useCatalogStore, slugify } from "@/lib/store/catalog-store";
import type { ProductBadge } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/admin/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BADGE_LABELS: Record<ProductBadge, string> = {
  new: "Nou",
  bestseller: "Cel mai vândut",
  "flash-deal": "Reducere",
  "sold-out": "Stoc epuizat",
  limited: "Ediție limitată",
};

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

interface BatchItem {
  url: string;
  status: "pending" | "loading" | "done" | "error";
  data: ScrapedProduct | null;
  error: string | null;
  price: number;
  stock: number;
  brandSlug: string;
  categorySlug: string;
  badges: ProductBadge[];
  tags: string[];
  include: boolean;
}

async function runWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
  let index = 0;
  async function run() {
    while (index < items.length) {
      const item = items[index++];
      await worker(item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
}

function UrlImportSection() {
  const addProduct = useProductStore((s) => s.addProduct);
  const categories = useCatalogStore((s) => s.categories);
  const brands = useCatalogStore((s) => s.brands);

  const [urlsText, setUrlsText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [batch, setBatch] = useState<BatchItem[]>([]);
  const [addedCount, setAddedCount] = useState<number | null>(null);

  const [brandSlug, setBrandSlug] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  const doneCount = batch.filter((b) => b.status === "done").length;
  const includedCount = batch.filter((b) => b.status === "done" && b.include).length;
  const allFetched = batch.length > 0 && batch.every((b) => b.status === "done" || b.status === "error");

  function updateItem(url: string, patch: Partial<BatchItem>) {
    setBatch((prev) => prev.map((it) => (it.url === url ? { ...it, ...patch } : it)));
  }

  async function handleFetchAll(e: React.FormEvent) {
    e.preventDefault();
    const urls = [...new Set(urlsText.split(/\r?\n/).map((u) => u.trim()).filter(Boolean))];
    if (!urls.length) return;

    setFetching(true);
    setAddedCount(null);
    setBatch(
      urls.map((url) => ({
        url,
        status: "pending",
        data: null,
        error: null,
        price: 0,
        stock: 20,
        brandSlug: "",
        categorySlug: "",
        badges: ["new"],
        tags: [],
        include: true,
      })),
    );

    await runWithConcurrency(urls, 3, async (url) => {
      updateItem(url, { status: "loading" });
      try {
        const res = await fetch("/api/admin/scrape-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (!res.ok) {
          updateItem(url, { status: "error", error: data.error ?? "Import eșuat." });
          return;
        }
        const scraped = data as ScrapedProduct;
        updateItem(url, {
          status: "done",
          data: scraped,
          price: scraped.price ?? 0,
          tags: scraped.tags,
        });
      } catch {
        updateItem(url, { status: "error", error: "Nu am putut accesa adresa URL." });
      }
    });

    setFetching(false);
  }

  function applyDefaultsToAll() {
    setBatch((prev) => prev.map((it) => ({ ...it, brandSlug, categorySlug })));
  }

  function toggleItemBadge(url: string, badge: ProductBadge) {
    setBatch((prev) =>
      prev.map((it) =>
        it.url === url
          ? {
              ...it,
              badges: it.badges.includes(badge)
                ? it.badges.filter((b) => b !== badge)
                : [...it.badges, badge],
            }
          : it,
      ),
    );
  }

  function handleAddAll() {
    let count = 0;
    for (const item of batch) {
      if (!item.include || item.status !== "done" || !item.data) continue;
      const brand = brands.find((b) => b.slug === item.brandSlug);
      const category = categories.find((c) => c.slug === item.categorySlug);
      addProduct({
        name: item.data.name,
        slug: slugify(item.data.name),
        brand: brand?.name ?? "Fără brand",
        brandSlug: brand?.slug ?? "fara-brand",
        category: category?.name ?? "Necategorizat",
        categorySlug: category?.slug ?? "necategorizat",
        price: item.price,
        stock: item.stock,
        image: item.data.images[0] ?? "",
        images: item.data.images,
        description: item.data.description,
        badges: item.badges,
        tags: item.tags,
      });
      count++;
    }
    setAddedCount(count);
    setBatch((prev) => prev.filter((it) => !(it.include && it.status === "done")));
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Import de pe un alt site</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lipește una sau mai multe adrese de pagini de produs, câte una pe linie. Citim titlul,
          descrierea (rescrisă automat SEO), imaginile și prețul pentru fiecare și le pregătim
          pentru catalog.
        </p>
      </div>

      <form onSubmit={handleFetchAll} className="flex flex-col gap-2">
        <Textarea
          required
          placeholder={"https://alt-site.ro/produs/exemplu-1\nhttps://alt-site.ro/produs/exemplu-2\nhttps://alt-site.ro/produs/exemplu-3"}
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          className="min-h-28 font-mono text-sm"
        />
        <Button type="submit" disabled={fetching} className="self-start">
          {fetching ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Se preiau produsele...
            </>
          ) : (
            "Preia produsele"
          )}
        </Button>
      </form>

      {batch.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border p-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Label className="mb-1.5">Brand implicit</Label>
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
            <div className="flex-1">
              <Label className="mb-1.5">Categorie implicită</Label>
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
            <Button
              type="button"
              variant="outline"
              onClick={applyDefaultsToAll}
              disabled={!brandSlug && !categorySlug}
            >
              Aplică tuturor
            </Button>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {batch.map((item) => (
              <div key={item.url} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.data?.images[0] ? (
                      <Image
                        src={item.data.images[0]}
                        alt={item.data.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        {item.status === "loading" || item.status === "pending" ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        ) : (
                          <AlertCircle className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.data?.name ?? item.url}
                    </p>
                    {item.status === "loading" && (
                      <p className="text-xs text-muted-foreground">Se preiau datele...</p>
                    )}
                    {item.status === "error" && (
                      <p className="text-xs text-destructive">{item.error}</p>
                    )}
                    {item.status === "done" && item.data && (
                      <p className="text-xs text-muted-foreground">
                        {item.data.images.length}{" "}
                        {item.data.images.length === 1 ? "imagine" : "imagini"}
                      </p>
                    )}
                  </div>

                  {item.status === "done" && (
                    <div className="flex shrink-0 items-start gap-2">
                      <label className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">Preț</span>
                        <Input
                          type="number"
                          min={0}
                          value={item.price}
                          onChange={(e) =>
                            updateItem(item.url, { price: Number(e.target.value) || 0 })
                          }
                          className="h-8 w-24"
                        />
                      </label>
                      <label className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">Stoc</span>
                        <Input
                          type="number"
                          min={0}
                          value={item.stock}
                          onChange={(e) =>
                            updateItem(item.url, { stock: Number(e.target.value) || 0 })
                          }
                          className="h-8 w-20"
                        />
                      </label>
                      <Checkbox
                        checked={item.include}
                        onCheckedChange={(v) => updateItem(item.url, { include: Boolean(v) })}
                      />
                    </div>
                  )}
                  {item.status === "loading" && (
                    <Loader2 className="size-4 shrink-0 animate-spin self-center text-muted-foreground" />
                  )}
                </div>

                {item.status === "done" && item.data && (
                  <div className="flex flex-col gap-3 rounded-xl bg-muted/40 p-3 sm:pl-[76px]">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="mb-1.5 text-xs">Brand</Label>
                        <Select
                          value={item.brandSlug}
                          onValueChange={(v) => updateItem(item.url, { brandSlug: v })}
                        >
                          <SelectTrigger className="h-8 w-full text-xs">
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
                        <Label className="mb-1.5 text-xs">Categorie</Label>
                        <Select
                          value={item.categorySlug}
                          onValueChange={(v) => updateItem(item.url, { categorySlug: v })}
                        >
                          <SelectTrigger className="h-8 w-full text-xs">
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
                    </div>

                    <div>
                      <Label className="mb-1.5 text-xs">Repere</Label>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {(Object.keys(BADGE_LABELS) as ProductBadge[]).map((badge) => (
                          <label key={badge} className="flex items-center gap-1.5 text-xs">
                            <Checkbox
                              checked={item.badges.includes(badge)}
                              onCheckedChange={() => toggleItemBadge(item.url, badge)}
                            />
                            <span className="text-foreground/85">{BADGE_LABELS[badge]}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-1.5 text-xs">Etichete</Label>
                      <TagInput
                        value={item.tags}
                        onChange={(tags) => updateItem(item.url, { tags })}
                        placeholder="Scrie o etichetă și apasă Enter"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {allFetched && (
            <div className="flex items-center gap-3 border-t border-border pt-4">
              <Button onClick={handleAddAll} disabled={includedCount === 0}>
                <Check className="size-4" />
                Adaugă {includedCount} {includedCount === 1 ? "produs" : "produse"} în catalog
              </Button>
              <span className="text-sm text-muted-foreground">
                {doneCount} din {batch.length} preluate cu succes
              </span>
            </div>
          )}

          {addedCount !== null && (
            <p className="text-sm text-muted-foreground">
              {addedCount} {addedCount === 1 ? "produs a fost adăugat" : "produse au fost adăugate"}{" "}
              în catalog. Le poți edita din Produse.
            </p>
          )}
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
