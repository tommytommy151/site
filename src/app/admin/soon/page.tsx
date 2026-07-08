"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Wrench } from "lucide-react";

function SoonContent() {
  const searchParams = useSearchParams();
  const label = searchParams.get("label") ?? "Această secțiune";

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-indigo-soft">
        <Wrench className="size-6 text-brand-indigo" />
      </span>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Această secțiune este în dezvoltare și va fi disponibilă într-o versiune viitoare.
        </p>
      </div>
    </div>
  );
}

export default function AdminComingSoonPage() {
  return (
    <Suspense fallback={null}>
      <SoonContent />
    </Suspense>
  );
}
