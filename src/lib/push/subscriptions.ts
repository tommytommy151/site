import { Redis } from "@upstash/redis";
import type { PushSubscription as WebPushSubscription } from "web-push";

const SUBSCRIPTIONS_KEY = "push:subscriptions";

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function saveSubscription(subscription: WebPushSubscription) {
  const redis = getRedis();
  if (!redis) throw new Error("Redis nu este configurat (KV_REST_API_URL / KV_REST_API_TOKEN).");
  await redis.hset(SUBSCRIPTIONS_KEY, { [subscription.endpoint]: JSON.stringify(subscription) });
}

export async function removeSubscription(endpoint: string) {
  const redis = getRedis();
  if (!redis) return;
  await redis.hdel(SUBSCRIPTIONS_KEY, endpoint);
}

export async function getAllSubscriptions(): Promise<WebPushSubscription[]> {
  const redis = getRedis();
  if (!redis) return [];
  const all = await redis.hgetall<Record<string, string>>(SUBSCRIPTIONS_KEY);
  if (!all) return [];
  return Object.values(all).map((value) =>
    typeof value === "string" ? JSON.parse(value) : (value as WebPushSubscription),
  );
}

export function isPushConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}
