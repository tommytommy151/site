import { get, put } from "@vercel/blob";

const BLOB_PATHNAME = "analytics/stats.json";

interface AnalyticsStats {
  totalVisits: number;
  referrers: Record<string, number>;
  productClicks: Record<string, { name: string; count: number }>;
}

const EMPTY_STATS: AnalyticsStats = { totalVisits: 0, referrers: {}, productClicks: {} };

async function readStats(): Promise<AnalyticsStats> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY_STATS;
  try {
    const blob = await get(BLOB_PATHNAME, { access: "private", useCache: false });
    if (!blob) return EMPTY_STATS;
    const text = await new Response(blob.stream).text();
    return { ...EMPTY_STATS, ...JSON.parse(text) };
  } catch {
    return EMPTY_STATS;
  }
}

async function writeStats(stats: AnalyticsStats) {
  await put(BLOB_PATHNAME, JSON.stringify(stats), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function recordPageview(referrerSource: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const stats = await readStats();
  stats.totalVisits += 1;
  stats.referrers[referrerSource] = (stats.referrers[referrerSource] ?? 0) + 1;
  await writeStats(stats);
}

export async function recordProductClick(productId: string, productName: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const stats = await readStats();
  const existing = stats.productClicks[productId];
  stats.productClicks[productId] = { name: productName, count: (existing?.count ?? 0) + 1 };
  await writeStats(stats);
}

export async function getAnalyticsSummary() {
  const stats = await readStats();
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
