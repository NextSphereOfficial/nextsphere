---
name: Cookiebot SPA bootstrap
description: Prevent Cookiebot automatic blocking from stopping the essential frontend application script.
---

When Cookiebot automatic blocking is enabled, explicitly exempt the essential SPA bootstrap script from consent blocking; do not exempt analytics or other optional tracking scripts.

**Why:** Cookiebot can neutralize an unclassified Vite entry script during development, leaving the app shell blank before React mounts.

**How to apply:** Keep the startup script marked as consent-ignored whenever Cookiebot's automatic blocking mode is active, while allowing Cookiebot to manage GA4 and all other non-essential scripts normally.