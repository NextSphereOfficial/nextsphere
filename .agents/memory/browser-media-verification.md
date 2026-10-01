---
name: Browser media verification
description: Distinguishing test-browser codec limitations from real media or player failures
---

Check the verification browser's codec capabilities before diagnosing MP4
playback as broken. Generic MP4 support does not establish H.264 support.

**Why:** The automated Chromium browser used in this workspace reported possible
MP4 support but no support for the approved H.264 codec. It rejected valid videos
as unsupported streams even though byte-range delivery and complete offline
decoding succeeded. This is not a reason to modify approved source media.

**How to apply:** When playback fails, separate browser codec support, HTTP media
delivery, file integrity, and player lifecycle. Confirm the specific codec with
the browser's media capabilities rather than assuming support from its name.
Where decoding is unavailable, verify layout, network loading and cleanup, check
the file independently, and explicitly disclose the remaining playback-test gap.

For opening-gesture probes, compare the active native event with the captured
opening event; do not clear a capture-phase flag in a microtask and interpret its
absence as proof that playback escaped the click.

**Why:** Chromium ran the clearing microtask between capture and React's bubbling
listener. That produced a false failure even while the native play request still
had the same opening event active in bubbling phase.

**How to apply:** Use active event identity, event phase, target and call-stack
evidence to distinguish synchronous opening playback from later async work.