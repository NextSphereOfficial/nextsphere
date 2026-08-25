---
name: Cookiebot SPA declaration
description: Lifecycle rules for loading Cookiebot's Cookie Declaration in the React single-page app.
---

Cookiebot’s declaration script (`cd.js`) is not the final declaration response: it creates a second `cdreport.js` request and both stages share a fixed `window.CookieDeclaration` singleton. In the SPA, serialize declaration loads, regard the declaration as ready only after `InjectCookieDeclaration` runs, and keep a visible error path for a missing/failed report.

**Why:** Treating the first script’s `load` event as success can leave users with a blank policy. Starting another load during a language or route transition lets a delayed report write through the global singleton into the newer page state.

**How to apply:** Keep the declaration integration as the only owner of the external scripts. When it unmounts, make the previous injector inert and let its report settle before launching the next declaration request. Do not replace the generated cookie list with hand-authored fallback rows.