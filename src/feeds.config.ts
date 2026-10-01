export type Category =
  | 'Browsers & platform'
  | 'CSS & UI'
  | 'Publications'
  | 'Engineers'
  | 'Releases'
  | 'Digests'
  | 'AI'
  | 'General';

export interface FeedSource {
  name: string;
  url: string;
  category: Category;
  /** Max items to take from this feed. Use it to stop busy feeds crowding out blogs. */
  limit?: number;
}

// Add or remove feeds here. Visit /api/feeds.json to see per-feed status
// (ok / error / item count) for every entry below.
//
// Sources without a usable feed (left out on purpose):
// - Bytes (ui.dev): no official RSS feed
// - Framer updates: no official RSS feed
export const feeds: FeedSource[] = [
  // Browsers & platform
  { name: 'Chrome for Developers', url: 'https://developer.chrome.com/static/blog/feed.xml', category: 'Browsers & platform' },
  { name: 'web.dev', url: 'https://web.dev/feed.xml', category: 'Browsers & platform' },
  { name: 'WebKit', url: 'https://webkit.org/feed/', category: 'Browsers & platform' },
  { name: 'Mozilla Hacks', url: 'https://hacks.mozilla.org/feed/', category: 'Browsers & platform' },

  // CSS & UI
  { name: 'Ahmad Shadeed', url: 'https://ishadeed.com/feed.xml', category: 'CSS & UI' },
  { name: 'Josh W. Comeau', url: 'https://www.joshwcomeau.com/rss.xml', category: 'CSS & UI' },
  { name: 'Modern CSS', url: 'https://moderncss.dev/feed/', category: 'CSS & UI' },
  { name: 'Adam Argyle', url: 'https://nerdy.dev/rss.xml', category: 'CSS & UI' },
  { name: 'Bram.us', url: 'https://www.bram.us/feed/', category: 'CSS & UI' },
  { name: 'Piccalilli', url: 'https://piccalil.li/feed.xml', category: 'CSS & UI' },

  // Publications
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', category: 'Publications' },
  { name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/', category: 'Publications' },
  { name: 'Frontend Masters Boost', url: 'https://frontendmasters.com/blog/feed/', category: 'Publications' },
  { name: 'Chris Coyier', url: 'https://chriscoyier.net/feed/', category: 'Publications' },
  { name: 'Codrops', url: 'https://tympanus.net/codrops/feed/', category: 'Publications' },

  // Engineers
  { name: 'Jake Archibald', url: 'https://jakearchibald.com/posts.rss', category: 'Engineers' },
  { name: 'Stefan Judis', url: 'https://www.stefanjudis.com/rss.xml', category: 'Engineers' },
  { name: 'Dan Abramov', url: 'https://overreacted.io/rss.xml', category: 'Engineers' },

  // Releases
  { name: 'Astro', url: 'https://astro.build/rss.xml', category: 'Releases' },
  { name: 'Vite', url: 'https://vite.dev/blog.rss', category: 'Releases' },

  // Digests (one item per issue)
  { name: 'Frontend Focus', url: 'https://frontendfoc.us/rss', category: 'Digests' },
  { name: 'JavaScript Weekly', url: 'https://javascriptweekly.com/rss', category: 'Digests' },
  // Unverified: CSS Weekly's feed URL could not be confirmed
  { name: 'CSS Weekly', url: 'https://css-weekly.com/feed/', category: 'Digests' },

  // AI (capped so they don't dominate)
  { name: 'AI News', url: 'https://news.smol.ai/rss.xml', category: 'AI', limit: 5 },
  { name: "Ben's Bites", url: 'https://www.bensbites.com/feed', category: 'AI', limit: 5 },

  // General (capped: 30 front-page links a day would bury everything else)
  { name: 'Hacker News', url: 'https://news.ycombinator.com/rss', category: 'General', limit: 10 },
];
