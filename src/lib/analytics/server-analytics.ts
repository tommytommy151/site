import { getJSON, setJSON } from "@/lib/db/kv-store";

const BLOB_KEY = "analytics/stats.json";

interface AnalyticsStats {
  totalVisits: number;
  referrers: Record<string, number>;
  productClicks: Record<string, { name: string; count: number }>;
}

const EMPTY_STATS: AnalyticsStats = { totalVisits: 0, referrers: {}, productClicks: {} };

// Throws on a transient read failure instead of swallowing it, so
// recordPageview/recordProductClick (read-modify-write) abort rather than
// overwriting good stats with EMPTY_STATS.
async function readStats(): Promise<AnalyticsStats> {
  const data = await getJSON<Partial<AnalyticsStats>>(BLOB_KEY);
  return { ...EMPTY_STATS, ...data };
}

// Used by the admin dashboard summary — degrade to zeros on a transient
// DB error instead of failing the whole request.
async function safeReadStats(): Promise<AnalyticsStats> {
  try {
    return await readStats();
  } catch {
    return EMPTY_STATS;
  }
}

async function writeStats(stats: AnalyticsStats) {
  await setJSON(BLOB_KEY, stats);
}

export async function recordPageview(referrerSource: string) {
  const stats = await readStats();
  stats.totalVisits += 1;
  stats.referrers[referrerSource] = (stats.referrers[referrerSource] ?? 0) + 1;
  await writeStats(stats);
}

export async function recordProductClick(productId: string, productName: string) {
  const stats = await readStats();
  const existing = stats.productClicks[productId];
  stats.productClicks[productId] = { name: productName, count: (existing?.count ?? 0) + 1 };
  await writeStats(stats);
}

export async function getAnalyticsSummary() {
  const stats = await safeReadStats();
  return {
    totalVisits: stats.totalVisits,
    referrers: Object.entries(stats.referrers)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    topProducts: Object.entries(stats.productClicks)
      .map(([productId, { name, count }]) => ({ productId, name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}
