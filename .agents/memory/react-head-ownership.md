---
name: React head ownership
description: Helmet 3 and React 19 native metadata ownership during SPA navigation
---

Do not use absence of `data-rh` as proof that a head tag belongs to the static
HTML shell. Helmet 3 on React 19 renders native hoisted metadata without the
legacy ownership marker.

**Why:** Removing supposedly unmanaged tags from a page effect deleted
React-owned head nodes. Route unmounts then crashed inside React's native
metadata removal with a null-parent `removeChild` error, leaving the URL and
visible page out of sync.

**How to apply:** Remove superseded static page metadata once before React
mounts. Leave subsequent head-node creation and removal to React/Helmet. When
changing head management, check client-side navigation, not just direct loads.
