AffordMed URL Shortener (Frontend)

A small React + TypeScript app to create short links on the client and view analytics (clicks, timestamps, source, coarse location). Uses Material UI and localStorage for persistence.

Run locally
- Install: `npm install`
- Dev server: `npm start` → http://localhost:3000
- Build: `npm run build`

What’s included
- Shorten up to 5 URLs at once
- Optional validity (minutes) and custom shortcode; default validity 30 min
- Redirect handler at `/:code` with expiry checks
- Statistics page with click details
- Lightweight logger writing structured logs to localStorage

Key files
- `src/pages/ShortenerPage.tsx` — create short links
- `src/pages/RedirectHandler.tsx` — resolves `/:code` and redirects
- `src/pages/StatsPage.tsx` — list links and clicks
- `src/storage/*` — data types and persistence helpers
- `src/logging/logger.ts` — logging service
- `ARCHITECTURE.md` — design notes

Notes
- This is a self-contained frontend for local evaluation; no authentication required.
