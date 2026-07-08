import type { Order, OrderStatus } from "@/types/order";
import { products } from "./products";

const STATUSES: OrderStatus[] = ["processing", "shipped", "delivered", "delivered", "delivered", "cancelled"];

const CUSTOMERS = [
  { name: "Ioana Petrescu", email: "ioana.petrescu@example.com" },
  { name: "Marcus Weber", email: "marcus.weber@example.com" },
  { name: "Sofia Andrei", email: "sofia.andrei@example.com" },
  { name: "Radu Constantin", email: "radu.constantin@example.com" },
  { name: "Elena Marinescu", email: "elena.marinescu@example.com" },
  { name: "Liam O'Connor", email: "liam.oconnor@example.com" },
  { name: "Ana Dumitrescu", email: "ana.dumitrescu@example.com" },
  { name: "Tudor Ionescu", email: "tudor.ionescu@example.com" },
];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function buildOrders(count: number): Order[] {
  const rand = seededRandom(42);
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const customer = CUSTOMERS[i % CUSTOMERS.length];
    const itemCount = 1 + Math.floor(rand() * 3);
    const items = Array.from({ length: itemCount }, () => {
      const product = products[Math.floor(rand() * products.length)];
      const quantity = 1 + Math.floor(rand() * 2);
      return {
        productId: product.id,
        name: product.name,
        image: product.images[0],
        quantity,
        price: product.price,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 300 ? 0 : 25;
    const daysAgo = Math.floor(rand() * 90) + 1;
    const status = STATUSES[Math.floor(rand() * STATUSES.length)];

    orders.push({
      id: `order-${i + 1}`,
      number: `EO-${(10450 + i).toString()}`,
      customerName: customer.name,
      customerEmail: customer.email,
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      status,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      paymentMethod: rand() > 0.5 ? "Card bancar" : "Ramburs la livrare",
      shippingAddress: "Str. Aviatorilor 23, București, Sector 1",
    });
  }

  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const orders: Order[] = buildOrders(24);

export function getOrdersForCustomer(email: string) {
  const owned = orders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
  return owned.length > 0 ? owned : orders.slice(0, 4);
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  processing: "În procesare",
  shipped: "Expediată",
  delivered: "Livrată",
  cancelled: "Anulată",
};
