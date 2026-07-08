export function formatPrice(amount: number, currency: string = "RON") {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ro-RO", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(iso),
  );
}

export function discountPct(price: number, compareAtPrice?: number) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
