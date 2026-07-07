# Philin Solar Solutions

A business website for Philin Solar, a solar energy services provider. Includes a public-facing site (home, about, services, packages, gallery, news, contact) and an admin dashboard for managing news posts and gallery photos.

## Run & Operate

- `PORT=8080 pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `PORT=19063 BASE_PATH=/ pnpm --filter @workspace/philin-solar run dev` — run the frontend (port 19063)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Required Secrets (set in Secrets panel)

- `SESSION_SECRET` — signs admin session cookies; app refuses to start without it ✓ already set
- `ADMIN_USERNAME` — admin login username
- `ADMIN_PASSWORD` — admin login password
- `APP_FRONTEND_ORIGINS` (optional) — comma-separated full origins for custom frontends (e.g., `https://philsolar.onrender.com`). Used by CORS and storage hotlink protection.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS v4 + shadcn/ui
- API: Express 5, port 8080
- DB: PostgreSQL + Drizzle ORM
- Auth: signed cookies via `cookie-parser`

## Where things live

- `artifacts/philin-solar/src/` — React frontend (pages, components, routing via wouter)
- `artifacts/api-server/src/` — Express API (routes: `/api/admin`, `/api/news`, `/api/gallery`)
- `lib/db/src/schema/` — Drizzle ORM schema (`news_posts`, `gallery_photos` tables)
- `lib/db/drizzle.config.ts` — Drizzle config (reads `DATABASE_URL` from env)

## Architecture decisions

- `DATABASE_URL` is runtime-managed by Replit — never set manually
- Admin auth uses signed cookies; `SESSION_SECRET` is validated at startup
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` are required env vars — app refuses to start if missing
- Vite config uses `server.allowedHosts: true` for Replit's proxied iframe environment

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Both `PORT` and `BASE_PATH` must be passed when starting the philin-solar Vite dev server
- The api-server `dev` script runs a build step before starting — expect ~5s startup
