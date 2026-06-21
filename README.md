# React Voice Translate POC

A modernized voice-to-translation demo built with React, Vite, and a small Express translation API.

## What changed

- Removed the hardcoded Google Translate API key from client code.
- Added a server-side `/api/translate` endpoint that reads credentials from environment variables.
- Migrated the frontend from Create React App to Vite.
- Replaced boilerplate tests with frontend and API behavior tests.
- Added ESLint, CI, and a simple secret scanning check.

## Architecture

- `src/` contains the React client.
- `server/` contains the Express API that proxies translation requests.
- `public/` contains static assets served by Vite.
- `.github/workflows/ci.yml` runs lint, test, build, and secret checks.

The browser only sends transcript text to `/api/translate`. The server owns the Google API key and calls the Google Translate API.

## Prerequisites

- Node.js 20 or newer
- A Google Translate API key with access to the Cloud Translation API

## Environment variables

Copy `/home/runner/work/react-voice-translate-poc/react-voice-translate-poc/.env.example` to `/home/runner/work/react-voice-translate-poc/react-voice-translate-poc/.env` and set:

- `GOOGLE_TRANSLATE_API_KEY` - required, server-side only
- `PORT` - optional, defaults to `3001`
- `TRANSLATION_RATE_LIMIT` - optional requests per minute, defaults to `30`

Never commit real secrets. The previously committed browser key should be rotated in Google Cloud because it must be treated as exposed.

## Local development

```bash
npm install
npm run dev
```

- Vite runs the client on `http://localhost:5173`
- Express runs the API on `http://localhost:3001`
- Vite proxies `/api/*` requests to the API server

## Production build

```bash
npm run build
npm start
```

`npm start` serves the built frontend from `dist/` and exposes the API from the same server.

## Quality checks

```bash
npm run lint
npm test
npm run build
```

## Security notes

- Keep translation credentials only in deployment secrets or local `.env` files.
- The API validates input length and applies rate limiting.
- CI scans for common hardcoded secret patterns before merging.

## Browser support

Speech recognition support depends on the browser Web Speech API implementation. Chrome-family browsers provide the best support for this demo.
