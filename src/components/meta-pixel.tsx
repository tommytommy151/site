"use client";

// ---------------------------------------------------------------------------
// Meta (Facebook) Pixel
//
// Pixel ID: read from NEXT_PUBLIC_FACEBOOK_PIXEL_ID (see .env.example). The
// hardcoded value below is only a safety net for the current production
// pixel in case the env var isn't set yet — the env var is the source of
// truth and should be kept up to date in Netlify's dashboard.
// ---------------------------------------------------------------------------

import { Suspense, useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useCookieConsentStore } from "@/lib/store/cookie-consent-store";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1389718926685322";

// `next build` (and therefore every real deploy) sets NODE_ENV to
// "production"; only `next dev` doesn't. Gating on this keeps local
// development from ever sending real events into Meta's ad account.
const IS_PRODUCTION = process.env.NODE_ENV === "production";

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
//
// The pixel itself always fires (Meta's Consent Mode — see MetaPixel below —
// decides whether it's allowed to drop cookies), but personally-identifying
// userData (email/phone) is only ever sent once the visitor has explicitly
// accepted marketing cookies.
export function trackMetaEvent(
  name: string,
  params?: Record<string, unknown>,
  eventId?: string,
  userData?: { email?: string; phone?: string },
) {
  if (typeof window === "undefined") return;
  if (!IS_PRODUCTION) return; // no real Meta traffic from local dev
  const consented = useCookieConsentStore.getState().status === "accepted";
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
      userData: consented ? userData : undefined,
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

// Note on consent: the pixel loads unconditionally (whenever IS_PRODUCTION
// is true) rather than being gated behind "accepted" — Meta's automated
// pixel checker (and Test Events) just loads the page once and never clicks
// the cookie banner, so hiding the whole component until "accepted" meant
// the pixel was never detectable, and it also meant real ad-driven visitors
// who never interacted with the banner generated zero signal.
//
// Instead we use Meta's Consent Mode: `fbq('consent', 'revoke')` boots the
// pixel in a cookieless/limited mode (no _fbp/_fbc, no ad personalization)
// until the visitor accepts, at which point `fbq('consent', 'grant')` is
// called live to switch on full tracking — no page reload needed.
export function MetaPixel() {
  const status = useCookieConsentStore((s) => s.status);
  const lastAppliedStatus = useRef<string | null>(null);

  // Step A: keep an already-booted pixel's consent state in sync as the
  // visitor's choice changes, without re-running the boot script.
  useEffect(() => {
    if (!IS_PRODUCTION) return;
    if (lastAppliedStatus.current === null) {
      // Covered by the boot script's initial fbq('consent', ...) call below.
      lastAppliedStatus.current = status;
      return;
    }
    if (lastAppliedStatus.current === status) return;
    lastAppliedStatus.current = status;

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("consent", status === "accepted" ? "grant" : "revoke");
    }
  }, [status]);

  // Step B: only load the pixel in production — never in `next dev`.
  if (!IS_PRODUCTION) return null;

  return (
    <>
      {/* Step C: next/script with strategy="afterInteractive" fetches and
          runs the pixel after the page has become interactive, so it never
          blocks first paint/hydration. The stable `id` is how Next.js
          de-dupes this script — even across re-renders or Strict Mode's
          double-invoke in dev, the tag (and fbq init) is only ever inserted
          once per page load, so there's no duplicate initialization. */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          // Step D: official Meta Pixel base code, unmodified. The
          // "if(f.fbq)return" guard is Meta's own duplicate-init protection.
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          // Step E: Consent Mode — start in "revoke" (cookieless/limited)
          // unless this visitor already accepted cookies in a prior visit;
          // the effect above switches this live to "grant" without reload.
          fbq('consent', '${status === "accepted" ? "grant" : "revoke"}');

          // Step F: initialize with the configured Pixel ID.
          fbq('init', '${META_PIXEL_ID}');

          // Step G: track the initial PageView for the page that was
          // active when the script finished loading.
          fbq('track', 'PageView');
        `}
      </Script>

      {/* Step H: required <noscript> fallback — a 1x1 tracking image so
          visitors with JavaScript disabled still register a PageView. */}
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

      {/* Step I: track PageView on every subsequent client-side route
          change — the App Router doesn't reload the document on <Link>
          navigation, so without this only the first page would be tracked. */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
