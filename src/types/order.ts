export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
}
