---
name: Cookiebot SPA bootstrap
description: Prevent Cookiebot automatic blocking from stopping the essential frontend application script.
---

When Cookiebot automatic blocking is enabled, explicitly exempt the essential SPA bootstrap script from consent blocking; do not exempt analytics or other optional tracking scripts.

**Why:** Cookiebot can neutralize an unclassified Vite entry script during development, leaving the app shell blank before React mounts.

**How to apply:** Keep the startup script marked as consent-ignored whenever Cookiebot's automatic blocking mode is active, while allowing Cookiebot to manage GA4 and all other non-essential scripts normally.

Verify the exemption in compiled HTML, not only in the source template.

**Why:** Vite reconstructs the production entry tag and can discard its custom
consent attribute, despite the development page working correctly.

**How to apply:** Preserve the exemption only for the actual compiled app entry
and include the built HTML in verification whenever changing tracking or builds.

The GTM loader is a separate, deliberate exception: follow Cookiebot's documented
order of denied Consent Mode defaults, exempted GTM loader, then Cookiebot outside
the container. This does not exempt actual GA4 scripts or arbitrary container tags.

**Why:** Automatic blocking can prevent the manager from loading, while Google
consent state and tag-level consent requirements govern the tags it manages.

**How to apply:** Keep existing standalone GA4 statistics-gated until an intentional
migration. Avoid adding the same GA4 property through both paths. Require consent
checks for non-Google tags in GTM; Consent Mode alone is not their consent gate.