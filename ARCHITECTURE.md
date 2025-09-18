# AffordMed URL Shortener - Frontend

## Overview
A React (TypeScript) single-page app that shortens URLs client-side, persists data in localStorage, performs client-side redirects for shortcodes, and shows analytics (click counts, timestamps, source, and coarse location). Styling uses Material UI. All logging goes through a custom logger that writes to localStorage instead of console.

## Tech Choices
- React + CRA (TypeScript) for speed and predictable structure
- React Router for client-side routing and redirects (`/:code`)
- Material UI for consistent UI and accessibility
- localStorage for client-side persistence (no backend per constraints)
- Custom Logger to satisfy mandatory logging middleware requirement

## Data Model
- ShortUrl: `{ id, code, longUrl, createdAt, expiresAt, custom }`
- ClickEvent: `{ id, code, timestamp, source, location }`
- StoredData: `{ urls: ShortUrl[], clicks: ClickEvent[] }`
- Storage key: `url_shortener_data_v1`

## Shortening Flow
1. Validate inputs (URL format, optional minutes integer, optional custom code)
2. Ensure unique shortcode: accept custom if valid & unused, else generate random 6-char code
3. Compute `expiresAt` (default 30 min when minutes omitted)
4. Persist created records; render result cards with short URL and expiry timestamp

## Redirect Flow
- Route `/:code` resolves locally:
  - Lookup by `code`; if missing: show error
  - If expired: show error
  - Else record `ClickEvent` with timestamp, source (originating page), and coarse location from `ipapi.co`
  - Perform `window.location.replace(longUrl)`

## Stats Page
- Lists all shortened URLs with creation/expiry
- Aggregates click count by `code` and shows detailed click entries

## Logging
- `src/logging/logger.ts` provides `Logger.{debug,info,warn,error}` writing to `localStorage` (`app_logs`) and in-memory buffer
- `loggedFetch` wrapper demonstrates network logging; `reportWebVitals` forwards metrics to logger

## Assumptions
- Users are pre-authorized; no auth UI
- Coarse geo via public IP API is acceptable for evaluation
- Expired links remain listed but do not redirect

## Future Enhancements
- Replace `localStorage` with IndexedDB for larger datasets
- Import/export data for portability
- Dedicate log viewer UI and log rotation
- Add unit tests for validation and storage helpers

