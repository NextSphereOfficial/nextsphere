import { PRIVACY_POLICY_DATE } from './privacyPolicyDate';

// Use Date.UTC so the date is always interpreted in UTC, then pin timeZone: 'UTC'
// in the formatter — this prevents the month from shifting for users west of UTC.
const _privacyDate = new Date(Date.UTC(PRIVACY_POLICY_DATE.year, PRIVACY_POLICY_DATE.month - 1, 1));
const privacyLastUpdatedEN = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(_privacyDate);
const privacyLastUpdatedIT = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(_privacyDate);

export const translations = {
  en: {
    // Meta tags (per-page SEO)
    'meta.home.title': 'NextSphere | AI Chatbot for B&Bs & Holiday Rentals — 24/7 Answers',
    'meta.home.description': 'NextSphere is the AI chatbot for B&B and vacation rental hosts. Guests scan a QR code and get instant 24/7 answers in their language. Zero effort for you.',
    'meta.privacy.description': 'NextSphere Privacy Policy — how we collect, use and protect your personal data.',
    'meta.cookie.description': 'NextSphere Cookie Policy — what cookies we use and how to manage them.',

    // Navbar
    'nav.startFreeTrial': 'Start free trial',
    'nav.howItWorks': 'How it works',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    
    // Hero
    'hero.badge': 'The silent concierge for your property',
    'hero.title': 'Hours back. Guests delighted. Always.',
    'hero.subtitle': 'NextSphere answers every guest question — automatically. No more midnight calls, no more repetitive emails. Just happy guests and free time for you.',
    'hero.cta.primary': 'Start your free trial',
    'hero.cta.secondary': 'How it works',
    
    // How it works
    'howItWorks.title': 'Effortless to set up, invisible to manage.',
    'howItWorks.step1.title': 'Guided onboarding',
    'howItWorks.step1.desc': 'Enter your property details and configure your AI assistant in minutes. We handle the complexity.',
    'howItWorks.step2.title': 'QR code ready',
    'howItWorks.step2.desc': 'Place the elegant QR code in your property. No app downloads required for your guests.',
    'howItWorks.step3.title': 'Guests chat 24/7',
    'howItWorks.step3.desc': 'Guests get instant answers to their questions, day or night, in any language.',
    
    // Features
    'features.title': 'Everything you need to deliver a premium stay.',
    'features.f1.title': 'Available 24/7',
    'features.f1.desc': 'Never miss a guest query, even while you sleep.',
    'features.f2.title': '100% Customizable',
    'features.f2.desc': 'Tailor responses to match your exact house rules and local recommendations.',
    'features.f3.title': 'Instant QR Code',
    'features.f3.desc': 'Ready to print and place immediately after setup.',
    'features.f4.title': 'No Guest App',
    'features.f4.desc': 'Guests just scan and chat directly in their browser.',
    'features.f5.title': 'Multi-language',
    'features.f5.desc': 'Automatically converses fluently in the guest\'s native language.',
    'features.f6.title': 'Reduces Calls',
    'features.f6.desc': 'Eliminate repetitive questions about Wi-Fi, checkout, and parking.',
    
    // Pricing
    'pricing.title': 'Simple pricing for every property.',
    'pricing.subtitle': 'Premium features included in every tier.',
    'pricing.tier1': '1 apartment',
    'pricing.tier2': '2–3 apartments',
    'pricing.tier3': '4–6 apartments',
    'pricing.tier4': '7–10 apartments',
    'pricing.tier5': '10+ apartments',
    'pricing.cad': 'each',
    'pricing.month': '/ month',
    'pricing.badge': '14-day free trial · No credit card required',
    'pricing.cta': 'Start free trial',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'Is it hard to set up?',
    'faq.a1': 'Not at all. The guided onboarding takes less than 10 minutes. You just answer a few questions about your property, and the AI builds your knowledge base automatically.',
    'faq.q2': 'Do I need to be online for it to work?',
    'faq.a2': 'No, NextSphere works entirely on its own, 24/7. You can sleep peacefully while it answers guest questions.',
    'faq.q3': 'Does it work for any type of property?',
    'faq.a3': 'Yes! It is perfectly tailored for B&Bs, vacation rentals, apartments, and boutique hotels.',
    'faq.q4': 'Does the chatbot answer in multiple languages?',
    'faq.a4': 'Yes, the AI automatically detects the guest\'s language and replies natively, supporting over 30 languages flawlessly.',
    'faq.q5': 'What happens after the 14-day trial?',
    'faq.a5': 'You can choose the plan that fits your number of properties. If you decide not to continue, your QR code will simply stop working—no unexpected charges.',
    'faq.q6': 'Can I edit the chatbot\'s responses?',
    'faq.a6': 'Absolutely. You have full control over the knowledge base and can update house rules, Wi-Fi passwords, or recommendations at any time.',
    
    // Final CTA section
    'cta.stat1': 'always on',
    'cta.stat2': 'languages',
    'cta.stat3': 'to set up',
    'cta.final.title': 'Ready to reclaim your time?',
    'cta.final.subtitle': 'Set up in under 10 minutes. Your guests get instant answers from day one — no calls, no emails, no stress.',

    // Footer & Legal
    'footer.tagline': 'Hosting, reimagined.',
    'footer.nav.product': 'Product',
    'footer.nav.howItWorks': 'How it works',
    'footer.nav.features': 'Features',
    'footer.nav.pricing': 'Pricing',
    'footer.nav.faq': 'FAQ',
    'footer.nav.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.cookie': 'Cookie Policy',
    'footer.rights': '© 2026 NextSphere. All rights reserved.',
    
    'cookieBanner.text': 'We use cookies to improve your experience.',
    'cookieBanner.accept': 'Accept',
    'cookieBanner.reject': 'Reject',
    
    // ─── PRIVACY POLICY MAINTENANCE CHECKLIST ────────────────────────────────
    // When you add any data-collecting feature, update the relevant sections
    // below AND bump PRIVACY_POLICY_DATE in ./privacyPolicyDate.ts.
    //
    // Feature → sections to revisit:
    //   User accounts / authentication  → h1 (controller contact), h2 (data collected),
    //                                     h3 (purpose), h4 (retention), h5 (rights)
    //   Contact form / email capture    → h2 (data collected), h3 (purpose), h4 (retention)
    //   Payment processing              → h2 (data collected), h3 (purpose), h4 (retention),
    //                                     new section for third-party processors (e.g. Stripe)
    //   Third-party analytics tool      → h2 (data collected), h3 (purpose), cookie policy h4
    //   Guest chatbot data              → h2 (data collected), h3 (purpose), h4 (retention)
    //   Marketing emails / newsletter   → h2 (data collected), h3 (purpose), h4 (retention),
    //                                     h5 (add right to unsubscribe / opt-out)
    // ─────────────────────────────────────────────────────────────────────────

    // Legal Pages
    'legal.privacy.title': 'Privacy Policy',
    'legal.privacy.lastUpdated': `Last updated: ${privacyLastUpdatedEN}`,
    'legal.privacy.p1': 'This Privacy Policy describes how NextSphere ("we", "us", or "our") collects, uses, and shares your personal information when you use our website and services.',
    // h1 — revisit if company name, address, or DPO contact changes
    'legal.privacy.h1': '1. Data Controller',
    'legal.privacy.h1.text': 'The data controller is NextSphere. You can contact us at info@nextsphere.it.',
    // h2 — revisit whenever a new category of personal data is collected (accounts, forms, payments, etc.)
    'legal.privacy.h2': '2. Data Collected',
    'legal.privacy.h2.text': 'We store your language preference locally in your browser (localStorage). This data is never transmitted to our servers. If you accept our cookie banner, we may also collect anonymized usage analytics to help us understand how visitors use the site.',
    // h3 — revisit if the purpose of processing expands (e.g. marketing, profiling)
    'legal.privacy.h3': '3. Purpose of Processing',
    'legal.privacy.h3.text': 'We use analytics data solely to improve our website and services. We do not sell your data to third parties.',
    // h4 — revisit if retention periods change or new data stores are introduced
    'legal.privacy.h4': '4. Data Retention',
    'legal.privacy.h4.text': 'Language preference data is stored only in your browser\'s localStorage and can be cleared at any time by clearing your browser data. Analytics cookies, if accepted, are retained in accordance with our Cookie Policy.',
    // h5 — revisit if new rights apply (e.g. right to object to automated decisions, right to unsubscribe)
    'legal.privacy.h5': '5. Your Rights',
    'legal.privacy.h5.text': 'Under GDPR (Articles 15-20), you have the right to access, rectify, erase, or port your personal data. You may withdraw your consent to analytics cookies at any time via the cookie banner or by clearing your browser data. To exercise your rights, please contact privacy@nextsphere.it.',
    
    'legal.cookie.title': 'Cookie Policy',
    'legal.cookie.p1': 'Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and allows us to improve our site.',
    'legal.cookie.h1': '1. What are cookies?',
    'legal.cookie.h1.text': 'A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree.',
    'legal.cookie.h2': '2. Cookies we use',
    'legal.cookie.h2.text': 'We use technical cookies (essential for session management, language preferences, and remembering your cookie consent choice). We only use analytics cookies if you explicitly accept them.',
    'legal.cookie.h3': '3. Managing cookies',
    'legal.cookie.h3.text': 'You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our site.',
    'legal.cookie.h4': '4. Third Parties',
    'legal.cookie.h4.text': 'We currently do not use any third-party marketing cookies.'
  },
  it: {
    // Meta tags (per-page SEO)
    'meta.home.title': 'NextSphere | Chatbot AI per B&B e Case Vacanze — Risposte 24/7',
    'meta.home.description': 'NextSphere è il chatbot AI per host di B&B, case vacanze e appartamenti. Gli ospiti scansionano un QR code e ottengono risposte immediate 24/7 nella loro lingua. Zero sforzo per te.',
    'meta.privacy.description': 'Informativa sulla Privacy di NextSphere — come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.',
    'meta.cookie.description': 'Cookie Policy di NextSphere — quali cookie utilizziamo e come gestirli.',

    // Navbar
    'nav.startFreeTrial': 'Inizia la prova gratuita',
    'nav.howItWorks': 'Come funziona',
    'nav.features': 'Funzionalità',
    'nav.pricing': 'Prezzi',
    'nav.faq': 'FAQ',
    
    // Hero
    'hero.badge': 'Il concierge silenzioso per la tua struttura',
    'hero.title': 'Ore risparmiate. Ospiti felici. Sempre.',
    'hero.subtitle': 'NextSphere risponde automaticamente a ogni domanda dei tuoi ospiti. Niente più chiamate notturne, niente più email ripetitive. Solo ospiti soddisfatti e tempo libero per te.',
    'hero.cta.primary': 'Inizia la prova gratuita',
    'hero.cta.secondary': 'Come funziona',
    
    // How it works
    'howItWorks.title': 'Semplice da configurare, invisibile da gestire.',
    'howItWorks.step1.title': 'Onboarding guidato',
    'howItWorks.step1.desc': 'Inserisci i dati della tua struttura e configura il tuo assistente AI in pochi minuti. Gestiamo noi la complessità.',
    'howItWorks.step2.title': 'QR code pronto',
    'howItWorks.step2.desc': 'Posiziona l\'elegante QR code nella tua struttura. Nessun download richiesto per gli ospiti.',
    'howItWorks.step3.title': 'Gli ospiti chattano 24/7',
    'howItWorks.step3.desc': 'Gli ospiti ottengono risposte immediate alle loro domande, giorno e notte, in qualsiasi lingua.',
    
    // Features
    'features.title': 'Tutto ciò che serve per un soggiorno premium.',
    'features.f1.title': 'Disponibile 24/7',
    'features.f1.desc': 'Non perdere mai una richiesta, anche mentre dormi.',
    'features.f2.title': 'Chatbot 100% personalizzabile',
    'features.f2.desc': 'Adatta le risposte alle tue regole della casa e raccomandazioni locali.',
    'features.f3.title': 'QR code pronto subito',
    'features.f3.desc': 'Pronto per essere stampato e posizionato subito dopo la configurazione.',
    'features.f4.title': 'Nessuna app per gli ospiti',
    'features.f4.desc': 'Gli ospiti scansionano e chattano direttamente nel loro browser.',
    'features.f5.title': 'Risponde in più lingue',
    'features.f5.desc': 'Conversa automaticamente in modo fluido nella lingua madre dell\'ospite.',
    'features.f6.title': 'Riduce chiamate e email ripetitive',
    'features.f6.desc': 'Elimina le domande ricorrenti su Wi-Fi, checkout e parcheggio.',
    
    // Pricing
    'pricing.title': 'Prezzi semplici, per ogni struttura.',
    'pricing.subtitle': 'Funzionalità premium incluse in ogni piano.',
    'pricing.tier1': '1 appartamento',
    'pricing.tier2': '2–3 appartamenti',
    'pricing.tier3': '4–6 appartamenti',
    'pricing.tier4': '7–10 appartamenti',
    'pricing.tier5': '10+ appartamenti',
    'pricing.cad': 'cad.',
    'pricing.month': '/ mese',
    'pricing.badge': '14 giorni di prova gratuita · Nessuna carta di credito',
    'pricing.cta': 'Inizia la prova gratuita',
    
    // FAQ
    'faq.title': 'Domande Frequenti',
    'faq.q1': 'È difficile da configurare?',
    'faq.a1': 'Assolutamente no. L\'onboarding guidato richiede meno di 10 minuti. Rispondi solo a qualche domanda sulla tua struttura e l\'AI costruisce la base di conoscenza automaticamente.',
    'faq.q2': 'Devo essere sempre online per farlo funzionare?',
    'faq.a2': 'No, NextSphere funziona in totale autonomia, 24/7. Puoi dormire sonni tranquilli mentre lui risponde agli ospiti.',
    'faq.q3': 'Funziona per qualsiasi tipo di struttura?',
    'faq.a3': 'Sì! È perfettamente adattato per B&B, case vacanza, appartamenti e boutique hotel.',
    'faq.q4': 'Il chatbot risponde in più lingue?',
    'faq.a4': 'Sì, l\'AI rileva automaticamente la lingua dell\'ospite e risponde nativamente, supportando oltre 30 lingue in modo impeccabile.',
    'faq.q5': 'Cosa succede dopo i 14 giorni di prova?',
    'faq.a5': 'Puoi scegliere il piano adatto al tuo numero di strutture. Se decidi di non continuare, il QR code smetterà semplicemente di funzionare—nessun addebito inaspettato.',
    'faq.q6': 'Posso modificare le risposte del chatbot?',
    'faq.a6': 'Certamente. Hai il controllo completo sulla base di conoscenza e puoi aggiornare regole della casa, password del Wi-Fi o raccomandazioni in qualsiasi momento.',
    
    // Final CTA section
    'cta.stat1': 'sempre attivo',
    'cta.stat2': 'lingue supportate',
    'cta.stat3': 'per configurare',
    'cta.final.title': 'Pronto a recuperare le tue ore?',
    'cta.final.subtitle': 'Configura in meno di 10 minuti. I tuoi ospiti ricevono risposte immediate dal primo giorno — niente chiamate, niente email, zero stress.',

    // Footer & Legal
    'footer.tagline': 'L\'ospitalità, reinventata.',
    'footer.nav.product': 'Prodotto',
    'footer.nav.howItWorks': 'Come funziona',
    'footer.nav.features': 'Funzionalità',
    'footer.nav.pricing': 'Prezzi',
    'footer.nav.faq': 'FAQ',
    'footer.nav.legal': 'Legale',
    'footer.privacy': 'Privacy Policy',
    'footer.cookie': 'Cookie Policy',
    'footer.rights': '© 2026 NextSphere. Tutti i diritti riservati.',
    
    'cookieBanner.text': 'Utilizziamo cookie per migliorare la tua esperienza.',
    'cookieBanner.accept': 'Accetta',
    'cookieBanner.reject': 'Rifiuta',
    
    // ─── CHECKLIST MANUTENZIONE PRIVACY POLICY ───────────────────────────────
    // Quando aggiungi una funzionalità che raccoglie dati, aggiorna le sezioni
    // pertinenti qui sotto E aggiorna PRIVACY_POLICY_DATE in ./privacyPolicyDate.ts.
    //
    // Funzionalità → sezioni da rivedere:
    //   Account utente / autenticazione → h1 (titolare), h2 (dati raccolti),
    //                                     h3 (finalità), h4 (conservazione), h5 (diritti)
    //   Modulo contatto / email         → h2 (dati raccolti), h3 (finalità), h4 (conservazione)
    //   Pagamenti                       → h2 (dati raccolti), h3 (finalità), h4 (conservazione),
    //                                     nuova sezione per responsabili terzi (es. Stripe)
    //   Strumento analytics terzo       → h2 (dati raccolti), h3 (finalità), cookie policy h4
    //   Dati chatbot ospiti             → h2 (dati raccolti), h3 (finalità), h4 (conservazione)
    //   Email marketing / newsletter    → h2 (dati raccolti), h3 (finalità), h4 (conservazione),
    //                                     h5 (aggiungere diritto di opposizione / opt-out)
    // ─────────────────────────────────────────────────────────────────────────

    // Legal Pages
    'legal.privacy.title': 'Privacy Policy',
    'legal.privacy.lastUpdated': `Ultimo aggiornamento: ${privacyLastUpdatedIT}`,
    'legal.privacy.p1': 'Questa Privacy Policy descrive come NextSphere ("noi", o "nostro") raccoglie, utilizza e condivide le tue informazioni personali quando utilizzi il nostro sito web e i nostri servizi.',
    // h1 — aggiornare se cambia ragione sociale, sede o contatto DPO
    'legal.privacy.h1': '1. Titolare del Trattamento',
    'legal.privacy.h1.text': 'Il titolare del trattamento è NextSphere. Puoi contattarci a info@nextsphere.it.',
    // h2 — aggiornare ogni volta che si raccoglie una nuova categoria di dati personali
    'legal.privacy.h2': '2. Dati Raccolti',
    'legal.privacy.h2.text': 'Memorizziamo la tua preferenza di lingua localmente nel tuo browser (localStorage). Questi dati non vengono mai trasmessi ai nostri server. Se accetti il nostro banner sui cookie, potremmo raccogliere anche dati analitici anonimi per capire come i visitatori utilizzano il sito.',
    // h3 — aggiornare se le finalità si espandono (es. marketing, profilazione)
    'legal.privacy.h3': '3. Finalità del Trattamento',
    'legal.privacy.h3.text': 'Utilizziamo i dati analitici esclusivamente per migliorare il nostro sito web e i nostri servizi. Non vendiamo i tuoi dati a terze parti.',
    // h4 — aggiornare se cambiano i periodi di conservazione o si aggiungono nuovi archivi
    'legal.privacy.h4': '4. Conservazione dei Dati',
    'legal.privacy.h4.text': 'La preferenza di lingua è memorizzata solo nel localStorage del tuo browser e può essere eliminata in qualsiasi momento cancellando i dati del browser. I cookie analitici, se accettati, vengono conservati in conformità con la nostra Cookie Policy.',
    // h5 — aggiornare se si aggiungono nuovi diritti (es. opposizione a decisioni automatizzate, opt-out)
    'legal.privacy.h5': '5. I Tuoi Diritti',
    'legal.privacy.h5.text': 'Ai sensi del GDPR (Art. 15-20), hai il diritto di accedere, rettificare, cancellare o trasferire i tuoi dati personali. Puoi revocare il consenso ai cookie analitici in qualsiasi momento tramite il banner dei cookie o cancellando i dati del browser. Per esercitare i tuoi diritti, contatta privacy@nextsphere.it.',
    
    'legal.cookie.title': 'Cookie Policy',
    'legal.cookie.p1': 'Il nostro sito web utilizza i cookie per distinguerti dagli altri utenti. Questo ci aiuta a fornirti una buona esperienza durante la navigazione e ci permette di migliorare il sito.',
    'legal.cookie.h1': '1. Cosa sono i cookie?',
    'legal.cookie.h1.text': 'Un cookie è un piccolo file di lettere e numeri che memorizziamo sul tuo browser o sul disco rigido del tuo computer se acconsenti.',
    'legal.cookie.h2': '2. Cookie che utilizziamo',
    'legal.cookie.h2.text': 'Utilizziamo cookie tecnici (essenziali per la sessione, preferenze di lingua e scelta del consenso cookie). Utilizziamo cookie analitici solo se li accetti esplicitamente.',
    'legal.cookie.h3': '3. Gestione dei cookie',
    'legal.cookie.h3.text': 'Puoi bloccare i cookie attivando le impostazioni del tuo browser. Tuttavia, se blocchi tutti i cookie (inclusi quelli essenziali) potresti non essere in grado di accedere a tutte le sezioni del sito.',
    'legal.cookie.h4': '4. Terze parti',
    'legal.cookie.h4.text': 'Attualmente non utilizziamo cookie di marketing di terze parti.'
  }
};

export type Language = 'en' | 'it';
export type TranslationKey = keyof typeof translations['en'];
