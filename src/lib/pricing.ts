export interface QuantityDiscountTier {
  minQty: number;
  discountPct: number;
}

export const QUANTITY_DISCOUNT_TIERS: QuantityDiscountTier[] = [
  { minQty: 1, discountPct: 10 },
  { minQty: 2, discountPct: 20 },
  { minQty: 3, discountPct: 25 },
  { minQty: 4, discountPct: 30 },
  { minQty: 5, discountPct: 35 },
];

export function quantityDiscountPct(quantity: number): number {
  let pct = 0;
  for (const tier of QUANTITY_DISCOUNT_TIERS) {
    if (quantity >= tier.minQty) pct = tier.discountPct;
  }
  return pct;
}

export function quantityUnitPrice(basePrice: number, quantity: number): number {
  return Math.round(basePrice * (1 - quantityDiscountPct(quantity) / 100));
}

export function quantityLineTotal(basePrice: number, quantity: number): number {
  return quantityUnitPrice(basePrice, quantity) * quantity;
}

export interface ShippingMethod {
  id: "express";
  label: string;
  eta: string;
  price: number;
  freeOverThreshold?: number;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "express",
    label: "Curierat rapid",
    eta: "1–2 zile lucrătoare",
    price: 20,
  },
];

export function shippingCost(methodId: ShippingMethod["id"], subtotal: number): number {
  const method = SHIPPING_METHODS.find((m) => m.id === methodId) ?? SHIPPING_METHODS[0];
  if (method.freeOverThreshold && subtotal >= method.freeOverThreshold) return 0;
  return method.price;
}
