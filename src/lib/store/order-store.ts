"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types/order";
import { orders as DEFAULT_ORDERS } from "@/lib/data/orders";

function syncOrder(order: Order) {
  fetch("/api/orders/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  }).catch(() => {});
}

function syncDeleteOrder(id: string) {
  fetch("/api/orders/sync", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  }).catch(() => {});
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  setOrderInvoice: (id: string, invoiceUrl: string, invoiceFileName: string) => void;
  removeOrderInvoice: (id: string) => void;
  deleteOrder: (id: string) => void;
  deleteOrdersByCustomerEmail: (email: string) => void;
  mergeServerOrders: (orders: Order[]) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: DEFAULT_ORDERS,

      addOrder: (order) => {
        syncOrder(order);
        set((state) => ({ orders: [order, ...state.orders] }));
      },

      updateOrderStatus: (id, status) =>
        set((state) => {
          const orders = state.orders.map((o) => (o.id === id ? { ...o, status } : o));
          const updated = orders.find((o) => o.id === id);
          if (updated) syncOrder(updated);
          return { orders };
        }),

      setOrderInvoice: (id, invoiceUrl, invoiceFileName) =>
        set((state) => {
          const orders = state.orders.map((o) =>
            o.id === id ? { ...o, invoiceUrl, invoiceFileName } : o,
          );
          const updated = orders.find((o) => o.id === id);
          if (updated) syncOrder(updated);
          return { orders };
        }),

      removeOrderInvoice: (id) =>
        set((state) => {
          const orders = state.orders.map((o) =>
            o.id === id ? { ...o, invoiceUrl: undefined, invoiceFileName: undefined } : o,
          );
          const updated = orders.find((o) => o.id === id);
          if (updated) syncOrder(updated);
          return { orders };
        }),

      deleteOrder: (id) => {
        syncDeleteOrder(id);
        set((state) => ({ orders: state.orders.filter((o) => o.id !== id) }));
      },

      deleteOrdersByCustomerEmail: (email) =>
        set((state) => {
          const toDelete = state.orders.filter((o) => o.customerEmail === email);
          toDelete.forEach((o) => syncDeleteOrder(o.id));
          return { orders: state.orders.filter((o) => o.customerEmail !== email) };
        }),

      mergeServerOrders: (incoming) =>
        set((state) => {
          const existingIds = new Set(state.orders.map((o) => o.id));
          const toAdd = incoming.filter((o) => !existingIds.has(o.id));
          return toAdd.length ? { orders: [...toAdd, ...state.orders] } : {};
        }),
    }),
    { name: "estelaoferta-orders" },
  ),
);
