# Coinvolgimento demo

## Eventi e dati disponibili

Non sono stati aggiunti tracker. Gli eventi usano Vercel Analytics e la stessa
aggregazione API dei CTA, con chiavi `location` riservate nella tabella esistente.
Non servono migrazioni o nuovi endpoint.

| Significato | Evento Vercel | Proprietà | `location` nell'API |
| --- | --- | --- | --- |
| Sezione demo visibile almeno al 20%, una volta per montaggio della Home | `section_view` | `section: demo` | `demo_section_view` |
| Riproduzione effettivamente iniziata | `demo_video_start` | `mode`, `watch`, `format` | `demo_video_start_{mode}_{watch}` |
| Video arrivato a `ended` | `demo_video_complete` | le stesse proprietà dell'avvio | `demo_video_complete_{mode}_{watch}` |
| Clic sul CTA sotto la demo | `cta_click` | `location: demo` | `demo` |

Valori ammessi:
- `mode`: `auto` (autoplay) oppure `manual` (avvio tramite i controlli).
- `watch`: `initial` per il primo avvio effettivo del componente; `replay` per
  ogni nuovo avvio da zero dopo una riproduzione già iniziata. Sono inclusi
  Replay, Play dopo la fine, Riprova dopo un errore e cambio sorgente/formato.
- `format`: `landscape` o `portrait`, disponibile in Vercel; l'API aggrega i formati insieme.

Una pausa/ripresa, buffering, fullscreen e ripetizioni di `playing` non creano
nuovi avvii. Il completamento mantiene il modo del primo avvio di quella
visione: una ripresa manuale di un autoplay non diventa un avvio manuale.
Un Replay mentre il video sta già andando apre una nuova visione; non completa
quella abbandonata. Un clic senza riproduzione riuscita non conta come avvio.

## Consenso e privacy

La demo verifica `Cookiebot.consent.statistics === true` prima di ogni invio.
Durante il caricamento di Cookiebot o con consenso mancante/rifiutato non invia
eventi. Solo in assenza di Cookiebot e del relativo script usa il consenso del
banner legacy. La revoca vale subito, anche durante la riproduzione.

Non vengono accodati eventi da inviare dopo l'accettazione. Un video avviato
senza consenso non genera un completamento isolato se il consenso arriva dopo:
serve un nuovo avvio. Se il consenso arriva mentre la sezione è ancora visibile,
può essere registrata la visualizzazione corrente, senza recuperare quelle passate.

I payload contengono solo valori fissi, nessun ID di visitatore/sessione, email,
URL, UTM o testo libero. La richiesta all'aggregatore omette cookie e referrer;
per le chiavi demo l'API non salva session ID né user-agent. Vercel conserva
il proprio normale modello di raccolta; non vengono aggiunti identificatori.
Caricamento differito, autoplay, reduced motion e controlli restano invariati.

## Come leggere i risultati

In Vercel Analytics confrontare **nello stesso intervallo di tempo e con gli
stessi filtri**:
1. `section_view` filtrato su `section = demo` (esposizione della sezione).
2. `demo_video_start`, separando `mode` e `watch`.
3. `demo_video_complete`, con gli stessi filtri.
4. `cta_click` filtrato su `location = demo`.

Nell'API già esistente:
- `GET /api/analytics/cta`: totali storici per `location`.
- `GET /api/analytics/cta/timeseries`: conteggi giornalieri negli ultimi 30 giorni.
  Sommare le righe delle date desiderate e le chiavi corrispondenti. Le date
  seguono il fuso orario del database, non necessariamente quello del report Vercel.
- La dashboard CTA esistente esclude `demo_section_view` e `demo_video_*` da
  totali e grafici di clic, mantenendo invece `demo` come vero CTA.
  Per i nuovi contatori usare le risposte API o i filtri Vercel.

Esempio di tassi aggregati, evitando la divisione per zero:
- completamento prima visione = somma `demo_video_complete_*_initial` /
  somma `demo_video_start_*_initial`;
- completamento manuale = `demo_video_complete_manual_initial` /
  `demo_video_start_manual_initial`;
- completamento autoplay = `demo_video_complete_auto_initial` /
  `demo_video_start_auto_initial`;
- clic CTA rispetto all'esposizione = conteggio `demo` / `demo_section_view`.
Analizzare i replay a parte: non sommarli alle prime visioni per gonfiare il
numero di persone coinvolte.

Questi sono conteggi di eventi/visioni, **non persone uniche né un funnel
individuale**: niente ID collega i passaggi. Un nuovo montaggio della Home
(navigazione o reload) ricomincia la prima visione. I clic possono ripetersi,
avvenire senza completamento o senza avvio. Consenso, ad blocker, invii falliti
e confini dell'intervallo (avvio ieri, fine oggi) possono alterare i rapporti.
Non confrontare numeratori API con denominatori Vercel: le consegne e i filtri
possono differire. `ended` indica la fine della riproduzione, non prova che una
persona abbia prestato attenzione a ogni secondo o non abbia saltato nel video.

Vercel può usare i filtri di sorgente/campagna già disponibili nel servizio.
L'API non registra l'attribuzione delle campagne. Il clic CTA è un'uscita verso
la piattaforma: **non** certifica iscrizione, registrazione o acquisto su di essa.
Nessuna conversione esterna viene inventata.

I nuovi eventi saranno disponibili solo dopo il rilascio del codice frontend
su Vercel e del codice API nel servizio già usato dal rewrite. Non recuperano
visioni storiche.

## Verifica locale

`node --test artifacts/nextsphere-site/src/lib/demoWatchSession.test.ts`

I test eseguono la logica reale di deduplicazione e il controllo del consenso:
autoplay/manuale, pause/riprese, replay, errori, cambio sorgente, consenso
tardivo e revoca.