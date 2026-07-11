/**
 * Pulls long-tail keyword suggestions from Google's (unofficial) autocomplete
 * endpoint — the same completions people see while typing a search, which
 * makes them good real-world long-tail tags. Best-effort only: the endpoint
 * is undocumented and can rate-limit or fail, so callers should treat an
 * empty array as the normal "nothing found" case, not an error.
 */
export async function getGoogleLongTailTags(query: string, limit = 10): Promise<string[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=ro&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EstelaOfertaImportBot/1.0)" },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return [];

    const data = (await res.json()) as [string, string[]];
    const suggestions = Array.isArray(data?.[1]) ? data[1] : [];
    const queryLower = trimmed.toLowerCase();

    return suggestions
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s && s !== queryLower && s.split(/\s+/).length >= 2)
      .slice(0, limit);
  } catch {
    return [];
  }
}
