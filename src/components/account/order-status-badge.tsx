import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/data/orders";
import type { OrderStatus } from "@/types/order";

const STYLES: Record<OrderStatus, string> = {
  processing: "bg-brand-indigo-soft text-brand-indigo",
  shipped: "bg-brand-emerald-soft text-brand-emerald",
  delivered: "bg-brand-emerald-soft text-brand-emerald",
  cancelled: "bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STYLES[status],
        className,
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
