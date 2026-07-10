"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "estelaoferta-push-dismissed";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function PushSubscribePrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    if (Notification.permission !== "default") return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  async function handleEnable() {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setVisible(false);
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
    } finally {
      setLoading(false);
      setVisible(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-emerald/10 text-brand-emerald">
        <Bell className="size-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Activează notificările</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Află primul despre reduceri și oferte noi.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={handleEnable} disabled={loading}>
            Activează
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            Nu acum
          </Button>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Închide"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
