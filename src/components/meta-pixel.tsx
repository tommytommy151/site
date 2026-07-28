"use client";

import Script from "next/script";
import { useCookieConsentStore } from "@/lib/store/cookie-consent-store";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1921102271842119";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Fires the same logical event twice — once client-side via the Pixel, once
// server-side via the Conversions API (/api/meta/capi) — sharing one event_id
// so Meta dedupes the pair into a single counted event. The CAPI leg also
// covers browsers where connect.facebook.net is blocked by an ad blocker.
// Pass eventId explicitly for events that must stay stable across remounts
// (e.g. the order id for Purchase); otherwise one is generated per call.
export function trackMetaEvent(
  name: string,
  params?: Record<string, unknown>,
  eventId?: string,
  userData?: { email?: string; phone?: string },
) {
  if (useCookieConsentStore.getState().status !== "accepted") return;
  if (typeof window === "undefined") return;
  const id = eventId ?? crypto.randomUUID();

  if (window.fbq) {
    window.fbq("track", name, params, { eventID: id });
  }

  fetch("/api/meta/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventName: name,
      eventId: id,
      eventSourceUrl: window.location.href,
      customData: params,
      userData,
    }),
  }).catch(() => {});
}

export function MetaPixel() {
  const status = useCookieConsentStore((s) => s.status);

  if (status !== "accepted") return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
