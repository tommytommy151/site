"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types/order";
import { orders as DEFAULT_ORDERS } from "@/lib/data/orders";

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  deleteOrdersByCustomerEmail: (email: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: DEFAULT_ORDERS,

      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),

      deleteOrder: (id) =>
        set((state) => ({ orders: state.orders.filter((o) => o.id !== id) })),

      deleteOrdersByCustomerEmail: (email) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.customerEmail !== email),
        })),
    }),
    { name: "estelaoferta-orders" },
  ),
);
