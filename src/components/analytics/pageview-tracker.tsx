"use client";

import { useEffect } from "react";

const SESSION_FLAG = "estelaoferta-visit-tracked";

export function PageviewTracker() {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    sessionStorage.setItem(SESSION_FLAG, "1");
    fetch("/api/track/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referrer: document.referrer || null }),
    }).catch(() => {});
  }, []);

  return null;
}
