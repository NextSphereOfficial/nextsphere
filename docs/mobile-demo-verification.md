# Verifica della demo su browser mobile

Data: 1 ottobre 2026.

## Esito

**Verifica della riproduzione mobile non eseguita: manca l'accesso a un
dispositivo/browser adatto.** Non è un risultato positivo né una prova di un
difetto del player.

L'ambiente di lavoro mette a disposizione Chromium 152.0.7977.64 su Linux.
Il limite del decoder H.264 di questo browser è già documentato in
`.agents/memory/browser-media-verification.md`; non è stato ripetuto un test
di riproduzione su tale decoder.

Non sono disponibili in questa sessione un iPhone con Safari, un dispositivo
Android con Chrome o un servizio collegato di test su dispositivi reali.
Un viewport mobile o uno user agent iPhone non dimostrerebbero il comportamento
del fullscreen nativo di Safari.

## Stato dei controlli richiesti

| Controllo | Safari su iPhone | Chrome su Android |
| --- | --- | --- |
| Riproduzione muta completa dei 20 secondi | Non verificato | Non verificato |
| Pausa e ripresa | Non verificato | Non verificato |
| Replay dopo la fine | Non verificato | Non verificato |
| Rotazione verticale/orizzontale durante la riproduzione | Non verificato | Non verificato |
| Ingresso in fullscreen e ritorno alla finestra | Non verificato | Non verificato |
| Leggibilità delle scritte durante la riproduzione | Non verificato | Non verificato |
| Comandi raggiungibili in finestra e fullscreen | Non verificato | Non verificato |
| Chiusura che arresta la riproduzione | Non verificato su dispositivo | Non verificato su dispositivo |
| Riapertura senza player duplicati | Non verificato su dispositivo | Non verificato su dispositivo |

Le precedenti verifiche di integrità, decodifica offline, consegna HTTP,
caricamento al clic, layout e teardown indicate nella richiesta non sono state
ripetute e non sostituiscono questi controlli sui dispositivi.

## Procedura da eseguire quando è disponibile un dispositivo

1. Annotare modello del dispositivo, versione del sistema operativo e browser.
2. Aprire l'anteprima del sito e la demo tramite il suo pulsante.
3. Controllare che il video sia muto e che riproduca tutti i 20 secondi.
4. Mettere in pausa a metà, verificare che il fotogramma resti fermo e riprendere.
5. Dopo la fine, avviare il replay e verificare che riparta dall'inizio.
6. Ruotare il dispositivo nei due orientamenti e controllare scritte e comandi.
7. Entrare in fullscreen, provare pausa/ripresa e uscire tornando alla finestra.
   Su iPhone usare il fullscreen nativo di Safari, non una sua simulazione.
8. Chiudere la demo mentre riproduce; riaprirla e verificare che esista un solo
   player e non continui una riproduzione precedente.
9. Ripetere i controlli per il filmato orizzontale e quello verticale usando i
   percorsi previsti dal sito; registrare separatamente eventuali problemi.

Non sono stati modificati o ricompressi i video approvati e non è stata
effettuata alcuna pubblicazione.