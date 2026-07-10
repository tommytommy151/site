"use client";

import { useState } from "react";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://estelaoferta.example";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.9h2.66l.4-3.09h-3.06V8.05c0-.9.25-1.5 1.53-1.5h1.63V3.8c-.28-.04-1.25-.12-2.38-.12-2.35 0-3.96 1.44-3.96 4.08v2.25H7.66v3.09h2.66V21h3.18Z" />
    </svg>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47 0 1.45 1.07 2.86 1.22 3.06.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.85.5 3.58 1.37 5.07L2 22l5.08-1.33A9.95 9.95 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2Zm0 18.1c-1.66 0-3.2-.46-4.53-1.25l-.32-.19-3.02.79.8-2.94-.21-.3A8.08 8.08 0 0 1 3.93 12c0-4.47 3.63-8.1 8.09-8.1 4.46 0 8.08 3.63 8.08 8.1s-3.62 8.1-8.08 8.1Z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.24 3h3.02l-6.6 7.54L22.5 21h-6.08l-4.76-6.22L6.2 21H3.17l7.06-8.07L2.5 3h6.24l4.3 5.68L18.24 3Zm-1.06 16.17h1.67L7.9 4.74H6.1l11.08 14.43Z" />
    </svg>
  );
}

function useShareLinks(slug: string, name: string) {
  const url = `${SITE_URL}/products/${slug}`;
  const text = `${name} — ${url}`;
  return {
    url,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(name)}`,
  };
}

function openShare(e: React.MouseEvent, shareUrl: string) {
  e.preventDefault();
  e.stopPropagation();
  window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=600");
}

const ICON_BUTTON_CLASS =
  "flex size-9 shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:border-brand-emerald/50 hover:text-brand-emerald";

export function ShareIconsRow({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const links = useShareLinks(slug, name);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(links.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — nothing to fall back to
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        aria-label="Distribuie pe Facebook"
        onClick={(e) => openShare(e, links.facebook)}
        className={ICON_BUTTON_CLASS}
      >
        <FacebookIcon className="size-4" />
      </button>
      <button
        aria-label="Distribuie pe WhatsApp"
        onClick={(e) => openShare(e, links.whatsapp)}
        className={ICON_BUTTON_CLASS}
      >
        <WhatsAppIcon className="size-4" />
      </button>
      <button
        aria-label="Distribuie pe X"
        onClick={(e) => openShare(e, links.x)}
        className={ICON_BUTTON_CLASS}
      >
        <XIcon className="size-4" />
      </button>
      <button
        aria-label="Copiază linkul"
        onClick={handleCopy}
        className={cn(ICON_BUTTON_CLASS, copied && "border-brand-emerald text-brand-emerald")}
      >
        {copied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}
      </button>
    </div>
  );
}

export function ShareButton({
  slug,
  name,
  className,
  triggerClassName,
}: {
  slug: string;
  name: string;
  className?: string;
  triggerClassName?: string;
}) {
  const [copied, setCopied] = useState(false);
  const links = useShareLinks(slug, name);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(links.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — nothing to fall back to
    }
  }

  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Distribuie produsul"
            onClick={(e) => e.preventDefault()}
            className={cn(
              "flex size-8 items-center justify-center rounded-full glass shadow-sm transition-colors hover:text-brand-emerald",
              triggerClassName,
            )}
          >
            <Share2 className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => openShare(e, links.facebook)}>
            <FacebookIcon className="size-4" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => openShare(e, links.whatsapp)}>
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => openShare(e, links.x)}>
            <XIcon className="size-4" />
            X (Twitter)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>
            {copied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}
            {copied ? "Link copiat!" : "Copiază linkul"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
