"use client";

import { useEffect } from "react";
import { useOrderStore } from "@/lib/store/order-store";
import type { Order } from "@/types/order";

export function OrderStoreHydrator() {
  const mergeServerOrders = useOrderStore((s) => s.mergeServerOrders);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Order[]) => {
        if (Array.isArray(data) && data.length) mergeServerOrders(data);
      })
      .catch(() => {});
  }, [mergeServerOrders]);

  return null;
}
