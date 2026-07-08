"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSiteStore } from "@/lib/store/site-store";

export function SiteLogo({ className }: { className?: string }) {
  const settings = useSiteStore((s) => s.settings);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const logoText = mounted ? settings.logoText : "EstelaOferta";
  const logoImageUrl = mounted ? settings.logoImageUrl : null;

  return (
    <Link href="/" className={className ?? "flex shrink-0 items-center gap-2"}>
      {logoImageUrl ? (
        <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
          <Image src={logoImageUrl} alt={logoText} fill className="object-cover" unoptimized />
        </span>
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-emerald to-brand-indigo">
          <span className="size-2.5 rounded-full bg-white" />
        </span>
      )}
      <span className="font-heading text-lg font-semibold tracking-tight">{logoText}</span>
    </Link>
  );
}
