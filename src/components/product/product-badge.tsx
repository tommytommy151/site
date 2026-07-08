import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/types/product";

const BADGE_STYLES: Record<ProductBadge, string> = {
  new: "bg-brand-indigo-soft text-brand-indigo",
  bestseller: "bg-brand-emerald-soft text-brand-emerald",
  "flash-deal": "bg-destructive/10 text-destructive",
  "sold-out": "bg-muted text-muted-foreground",
  limited: "bg-brand-navy/10 text-brand-navy dark:bg-white/10 dark:text-white",
};

const BADGE_LABELS: Record<ProductBadge, string> = {
  new: "Nou",
  bestseller: "Cel mai vândut",
  "flash-deal": "Reducere",
  "sold-out": "Stoc epuizat",
  limited: "Ediție limitată",
};

export function ProductBadgePill({ badge, className }: { badge: ProductBadge; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-sm",
        BADGE_STYLES[badge],
        className,
      )}
    >
      {BADGE_LABELS[badge]}
    </span>
  );
}
