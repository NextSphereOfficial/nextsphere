# Verifica pubblica Google — NextSphere

Controlli eseguiti il **1 ottobre 2026, circa 12:22–12:25 UTC** su
`https://www.nextsphere.it/`. Nessuna modifica al sito, invio di sitemap,
richiesta di indicizzazione o pubblicazione.

## Risorse pubblicate

Richieste GET HTTPS dirette, senza autenticazione e senza seguire redirect:

| Risorsa | HTTP | Content-Type | Byte scaricati |
| --- | --- | --- | --- |
| `/` | 200 | `text/html; charset=utf-8` | 8.881 |
| `/sitemap.xml` | 200 | `application/xml` | 1.940 |
| `/robots.txt` | 200 | `text/plain; charset=utf-8` | 91 |
| `/media/nextsphere-demo-poster.jpg` | 200 | `image/jpeg` | 173.994 |
| `/media/nextsphere-demo.mp4` | 200 | `video/mp4` | 1.213.245 |

- Sitemap XML parsata correttamente: 7 URL, tutte su `https://www.nextsphere.it/`.
  Anche le altre sei pagine rispondono 200 senza redirect: `/pricing`, `/airbnb`,
  `/booking`, `/guida-digitale-ospiti`, `/privacy-policy`, `/cookie-policy`.
- Sitemap, robots, poster e MP4 pubblici sono identici byte per byte ai file locali.
- `robots.txt` consente `/`, esclude `/analytics` e indica
  `Sitemap: https://www.nextsphere.it/sitemap.xml`. Non blocca i media.
- Nessun header `X-Robots-Tag` nelle cinque risposte controllate.
- Una richiesta alla sitemap con User-Agent `Googlebot` restituisce 200.
  **È una richiesta simulata: non dimostra un accesso reale di Google.**
- Poster JPEG valido, 1920×1080. MP4 analizzato con ffprobe: video 1920×1080,
  durata effettiva 20 secondi, nessuna traccia audio.
- Richiesta MP4 con `Range: bytes=0-1023`: HTTP 206,
  `Content-Range: bytes 0-1023/1213245`.

## Dominio e canonical

- `HEAD https://nextsphere.it/` restituisce **308** con
  `Location: https://www.nextsphere.it/`.
- L'HTML iniziale della home dichiara `index, follow` e `og:url` su www.
- **L'HTML iniziale non contiene un link canonical.** Il canonical è gestito
  lato React: il bundle effettivamente pubblicato contiene sia
  `canonical:"https://www.nextsphere.it/"` per la home sia il rendering
  `rel:"canonical"`.
- Questo conferma il valore configurato nel bundle pubblico, non il DOM
  renderizzato da Google né il canonical scelto da Google. Quest'ultimo
  richiede l'ispezione URL in Search Console.

## VideoObject e sitemap video

L'HTML iniziale pubblico contiene un singolo VideoObject JSON-LD parsabile:

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Demo NextSphere: configurazione e risposta del chatbot AI",
  "description": "Video dimostrativo di 20 secondi, senza audio e in italiano: l'host inserisce gli orari di check-in e NextSphere risponde all'ospite usando quelle informazioni.",
  "thumbnailUrl": "https://www.nextsphere.it/media/nextsphere-demo-poster.jpg",
  "contentUrl": "https://www.nextsphere.it/media/nextsphere-demo.mp4",
  "uploadDate": "2026-10-01",
  "duration": "PT20S",
  "inLanguage": "it"
}
```

Nome, descrizione, poster, MP4 e durata coincidono con la voce video della home
nella sitemap. I quattro test locali in `src/seo.test.mjs` passano con:

```sh
node --test artifacts/nextsphere-site/src/seo.test.mjs
```

**La parsabilità e questi test non equivalgono a una validazione Google.**

## Tentativo con lo strumento pubblico Google

Aperto il [Rich Results Test con la home precompilata](https://search.google.com/test/rich-results?url=https%3A%2F%2Fwww.nextsphere.it%2F).
La cattura nel browser mostra:

> Something went wrong  
> Log in and try again

Il test **non ha restituito un risultato di validazione**. Non è possibile
affermare che Google abbia validato il VideoObject, trovato il player o
considerato la pagina idonea a risultati avanzati. Nessun aggiramento del login
o della verifica anti-automazione è stato tentato.

## Search Console: accesso non disponibile

La ricerca di un'integrazione per “Google Search Console sitemap URL inspection”
non ha restituito integrazioni. Nessun accesso autorizzato disponibile.

Restano pertanto **non verificati**:

- stato della sitemap, ultimo accesso e URL scoperti da Google;
- presenza della home nell'indice e canonical selezionato da Google;
- HTML renderizzato da Google e presenza del player;
- rilevamento e indicizzazione video, con eventuale motivo di esclusione.

Non è stata effettuata alcuna submission. Per chi dispone dell'accesso:
in Search Console controllare **Sitemap**, **Controllo URL** della home
(risultato indicizzato e test live), quindi **Indicizzazione video** e
l'eventuale rapporto dei risultati avanzati Video. Ripetere anche il Rich
Results Test in una sessione browser autorizzata. Il test live non prova da solo
che la pagina sia già indicizzata.

## Pagina indicizzabile ≠ video idoneo

I controlli pubblici confermano risorse raggiungibili e metadati coerenti,
non l'effettiva lettura o indicizzazione da parte di Google.

La demo resta in un overlay: il componente video viene montato solo dopo il
clic. Le [linee guida ufficiali Google sui video](https://developers.google.com/search/docs/appearance/video)
specificano di non dipendere da azioni dell'utente per caricare il video e,
per i risultati video, richiedono una pagina in cui il video sia il contenuto
principale. La home marketing con demo complementare aperta su richiesta
presenta quindi un limite concreto all'idoneità video, anche con VideoObject
e sitemap validi.

Non si deduce un'esclusione specifica senza Search Console; non si promettono
risultati o tempi. Non è stata creata una pagina demo né cambiato il caricamento.