"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useSiteStore } from "@/lib/store/site-store";
import { DEFAULT_HOME_SECTIONS } from "@/lib/data/site-defaults";

export function HomeSections({ sections }: { sections: Record<string, ReactNode> }) {
  const homeSections = useSiteStore((s) => s.homeSections);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const order = mounted ? homeSections : DEFAULT_HOME_SECTIONS;

  return (
    <>
      {order
        .filter((s) => s.visible)
        .map((s) => <div key={s.id}>{sections[s.id]}</div>)}
    </>
  );
}
