import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/types/product";

const BADGE_STYLES: Record<ProductBadge, string> = {
  new: "bg-brand-indigo-soft text-brand-indigo",
  bestseller: "bg-brand-emerald text-primary-foreground shadow-glow",
  "flash-deal": "bg-brand-indigo text-white shadow-glow-indigo",
  "sold-out": "bg-muted text-muted-foreground",
  limited: "border border-brand-emerald text-brand-emerald",
};

const BADGE_LABELS: Record<ProductBadge, string> = {
  new: "Nou",
  bestseller: "Cel mai vândut",
  "flash-deal": "Black Friday",
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
