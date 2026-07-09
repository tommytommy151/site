import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type CheckoutStep = "cont" | "livrare" | "plata";

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "cont", label: "Cont" },
  { id: "livrare", label: "Livrare" },
  { id: "plata", label: "Plată" },
];

export function CheckoutStepIndicator({ step }: { step: CheckoutStep }) {
  const activeIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="mb-8 flex items-center gap-3">
      {STEPS.map((s, i) => (
        <Fragment key={s.id}>
          <div
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              i <= activeIndex ? "text-brand-emerald" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full border text-xs",
                i <= activeIndex
                  ? "border-brand-emerald bg-brand-emerald-soft"
                  : "border-border",
              )}
            >
              {i + 1}
            </span>
            {s.label}
          </div>
          {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
        </Fragment>
      ))}
    </div>
  );
}
