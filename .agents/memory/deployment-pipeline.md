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
