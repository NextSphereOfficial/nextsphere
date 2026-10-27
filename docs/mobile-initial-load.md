# JavaScript iniziale su mobile

## Misura riproducibile

Confronto eseguito sullo stesso ambiente e con lo stesso comando di build:

```sh
pnpm --filter @workspace/nextsphere-site exec vite build --config vite.config.ts --manifest
pnpm --filter @workspace/nextsphere-site measure:initial-js
pnpm --filter @workspace/nextsphere-site test:bundle
```

Il metodo legge il manifest di produzione e somma l'entry JavaScript **e tutte
le sue dipendenze statiche ricorsive**, una sola volta per file. La colonna gzip
somma la compressione di ciascun file con `node:zlib.gzipSync`, livello 9.
Prima della modifica è stato applicato lo stesso algoritmo al manifest originale.
Non si confronta quindi il vecchio monolite con il solo nuovo file `index`.

| Metrica | Prima | Dopo | Riduzione |
| --- | ---: | ---: | ---: |
| JS necessario alla home, byte | 1.059.743 | 592.100 | 44,13% |
| JS necessario alla home, gzip byte | 310.398 | 188.550 | 39,26% |
| Chunk JS oltre 500 kB | 1 | 0 | |
| Chunk JS più grande, byte | 1.059.743 | 380.192 | |

I kB sono decimali. Il gzip del log standard di Vite usa impostazioni diverse:
non mescolare quel valore con il confronto a livello 9 riportato qui.

Il report prima conteneva un solo file: `index-Bd3ku0d8.js`.
Il report dopo include:

| Chunk iniziale | Byte | Gzip byte |
| --- | ---: | ---: |
| index-CZl_pe0y.js | 270.841 | 85.312 |
| react-vendor-Y90Kid3S.js | 185.665 | 58.370 |
| motion-vendor-CPS33J8f.js | 134.984 | 44.452 |
| _commonjsHelpers-Cpj98o6Y.js | 236 | 179 |
| clsx-B-dksMZM.js | 374 | 237 |

Gli hash possono cambiare con i build futuri; lo script ricalcola il grafo dal
manifest senza dipendere da questi nomi.

## Cosa cambia e cosa resta invariato

- Le pagine secondarie, compresa `/analytics`, si caricano alla visita. I grafici
  e le loro dipendenze non fanno parte del grafo iniziale della home.
- React e le animazioni hanno chunk riutilizzabili; non è stato creato un unico
  vendor globale che trascinerebbe nuovamente i grafici nel caricamento iniziale.
- Home, overlay e player della demo restano importati staticamente. Nessun
  download JavaScript è stato aggiunto tra il tap e la richiesta di playback;
  il percorso esistente con `flushSync` e il layout effect del player è intatto.
- Durante il caricamento rimangono disponibili navigazione, footer e lingua.
  Un errore di download mostra un messaggio IT/EN e un comando di ricarica;
  cambiare percorso permette di uscire dall'errore.
- Il contesto lingua resta sopra i confini di caricamento. Il bootstrap compilato
  conserva `data-cookieconsent="ignore"`; GA4 resta subordinato alle statistiche.
  Il ciclo di vita della dichiarazione Cookiebot non è stato modificato.
- Nessuna modifica al preload dei font, ai video, alle policy o ai testi commerciali.

## Verifiche

- Build di produzione e typecheck del sito superati.
- `test:bundle`: budget su tutto il grafo iniziale, pagine secondarie dinamiche,
  chunk sotto 500 kB, esenzione Cookiebot nell'HTML compilato e import eager
  del player superati.
- Test di consenso Cookiebot e Tag Manager superati.
- Due regressioni sulla pulizia dei metadati statici superate. La verifica browser
  ha fatto emergere una rimozione di nodi head di React: Helmet 3 con React 19
  non usa il vecchio marcatore `data-rh`. La pulizia ora avviene una sola volta
  prima del mount di React, non durante gli effetti delle pagine.
- Browser sul build compilato, viewport 390×844: home senza chunk analytics,
  primo `play()` nello stesso evento click (fase bubbling, attivazione utente
  presente, muted/defaultMuted/playsInline impostati), nessun nuovo import al
  tap e chiusura della demo verificati. Chromium non supporta il codec H.264
  del video: non è una prova di decodifica su telefono.
- Dopo la correzione head: Home → Prezzi → Home, cambio IT/EN e persistenza
  dopo reload verificati. Titolo, descrizione e canonical corretti e univoci
  dopo il rendering. Cookie Policy caricata e `/analytics` con accesso separato,
  senza navbar/footer, verificati.
- Interruzione intenzionale del download del chunk Prezzi: errore IT leggibile,
  comando di ricarica presente e ritorno alla home funzionante. Il comando
  di ricarica non è stato premuto durante l'interruzione simulata.
- Il dominio locale del browser non è autorizzato da Cookiebot: configurazione
  esterna 404 e avviso di dichiarazione non disponibile. Questo limita la
  verifica del banner/dichiarazione reali, non il caricamento delle route.
- La suite SEO esistente ha un'asserzione non aggiornata: la lista attesa della
  sitemap non include `/about`, già presente prima di questo intervento.
  Gli altri tre test della suite SEO passano; sitemap e lista attesa non sono
  state modificate da questo lavoro.

## Limiti della misura

È una misura del payload JavaScript di produzione, non di LCP, INP o dei secondi
risparmiati su un telefono. Esclude CSS, immagini, media, font, script esterni e
import dinamici non richiesti dalla home. Le impostazioni di compressione del
server reale possono differire. Il totale JavaScript di tutte le pagine non è
l'obiettivo: viene scaricato meno codice prima che un visitatore ne abbia bisogno.

La verifica della prima chiamata `play()` nel gesto utente non equivale a una
prova su Safari/iPhone reale; vedere anche `mobile-demo-verification.md`.
