---
name: Inline legal PDFs
description: Why legal documents use pre-rendered page images instead of native PDF embeds or PDF.js.
---

Render each official legal PDF as ordered, high-resolution page images for the inline reader, while keeping the untouched original PDF as the downloadable file.

**Why:** Native embedded PDF viewers rendered correctly on desktop but appeared blank on mobile. PDF.js 6 was also unreliable in the preview browser because its worker requires `Math.sumPrecise`, which that Chromium runtime did not provide. Static page images preserve the exact visual formatting and work consistently across desktop and mobile.

**How to apply:** When an official legal PDF changes, regenerate every page image from that exact source PDF, update the declared page count, visually inspect representative first and last pages, and verify the original PDF download filename separately. Do not manually rewrite the legal text.