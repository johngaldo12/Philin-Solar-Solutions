---
name: Cross-platform origin config
description: Use a single env var to configure trusted frontend origins for CORS and storage hotlink protection on non-Replit platforms.
---

The project originally derived allowed CORS origins and storage referer allowlists from Replit-specific env vars (`REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`). When deploying elsewhere (e.g., Render), those env vars are empty, so API calls and uploaded images can be blocked.

**Why:** Hardcoding platform-specific env vars makes the code fragile across hosts. A single, explicit `APP_FRONTEND_ORIGINS` variable lets the same build run on Replit and Render without source changes.

**How to apply:**
- Add `APP_FRONTEND_ORIGINS` as a comma-separated list of full origins, e.g. `https://philsolar.onrender.com`.
- Parse and normalize the value at startup with `new URL(...).origin` and fail fast on invalid entries.
- Reuse the same parsed origin set for both the CORS middleware and any storage hotlink-protection checks.
- In production, require a trusted origin/referer for storage object routes; in development, allow missing headers for local testing.
