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