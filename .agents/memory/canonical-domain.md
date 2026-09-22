---
name: Canonical domain
description: The official hostname to use for NextSphere SEO metadata and public URLs.
---

Use `https://www.nextsphere.it` as the canonical production origin in sitemap entries, robots references, canonical tags, Open Graph metadata, and structured data.

**Why:** Production permanently redirects the apex domain to `www`. Mixing apex sitemap/canonical URLs with `www` responses caused redirecting sitemap entries and contradictory indexing signals.

**How to apply:** New public routes and SEO metadata must use the `www` origin. Emit one route-specific canonical and no hreflang tags unless language variants later receive distinct URLs.