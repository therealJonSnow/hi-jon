import { parseFeed } from 'feedsmith';
import { feeds, type Category, type FeedSource } from '../feeds.config';

const TIMEOUT_MS = 5000;
const DEFAULT_ITEMS_PER_FEED = 20;

// Some hosts (Substack, Cloudflare-fronted sites) reject requests without a UA
const USER_AGENT = 'Mozilla/5.0 (compatible; hi-jon-rss-reader/0.1)';

export interface FeedItem {
  id: string;
  title: string;
  link: string;
  date: string | null; // ISO 8601
  source: string;
  category: Category;
}

export interface SourceStatus {
  name: string;
  url: string;
  ok: boolean;
  count: number;
  error?: string;
}

export interface FeedResult {
  items: FeedItem[];
  sources: SourceStatus[];
  fetchedAt: string;
}

interface RawItem {
  id?: string;
  title?: string;
  link?: string;
  date?: string;
}

function toIso(value: string | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

// Normalizes RSS, Atom, RDF and JSON Feed items into one shape
function extractItems(xml: string): RawItem[] {
  const { format, feed } = parseFeed(xml);

  switch (format) {
    case 'rss':
      return (feed.items ?? []).map((item) => ({
        id: item.guid?.value,
        title: item.title,
        link: item.link,
        date: item.pubDate ?? item.dc?.dates?.[0],
      }));
    case 'atom':
      return (feed.entries ?? []).map((entry) => {
        const link =
          entry.links?.find((l) => !l.rel || l.rel === 'alternate') ?? entry.links?.[0];
        return {
          id: entry.id,
          title: entry.title?.value,
          link: link?.href,
          date: entry.published ?? entry.updated,
        };
      });
    case 'rdf':
      return (feed.items ?? []).map((item) => ({
        title: item.title,
        link: item.link,
        date: item.dc?.dates?.[0],
      }));
    case 'json':
      return (feed.items ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        link: item.url ?? item.external_url,
        date: item.date_published ?? item.date_modified,
      }));
  }
}

async function fetchFeed(source: FeedSource): Promise<FeedItem[]> {
  const res = await fetch(source.url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const items: FeedItem[] = [];
  for (const raw of extractItems(await res.text())) {
    if (!raw.link) continue;
    items.push({
      id: raw.id || raw.link,
      title: raw.title?.trim() || raw.link,
      link: raw.link,
      date: toIso(raw.date),
      source: source.name,
      category: source.category,
    });
  }
  return items.slice(0, source.limit ?? DEFAULT_ITEMS_PER_FEED);
}

// Newest first; undated items go last
function byDateDesc(a: FeedItem, b: FeedItem): number {
  if (a.date === b.date) return 0;
  if (!a.date) return 1;
  if (!b.date) return -1;
  return a.date < b.date ? 1 : -1;
}

export async function getAllItems(): Promise<FeedResult> {
  const results = await Promise.allSettled(feeds.map(fetchFeed));

  const items: FeedItem[] = [];
  const sources: SourceStatus[] = results.map((result, i) => {
    const { name, url } = feeds[i];
    if (result.status === 'fulfilled') {
      items.push(...result.value);
      return { name, url, ok: true, count: result.value.length };
    }
    const error = result.reason instanceof Error ? result.reason.message : String(result.reason);
    return { name, url, ok: false, count: 0, error };
  });

  return { items: items.sort(byDateDesc), sources, fetchedAt: new Date().toISOString() };
}

// Served from Vercel's CDN for 15 min, then refreshed in the background
// while the stale copy is still served (for up to a day).
export const CACHE_CONTROL = 's-maxage=900, stale-while-revalidate=86400';
