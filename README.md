# hi-jon

A personal RSS reader built with Astro in server mode. It deploys to Vercel.

- `src/feeds.config.ts`: the list of feeds. Add or remove entries here.
- `src/lib/feeds.ts`: fetches every feed in parallel with a 5s timeout each, then parses (RSS, Atom, RDF and JSON Feed, via `feedsmith`), merges and sorts newest first.
- `src/pages/index.astro`: the page. Read/unread state is kept in `localStorage`.
- `src/pages/api/feeds.json.ts`: the same data as JSON, plus the status of each feed. Use it to find broken feed URLs.

Responses are sent with `Cache-Control: s-maxage=900, stale-while-revalidate=86400`. Vercel's CDN serves the cached copy for 15 minutes, then refreshes it in the background.

```sh
npm install
npm run dev     # http://localhost:4321
npm run check   # typecheck
npm run build
```
