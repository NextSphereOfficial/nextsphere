---
name: Mobile video activation
description: First-touch playback constraints when mounting the demo inside a portal
---

Preserve the original opening gesture through lazy modal mounting and the first
native playback request. Set native mute/default-mute and inline properties
before that request rather than relying on eventual effects.

**Why:** The mobile demo was reported to require a second touch after appearing
to start on the first. Deferred mounting or playback can lose the gesture needed
by mobile media policies, especially on a cold opening.

**How to apply:** When changing the modal or player lifecycle, verify the first
play request occurs synchronously inside the original opening click, including
the portal's initial mount. Do not solve this by preloading before a click or
automatically retrying after an intentional pause or close. Distinguish this
integration check from actual Safari/device decoding verification.