"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types/order";
import { orders as DEFAULT_ORDERS } from "@/lib/data/orders";

// Returns whether the order actually made it to the server — a paid order
// that fails here would otherwise vanish silently from the admin's view while
// still counting as a real conversion everywhere else (Stripe, Meta Pixel).
async function syncOrder(order: Order): Promise<boolean> {
  console.log("[order-store] syncOrder start", order.id);
  try {
    const res = await fetch("/api/orders/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    console.log("[order-store] syncOrder response", order.id, res.status);
    return res.ok;
  } catch (err) {
    console.error("[order-store] syncOrder network error", order.id, err);
    return false;
  }
}

async function syncDeleteOrder(id: string): Promise<boolean> {
  try {
    const res = await fetch("/api/orders/sync", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

interface OrderState {
  orders: Order[];
  pendingSyncIds: string[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  setOrderInvoice: (id: string, invoiceUrl: string, invoiceFileName: string) => void;
  removeOrderInvoice: (id: string) => void;
  deleteOrder: (id: string) => void;
  deleteOrdersByCustomerEmail: (email: string) => void;
  mergeServerOrders: (orders: Order[]) => void;
  flushPendingSync: () => Promise<void>;
}

function markSyncResult(set: (fn: (state: OrderState) => Partial<OrderState>) => void, id: string, ok: boolean) {
  set((state) => ({
    pendingSyncIds: ok
      ? state.pendingSyncIds.filter((pid) => pid !== id)
      : state.pendingSyncIds.includes(id)
        ? state.pendingSyncIds
        : [...state.pendingSyncIds, id],
  }));
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: DEFAULT_ORDERS,
      pendingSyncIds: [],

      addOrder: (order) => {
        console.log("[order-store] addOrder", order.id, order.paymentMethod, order.total);
        set((state) => ({ orders: [order, ...state.orders] }));
        syncOrder(order).then((ok) => {
          if (!ok) console.error("[order-store] addOrder sync failed, queued for retry", order.id);
          markSyncResult(set, order.id, ok);
        });
      },

      updateOrderStatus: (id, status) =>
        set((state) => {
          const orders = state.orders.map((o) => (o.id === id ? { ...o, status } : o));
          const updated = orders.find((o) => o.id === id);
          if (updated) syncOrder(updated).then((ok) => markSyncResult(set, id, ok));
          return { orders };
        }),

      setOrderInvoice: (id, invoiceUrl, invoiceFileName) =>
        set((state) => {
          const orders = state.orders.map((o) =>
            o.id === id ? { ...o, invoiceUrl, invoiceFileName } : o,
          );
          const updated = orders.find((o) => o.id === id);
          if (updated) syncOrder(updated).then((ok) => markSyncResult(set, id, ok));
          return { orders };
        }),

      removeOrderInvoice: (id) =>
        set((state) => {
          const orders = state.orders.map((o) =>
            o.id === id ? { ...o, invoiceUrl: undefined, invoiceFileName: undefined } : o,
          );
          const updated = orders.find((o) => o.id === id);
          if (updated) syncOrder(updated).then((ok) => markSyncResult(set, id, ok));
          return { orders };
        }),

      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
          pendingSyncIds: state.pendingSyncIds.filter((pid) => pid !== id),
        }));
        syncDeleteOrder(id);
      },

      deleteOrdersByCustomerEmail: (email) =>
        set((state) => {
          const toDelete = state.orders.filter((o) => o.customerEmail === email);
          toDelete.forEach((o) => syncDeleteOrder(o.id));
          const deletedIds = new Set(toDelete.map((o) => o.id));
          return {
            orders: state.orders.filter((o) => o.customerEmail !== email),
            pendingSyncIds: state.pendingSyncIds.filter((pid) => !deletedIds.has(pid)),
          };
        }),

      mergeServerOrders: (incoming) =>
        set((state) => {
          const existingIds = new Set(state.orders.map((o) => o.id));
          const toAdd = incoming.filter((o) => !existingIds.has(o.id));
          return toAdd.length ? { orders: [...toAdd, ...state.orders] } : {};
        }),

      // Retries any order that previously failed to reach the server — covers
      // the case where a customer's connection dropped, or Netlify Blobs had a
      // transient failure, right after a real payment went through.
      flushPendingSync: async () => {
        const { pendingSyncIds, orders } = get();
        for (const id of pendingSyncIds) {
          const order = orders.find((o) => o.id === id);
          if (!order) {
            set((state) => ({ pendingSyncIds: state.pendingSyncIds.filter((pid) => pid !== id) }));
            continue;
          }
          const ok = await syncOrder(order);
          markSyncResult(set, id, ok);
        }
      },
    }),
    { name: "estelaoferta-orders" },
  ),
);
