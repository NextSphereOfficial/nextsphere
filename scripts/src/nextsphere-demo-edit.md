# NextSphere demo — edit notes

Rebuild from the repository root with:

```sh
node scripts/src/render-nextsphere-demo.mjs
```

Requires FFmpeg and the workspace's installed `@napi-rs/canvas`. Fonts and the
transparent light logo are existing brand assets. Intermediate images are
generated in `/tmp` and deleted after rendering; the source is never changed.
Output: 20 seconds, 1920 × 1080, 24 fps, muted H.264/yuv420p with faststart.

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