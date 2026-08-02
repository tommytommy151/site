"use client";

import { Suspense, useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useCookieConsentStore } from "@/lib/store/cookie-consent-store";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1389718926685322";

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

// The boot script below fires the first PageView once `fbq` loads, for
// whatever page is active at that moment. The App Router never reloads the
// document on `<Link>` navigation, so without this, every page after the
// first would go untracked. This tracks each subsequent route change exactly
// once: the first effect run just records the page already covered by the
// boot script's PageView, and later runs only fire when the URL actually
// changed since the last one tracked (guards against React re-renders and
// Strict Mode's double effect invocation in dev causing a duplicate fire).
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    if (lastTrackedUrl.current === null) {
      // Covered by the boot script's initial `fbq('track', 'PageView')`.
      lastTrackedUrl.current = url;
      return;
    }
    if (lastTrackedUrl.current === url) return;
    lastTrackedUrl.current = url;

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel() {
  const status = useCookieConsentStore((s) => s.status);

  if (status !== "accepted") return null;

  return (
    <>
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
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- 1x1 tracking pixel, not a real image */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
