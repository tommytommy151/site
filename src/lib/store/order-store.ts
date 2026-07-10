"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types/order";
import { orders as DEFAULT_ORDERS } from "@/lib/data/orders";

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  setOrderInvoice: (id: string, invoiceUrl: string, invoiceFileName: string) => void;
  removeOrderInvoice: (id: string) => void;
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

      setOrderInvoice: (id, invoiceUrl, invoiceFileName) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, invoiceUrl, invoiceFileName } : o)),
        })),

      removeOrderInvoice: (id) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, invoiceUrl: undefined, invoiceFileName: undefined } : o,
          ),
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
