"use client";

import { Download, Trash2 } from "lucide-react";
import { useNewsletterStore } from "@/lib/store/newsletter-store";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function AdminNewsletterPage() {
  const subscribers = useNewsletterStore((s) => s.subscribers);
  const removeSubscriber = useNewsletterStore((s) => s.removeSubscriber);

  function exportCsv() {
    const rows = ["email,data abonare", ...subscribers.map((s) => `${s.email},${s.subscribedAt}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "abonati-newsletter.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Buletin informativ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {subscribers.length} abonați prin formularul de pe homepage.
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={subscribers.length === 0}>
          <Download className="size-4" />
          Exportă CSV
        </Button>
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Niciun abonat încă. Formularul de newsletter de pe homepage va popula această listă.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Abonat la</th>
                <th className="p-4 text-right font-medium">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="p-4 font-medium text-foreground">{s.email}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(s.subscribedAt)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => removeSubscriber(s.id)}
                        aria-label="Șterge"
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
