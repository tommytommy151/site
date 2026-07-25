"use client";

import { useEffect } from "react";
import { useOrderStore } from "@/lib/store/order-store";
import type { Order } from "@/types/order";

export function OrderStoreHydrator() {
  const mergeServerOrders = useOrderStore((s) => s.mergeServerOrders);
  const flushPendingSync = useOrderStore((s) => s.flushPendingSync);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Order[]) => {
        if (Array.isArray(data) && data.length) mergeServerOrders(data);
      })
      .catch(() => {});
  }, [mergeServerOrders]);

  useEffect(() => {
    flushPendingSync();
    window.addEventListener("online", flushPendingSync);
    document.addEventListener("visibilitychange", flushPendingSync);
    return () => {
      window.removeEventListener("online", flushPendingSync);
      document.removeEventListener("visibilitychange", flushPendingSync);
    };
  }, [flushPendingSync]);

  return null;
}
