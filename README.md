# Tondara Tindi V2

A responsive Indian recipe app prototype with a traditional warm kitchen theme.

## Features
- Search, cuisine/diet filters, and per-recipe budget filtering
- Ingredient inventory stored in browser localStorage
- Favourites and shopping list persisted locally
- Step-by-step cooking mode
- AI Chef API route (OpenAI-compatible chat completions; API key stays server-side)
- Seed recipe collection, including Indian home-style dishes

## Run locally
1. Install Node.js 18+.
2. In this folder run: `npm install`
3. Copy `.env.example` to `.env` and add an API key to enable AI recipe generation.
4. Run: `npm run dev`
5. Open the Vite address printed in the terminal (usually http://localhost:5173).

The API server runs on port 8787. Vite proxies `/api` to it.

## Production
Run `npm run build`, then set `NODE_ENV=production` and run `npm start`.

## Deploy publicly
See `DEPLOY-RENDER.md` and `render.yaml` for deployment on Render.

## Notes
- The AI feature requires an OpenAI API key and network access. No key is included.
- Inventory, favourites and shopping list are local to the browser, not cloud accounts.
- Prices are illustrative estimates, not current market prices.
