"use client";

import { useState } from "react";
import { Bell, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminPushNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("/deals");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Trimiterea a eșuat.");
        return;
      }
      setResult(data);
    } catch {
      setError("Nu am putut contacta serverul.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notificări Push</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trimite o notificare tuturor vizitatorilor care s-au abonat pe site.
        </p>
      </div>

      <form onSubmit={handleSend} className="flex max-w-lg flex-col gap-4">
        <div>
          <Label htmlFor="push-title" className="mb-1.5">
            Titlu
          </Label>
          <Input
            id="push-title"
            required
            maxLength={60}
            placeholder="Reducere nouă -50%!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="push-message" className="mb-1.5">
            Mesaj
          </Label>
          <Textarea
            id="push-message"
            required
            maxLength={180}
            placeholder="Nu rata ofertele de weekend, stoc limitat."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="push-url" className="mb-1.5">
            Link (opțional)
          </Label>
          <Input
            id="push-url"
            placeholder="/deals"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={sending}>
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Trimite notificarea
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm">
            <Bell className="size-4 text-brand-emerald" />
            <span>
              Trimis către {result.sent} din {result.total} abonați
              {result.failed > 0 ? ` (${result.failed} eșuate/expirate, eliminate)` : ""}.
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
