export type Category = 'Frontend' | 'Tooling' | 'AI' | 'General';

export interface FeedSource {
  name: string;
  url: string;
  category: Category;
}

// Add or remove feeds here. Visit /api/feeds.json to see per-feed status
// (ok / error / item count) for every entry below.
//
// Sources without a usable feed (left out on purpose):
// - Bytes (ui.dev): no official RSS feed
// - Framer updates: no official RSS feed
// - VoidZero blog: no feed found; the Vite blog below covers most of its posts
export const feeds: FeedSource[] = [
  // Frontend
  { name: 'Frontend Focus', url: 'https://frontendfoc.us/rss', category: 'Frontend' },
  { name: 'JavaScript Weekly', url: 'https://javascriptweekly.com/rss', category: 'Frontend' },
  // Unverified: CSS Weekly's feed URL could not be confirmed
  { name: 'CSS Weekly', url: 'https://css-weekly.com/feed/', category: 'Frontend' },
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', category: 'Frontend' },
  // Reported as no longer updating since mid-2026
  { name: 'web.dev', url: 'https://web.dev/static/blog/feed.xml', category: 'Frontend' },
  // Reported as no longer updating since mid-2026
  { name: 'Chrome for Developers', url: 'https://developer.chrome.com/static/blog/feed.xml', category: 'Frontend' },
  { name: 'WebKit', url: 'https://webkit.org/feed/', category: 'Frontend' },
  { name: 'Josh W. Comeau', url: 'https://www.joshwcomeau.com/rss.xml', category: 'Frontend' },
  { name: 'Codrops', url: 'https://tympanus.net/codrops/feed/', category: 'Frontend' },

  // Tooling
  // Unverified: this is Vercel's blog feed; no changelog-only feed was found
  { name: 'Vercel', url: 'https://vercel.com/atom', category: 'Tooling' },
  { name: 'Vite', url: 'https://vite.dev/blog.rss', category: 'Tooling' },

  // AI
  { name: 'Simon Willison', url: 'https://simonwillison.net/atom/everything/', category: 'AI' },
  { name: 'AI News', url: 'https://news.smol.ai/rss.xml', category: 'AI' },
  { name: 'Latent Space', url: 'https://www.latent.space/feed', category: 'AI' },
  { name: "Ben's Bites", url: 'https://www.bensbites.com/feed', category: 'AI' },

  // General
  { name: 'Hacker News', url: 'https://news.ycombinator.com/rss', category: 'General' },
];
