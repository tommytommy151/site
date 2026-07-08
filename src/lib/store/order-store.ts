"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types/order";
import { orders as DEFAULT_ORDERS } from "@/lib/data/orders";

interface OrderState {
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: DEFAULT_ORDERS,

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    { name: "estelaoferta-orders" },
  ),
);
