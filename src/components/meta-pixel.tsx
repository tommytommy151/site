"use client";

import Script from "next/script";
import { useCookieConsentStore } from "@/lib/store/cookie-consent-store";

const META_PIXEL_ID = "1921102271842119";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMetaEvent(name: string, params?: Record<string, unknown>) {
  if (useCookieConsentStore.getState().status !== "accepted") return;
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, params);
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
