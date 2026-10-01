---
name: Deployment pipeline
description: How nextsphere-site is deployed to production
---

## Pipeline
Replit (main branch) → GitHub (NextSphereOfficial/nextsphere) → Vercel auto-deploy on push to main → nextsphere.it

## Key config fixes applied
- vite.config.ts: PORT and BASE_PATH made optional (fallback to 3000 and '/') — required because Vercel doesn't inject these during build
- vite.config.ts: outDir changed from `dist/public` to `dist` — Vercel expects output at `dist` for Vite projects

## Vercel project
- Name: nextsphere-nextsphere-site
- Root directory: artifacts/nextsphere-site
- Team: NextSphere's projects (Hobby)

## DNS (Aruba → nextsphere.it)
- A record: @ → 216.198.79.1
- CNAME: www → cdc25f2ac7343d38.vercel-dns-017.com.
- Removed: old A @ 31.11.36.56, A www 31.11.36.56, AAAA @ and www records

**Why:** BASE_PATH defaults to '/' on Vercel (no subpath routing), PORT is only needed for dev server.

## Media authoring versus website builds

Keep FFmpeg media rendering separate from the website's production build; do not
make the static site's build depend on tools installed only in the Replit workspace.

**Why:** Media is authored in Replit, but this site's production build runs on
Vercel. Replit's available editing tools are not a guarantee about the Vercel builder.

**How to apply:** Render and retain the exported files before building the website.
If the website needs to inspect an export, use Node-only build logic rather than
invoking a workspace media tool. Keep future vertical/landscape integrations within
that boundary.
