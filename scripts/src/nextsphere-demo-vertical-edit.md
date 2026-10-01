# NextSphere — demo verticale

Render riproducibile, dalla radice del repository:

```sh
node scripts/src/render-nextsphere-demo-vertical.mjs
```

Output separati, non collegati alla home:
- `exports/nextsphere-demo-vertical.mp4`
- `exports/nextsphere-demo-vertical-poster.jpg`

1080 × 1920, 9:16, 20 secondi, 30 fps, H.264/yuv420p, faststart, senza
audio. Pensato per essere comprensibile anche senza audio. Usa FFmpeg,
la copia già installata di `@napi-rs/canvas`, i font e il logo NextSphere.

## Montaggio

| Film | Registrazione originale | Contenuto |
| --- | --- | --- |
| 0–2,5 s | Chat a 148 s | Domanda reale dell’ospite, ingrandita |
| 2,5–5 s | Configurazione a 20 s | Selezione reale dei moduli |
| 5–9,5 s | Digitazione a 33–42 s, 2× | Campo check-in reale, ritaglio dedicato |
| 9,5–11 s | Configurazione a 42 s | Valore inserito e richiamo 15:00–20:00 |
| 11–17 s | Chat a 148 s | Domanda, risposta completa e dettaglio degli orari |
| 17–20 s | Cartello finale | Le tue informazioni. Le sue risposte. |

La risposta completa e il dettaglio della prima frase sono ritagli di pixel
originali, non una chat ricostruita. Il grande richiamo degli orari è una
didascalia editoriale distinta dalla UI reale. I fermo immagine consentono la
lettura; la digitazione accelerata non promette tempi di configurazione o risposta.

Composizione verticale dedicata, non un ritaglio centrale o un video orizzontale
con bande. Testi, logo e UI principali fra x=88–938 e y=215–1558: margini
ampi sopra, sotto e a destra per i controlli social. Verificare comunque
l’anteprima del posizionamento scelto prima di una campagna: le sovrapposizioni
dipendono dalla piattaforma. Nessun annuncio viene pubblicato da questo script.

Originale, renderer orizzontale, video/poster della home e codice del sito
restano invariati. I file temporanei vengono rimossi al termine del render.