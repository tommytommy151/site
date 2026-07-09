"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Package } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useOrderStore } from "@/lib/store/order-store";
import { formatDate, formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { Button } from "@/components/ui/button";

export default function AccountOrdersPage() {
  const user = useAuthStore((s) => s.user);
  const allOrders = useOrderStore((s) => s.orders);
  const owned = user
    ? allOrders.filter((o) => o.customerEmail.toLowerCase() === user.email.toLowerCase())
    : [];
  const orders = owned.length > 0 ? owned : allOrders.slice(0, 4);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Comenzile mele</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Istoricul complet al comenzilor tale EstelaOferta.
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <Package className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Nu ai plasat încă nicio comandă</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{order.number}</p>
                  <p className="text-xs text-muted-foreground">
                    Plasată pe {formatDate(order.date)} · {order.paymentMethod}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}/invoice`}>
                      <Download className="size-3.5" /> Factură
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {order.items.map((item, i) => (
                  <div key={`${order.id}-${i}`} className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Cantitate: {item.quantity}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
