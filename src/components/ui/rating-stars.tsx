import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  className,
  showValue = false,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating > i && rating < i + 1;
          return (
            <span key={i} className="relative inline-flex" style={{ width: size, height: size }}>
              <Star
                size={size}
                className="absolute inset-0 text-muted-foreground/30"
                fill="currentColor"
              />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: half ? "50%" : "100%" }}
                >
                  <Star size={size} className="text-brand-emerald" fill="currentColor" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
