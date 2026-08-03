"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { useCookieConsentStore } from "@/lib/store/cookie-consent-store";

const TIKTOK_PIXEL_ID = "D9MP0MBC77U05N07KES0";

declare global {
  interface Window {
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      holdConsent?: () => void;
      grantConsent?: () => void;
      revokeConsent?: () => void;
      [key: string]: unknown;
    };
  }
}

// Events always fire — held in TikTok's cookieless "holdConsent" mode until
// the visitor accepts (see TikTokPixel below), same reasoning as Meta.
export function trackTikTokEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.ttq) return;
  window.ttq.track(name, params);
}

export interface TikTokContentItem {
  content_id: string;
  content_name?: string;
  content_category?: string;
  quantity?: number;
  price?: number;
}

/**
 * Builds the `content_id` / `contents` fields TikTok's diagnostics require on every
 * ecommerce event. `content_id` must always be a real, non-empty product id — TikTok
 * flags "Content ID is missing" when only `content_ids` (plural, legacy) is sent.
 */
export function buildTikTokContentParams(items: TikTokContentItem[]) {
  const validItems = items.filter((i) => Boolean(i.content_id));
  return {
    content_id: validItems[0]?.content_id ?? "",
    content_type: "product" as const,
    contents: validItems.map((i) => ({
      content_id: i.content_id,
      content_type: "product" as const,
      content_name: i.content_name,
      content_category: i.content_category,
      quantity: i.quantity ?? 1,
      price: i.price,
    })),
  };
}

function tiktokConsentCall(status: string): string {
  if (status === "accepted") return "ttq.grantConsent();";
  if (status === "rejected") return "ttq.revokeConsent();";
  return "ttq.holdConsent();";
}

// Same reasoning as MetaPixel: the pixel loader always runs so it's
// detectable and so events queue up correctly, but ttq.holdConsent() keeps
// it from setting cookies or sending anything until the visitor decides.
// grantConsent()/revokeConsent() are called live once they do.
export function TikTokPixel() {
  const status = useCookieConsentStore((s) => s.status);
  const lastAppliedStatus = useRef<string | null>(null);

  useEffect(() => {
    if (lastAppliedStatus.current === null) {
      // Covered by the boot script's initial consent call below.
      lastAppliedStatus.current = status;
      return;
    }
    if (lastAppliedStatus.current === status) return;
    lastAppliedStatus.current = status;

    if (typeof window !== "undefined" && window.ttq) {
      if (status === "accepted") window.ttq.grantConsent?.();
      else if (status === "rejected") window.ttq.revokeConsent?.();
      else window.ttq.holdConsent?.();
    }
  }, [status]);

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
          var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
          ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

          ${tiktokConsentCall(status)}
          ttq.load('${TIKTOK_PIXEL_ID}');
          ttq.page();
        }(window, document, 'ttq');
      `}
    </Script>
  );
}
