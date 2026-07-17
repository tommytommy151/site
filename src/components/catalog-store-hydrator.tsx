"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/lib/store/catalog-store";

export function CatalogStoreHydrator() {
  const mergeServerCatalog = useCatalogStore((s) => s.mergeServerCatalog);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) mergeServerCatalog(data);
      })
      .catch(() => {});
  }, [mergeServerCatalog]);

  return null;
}
