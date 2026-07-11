"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { useProductStore } from "@/lib/store/product-store";
import { ProductEditForm } from "@/components/admin/product-edit-form";
import { Button } from "@/components/ui/button";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const products = useProductStore((s) => s.products);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const product = products.find((p) => p.id === id);

  if (!mounted) return null;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
        <FileQuestion className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Produsul nu a fost găsit</h1>
        <Button asChild>
          <Link href="/admin/products">Înapoi la produse</Link>
        </Button>
      </div>
    );
  }

  return <ProductEditForm product={product} />;
}
