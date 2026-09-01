---
name: SPA route scroll
description: How page-to-page navigation should reset the viewport in the NextSphere single-page app.
---

Page links in the footer must reset the window scroll immediately on click and again after the SPA route change; browser history scroll restoration should remain manual.

**Why:** A route-change effect alone briefly reset the viewport, but the browser later restored the previous footer-level position. This made newly opened pages appear unchanged, especially on mobile.

**How to apply:** Preserve anchor links that intentionally target homepage sections. For ordinary page links, use the shared page-top reset and keep the route-level post-navigation reset active.