import { Redis } from "@upstash/redis";
import type { Product } from "@/types/product";

const PRODUCTS_KEY = "products:custom";

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function saveCustomProduct(product: Product) {
  const redis = getRedis();
  if (!redis) return;
  await redis.hset(PRODUCTS_KEY, { [product.slug]: JSON.stringify(product) });
}

export async function deleteCustomProduct(slug: string) {
  const redis = getRedis();
  if (!redis) return;
  await redis.hdel(PRODUCTS_KEY, slug);
}

export async function getCustomProduct(slug: string): Promise<Product | null> {
  const redis = getRedis();
  if (!redis) return null;
  const value = await redis.hget<string>(PRODUCTS_KEY, slug);
  if (!value) return null;
  return typeof value === "string" ? JSON.parse(value) : (value as Product);
}
