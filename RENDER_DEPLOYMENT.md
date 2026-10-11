# Deploy the Philin Solar website to Render

This setup hosts the static React/Vite website on Render while keeping the API, PostgreSQL data, and uploaded images on Replit. It does not copy or migrate database records or image files.

## Before you start

The Replit development preview is not a stable public API endpoint. Publish the Replit app/API first and confirm that its public URL can load. During the first Replit publish, explicitly choose the option to copy development database data if you want the existing news and gallery records in the published API's production database; production data is separate by default. Replit App Storage is shared between development and production for the same app.

- `https://YOUR-REPLIT-API-HOST/api/healthz`
- `https://YOUR-REPLIT-API-HOST/api/news`
- `https://YOUR-REPLIT-API-HOST/api/gallery`

Use the public production host, not a `.replit.dev` preview URL. The API base URL is the origin only; do not add `/api` at the end.

## 1. Create the Render Static Site

1. Push this project to GitHub.
2. In Render, choose **New → Static Site** and connect the repository.
3. Leave **Root Directory** blank so Render uses the repository root and can see the pnpm workspace.
4. Set the build command to:

   ```sh
   corepack enable && pnpm install --frozen-lockfile && pnpm --filter @workspace/philin-solar run build
   ```

5. Set **Publish Directory** to:

   ```text
   artifacts/philin-solar/dist
   ```

6. Add the single-page-app rewrite `/*` → `/index.html`. The included `render.yaml` supplies these build, publish, and rewrite settings if you create the service from the Blueprint.

When using the Blueprint, Render will prompt for `VITE_API_BASE_URL`; enter the published Replit API origin from the previous section.

## 2. Point the website at the Replit API

After Render creates the site, open its **Environment** settings and add:

```text
VITE_API_BASE_URL=https://YOUR-REPLIT-API-HOST
```

Use the production API origin with no trailing slash and no `/api` path suffix. Save the variable and trigger a new deploy; Vite embeds this value during the build.

## 3. Allow the Render site to call the Replit API

Copy the exact HTTPS origin Render assigned to the site, for example `https://philin-solar-site.onrender.com`. In the Replit API's production environment, set the non-secret variable:

```text
CORS_ALLOWED_ORIGINS=https://YOUR-RENDER-SITE
```

Use the exact origin only (no path and no trailing slash). If using a custom domain, list that origin instead. Keep the existing Replit origins; this setting adds the Render origin to the allowlist. Republish/restart the API after changing it.

## 4. Admin login and image uploads

The public pages, news, and gallery use the Replit API. Gallery uploads still request a signed upload URL from that API, send image bytes to Replit App Storage, and save the photo record in the existing database.

The admin login uses a signed cookie. The most reliable setup is to use a custom domain on the same parent domain for the Render site and Replit API (for example, `www.example.com` and `api.example.com`) and add the exact site origin to `CORS_ALLOWED_ORIGINS`.

If using Render's `onrender.com` domain with a Replit `replit.app` API domain, set this non-secret Replit API variable:

```text
ADMIN_COOKIE_SAME_SITE=none
```

The API sets cookies as `Secure` in production. Some browsers block third-party cookies even with `SameSite=None`, so admin login may still fail on unrelated domains; public pages can continue working. Use same-parent custom domains for dependable admin sessions.

After deployment, test `/`, `/news`, `/gallery`, `/admin/login`, and a gallery image upload. If the upload URL is returned but the browser blocks the direct signed upload to storage, check the browser console for a storage CORS error.

## What stays on Replit

- News and gallery records stay in the existing PostgreSQL database.
- Uploaded image files stay in Replit App Storage.
- The Replit API must remain published and available; the Render site depends on it.
- Keep `SESSION_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` in Replit Secrets. Do not put them in Render or in this repository.
