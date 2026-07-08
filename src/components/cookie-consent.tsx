"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useCookieConsentStore } from "@/lib/store/cookie-consent-store";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const status = useCookieConsentStore((s) => s.status);
  const acceptAll = useCookieConsentStore((s) => s.acceptAll);
  const rejectAll = useCookieConsentStore((s) => s.rejectAll);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || status !== "pending") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="glass mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border p-5 shadow-xl sm:flex-row sm:items-center">
        <Cookie className="hidden size-8 shrink-0 text-brand-emerald sm:block" />
        <div className="flex-1 text-sm text-foreground/90">
          <p className="font-medium text-foreground">Folosim cookie-uri</p>
          <p className="mt-1 text-muted-foreground">
            Le folosim pentru a asigura funcționarea site-ului și, cu acordul tău, pentru analiză
            și marketing. Detalii în{" "}
            <Link href="/cookies" className="text-brand-emerald underline underline-offset-2">
              Politica de cookie-uri
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" onClick={rejectAll}>
            Doar necesare
          </Button>
          <Button onClick={acceptAll}>Accept toate</Button>
        </div>
      </div>
    </div>
  );
}
