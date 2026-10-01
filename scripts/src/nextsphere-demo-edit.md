# NextSphere demo — edit notes

Rebuild from the repository root with:

```sh
node scripts/src/render-nextsphere-demo.mjs
```

Requires FFmpeg and the workspace's installed `@napi-rs/canvas`. Fonts and the
transparent light logo are existing brand assets. Intermediate images are
generated in `/tmp` and deleted after rendering; the source is never changed.
Output: 20 seconds, 1920 × 1080, 24 fps, muted H.264/yuv420p with faststart.
Source crops are enlarged using Lanczos and a restrained luminance sharpening
filter; canvas sampling uses high quality and final H.264 uses CRF 18. This
improves edge clarity and preserves more detail, but does not invent missing
characters or recover detail absent from the recording.

## Timeline

| Film | Source | Purpose |
| --- | --- | --- |
| 0–2 s | Guest bubble at 148 s | Begin with the guest's everyday question. |
| 2–4.5 s | Module chooser at 20 s | Show real guided configuration. |
| 4.5–9 s | Actual typing, 33–42 s at 2× | Show the host writing check-in information. |
| 9–10.75 s | Configured field at 42 s | Hold on 15:00–20:00 and the original input. |
| 10.75–12.25 s | Guest bubble at 148 s | Connect the configuration to the question. |
| 12.25–17 s | Real answer at 148 s | Show the exact reply and emphasize matching hours. |
| 17–20 s | Brand end card | “Le tue informazioni. Le sue risposte.” |

The conversation bubbles are enlarged crops of the recording, not redrawn text.
The typing is accelerated; the film does not imply a measured setup or response
time. Freeze frames provide reading time and prevent distracting mouse motion.
No Google Places warning, personal credentials, recording tools or fabricated QR
scanning appear. Extra platform features are omitted to keep one clear example.

The film is intentionally in Italian. The website's explanatory copy and accessible
transcript are available in both site languages.

## Website format selection

The site build checks actual MP4 track dimensions in `public/media` through
`artifacts/nextsphere-site/demoMedia.ts`. An existing portrait NextSphere demo
is exposed to the player through build-time metadata; files that are still being
rendered or are absent never become video sources. Detection needs no FFmpeg
on the production build host. This supports the independently produced vertical
export without rebuilding that task's film here.

The home opens a single modal player from the hero or compact `#demo` teaser.
No video element or MP4 request exists until the user opens it. At opening, screens
below 640 px select the detected portrait video; larger screens select landscape.
The source remains fixed for that opening even when the device rotates. If no
portrait export is present in the build, the landscape remains available without
requests to missing files. Rebuild/restart after adding an export.
In development a debounced media watcher refreshes Vite automatically when a
complete portrait export/poster is added by the independent video task. A matching
`<movie-stem>-poster.jpg`, `.png` or `.webp` is selected when present.

The approved vertical export and poster are copied byte-for-byte from `exports`
to `public/media` so both formats are actually served. No media rendering happens
during the website build.

`object-contain` preserves every pixel and fullscreen keeps playback controls
available; iPhone/iPad can use the native video fullscreen API. Explicit opening
requests muted playback, with a manual-play fallback when the browser blocks it.
There is no viewport-triggered autoplay, including for reduced-motion visitors.
Closing unmounts the player, pauses the video and releases its source; reopening
starts a fresh run, preserving replay classification within the loaded page.