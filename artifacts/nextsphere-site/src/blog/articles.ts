import type { Language } from '../i18n/translations';

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  teaser: string;
  introduction: string[];
  sections: { heading: string; paragraphs: string[] }[];
  conclusion: string[];
}

export const guideArticles: Record<Language, GuideArticle[]> = {
  it: [
    {
      slug: 'ridurre-domande-ripetitive-ospiti',
      title: 'Come ridurre le domande ripetitive degli ospiti senza perdere il lato umano',
      description: 'Domande su Wi-Fi, arrivo e orari: consigli pratici da un host per rendere le risposte più accessibili senza rinunciare all’accoglienza.',
      teaser: 'Quando la stessa domanda interrompe ancora una volta la tua giornata, non è l’ospite il problema. È il modo in cui gli arrivano le informazioni.',
      introduction: [
        'Stai organizzando un arrivo, cercando di finire un lavoro o, finalmente, prendendoti una pausa. Il telefono si illumina: «Qual è la password del Wi-Fi?». La domanda è semplice. Il problema è che forse è la quinta volta che la leggi questa settimana.',
        'Gestisco anch’io una società di affitti brevi e turistici. So che per l’ospite quella domanda è nuova: è appena arrivato, non conosce la casa e vuole sentirsi tranquillo. Ma so anche cosa significa dover interrompere ogni volta quello che stai facendo per rispondere, magari in un’altra lingua o a un’ora in cui non puoi essere tempestivo.',
        'Non credo che la soluzione sia diventare un host meno presente. Credo che sia rendere più semplici le risposte che diamo tutti i giorni, per poter dedicare attenzione alle persone quando ne hanno davvero bisogno.',
      ],
      sections: [
        {
          heading: 'Parti dalle domande che arrivano davvero',
          paragraphs: [
            'Prima di scegliere uno strumento, guarda le tue conversazioni recenti. Quali domande tornano? Wi-Fi, parcheggio, check-in e check-out, elettrodomestici, raccolta dei rifiuti o suggerimenti nei dintorni sono esempi possibili: la tua lista sarà diversa da quella di un altro host.',
            'Annotane alcune e verifica se le risposte sono già scritte da qualche parte. Se sì, l’ospite riesce a trovarle nel momento in cui gli servono? Non occorre preparare una guida enciclopedica: comincia dalle informazioni che ti chiedono più spesso. Quando cambia un orario o una password, aggiorna anche ciò che hai condiviso.',
          ],
        },
        {
          heading: 'Condividi l’informazione nel momento giusto',
          paragraphs: [
            'Le istruzioni per arrivare servono prima del viaggio. Quelle per il riscaldamento, magari, solo dopo che l’ospite è entrato in casa. Un messaggio prima dell’arrivo e una guida facile da consultare durante il soggiorno rispondono a esigenze diverse.',
            'Pensa anche alla lingua. Per chi arriva dall’estero, dover interpretare una spiegazione complicata può trasformare una piccola necessità in un altro messaggio. Una risposta chiara e accessibile rende il soggiorno più sereno per l’ospite e riduce le interruzioni per te.',
          ],
        },
        {
          heading: 'Fai spazio alle risposte che solo tu puoi dare',
          paragraphs: [
            'Una guida digitale con QR code può aiutare gli ospiti a ritrovare le informazioni pratiche. NextSphere permette anche di fare domande su ciò che hai condiviso, invece di cercare una frase dentro un documento. Non significa però delegare ogni situazione a una chat.',
            'Un guasto, un reclamo o un imprevisto richiedono attenzione umana. E se l’AI non sa una risposta, non deve inventarla: quando l’ospite chiede di contattare l’host, NextSphere gli fornisce i suoi recapiti. Questo confine, per me, è importante quanto la comodità di avere meno domande ripetitive.',
          ],
        },
      ],
      conclusion: [
        'Alla fine non si tratta di far sparire i messaggi. Si tratta di evitare che una risposta già data molte volte occupi lo spazio che vorresti riservare a un problema vero, a un nuovo arrivo o semplicemente al resto della tua giornata. Accogliere bene non dovrebbe voler dire essere sempre con il telefono in mano.',
      ],
    },
    {
      slug: 'self-check-in-assistenza-ospiti',
      title: 'Self check-in e assistenza agli ospiti: due esigenze da non confondere',
      description: 'Accesso autonomo e risposte durante il soggiorno sono cose diverse. Ecco come distinguerle e scegliere gli strumenti senza aspettarsi che uno faccia tutto.',
      teaser: 'Far entrare un ospite in autonomia è una cosa. Essere presenti quando cerca una risposta, anche dopo l’arrivo, è un’altra.',
      introduction: [
        'Immagina un ospite che arriva la sera. Riesce a entrare nell’alloggio senza incontrarti, posa la valigia e poco dopo si chiede come accendere il riscaldamento. L’arrivo è andato bene; il bisogno di assistenza, però, non è finito sulla soglia.',
        'Quando gestisci una struttura, può sembrare un unico problema: «Devo essere raggiungibile sempre». È una sensazione che conosco. Ma distinguere i momenti del soggiorno aiuta a preparare istruzioni migliori e a scegliere gli strumenti giusti, senza chiedere a una soluzione di fare ciò per cui non è stata pensata.',
      ],
      sections: [
        {
          heading: 'Il self check-in riguarda l’accesso alla casa',
          paragraphs: [
            'Con self check-in si intende, in generale, un arrivo che l’ospite può gestire in autonomia, se previsto per la struttura: istruzioni per raggiungerla, modalità di accesso e un contatto da usare se qualcosa non funziona. Una buona prova è leggere queste indicazioni come se fosse la prima volta che vedi il portone. Riusciresti davvero a trovare l’ingresso?',
            'L’identificazione degli ospiti e gli adempimenti previsti per la propria attività sono questioni distinte. Prima di adottare una procedura di arrivo, verifica gli obblighi applicabili con le fonti competenti o un professionista. Una guida digitale non sostituisce queste verifiche.',
          ],
        },
        {
          heading: 'L’assistenza continua dopo l’ingresso',
          paragraphs: [
            'Una volta dentro, le domande possono riguardare il Wi-Fi, gli elettrodomestici, i rifiuti, il parcheggio, le regole della casa o l’orario di partenza. Per l’ospite sono piccoli dubbi nel corso di una giornata nuova; per l’host possono diventare tante interruzioni sparse tra lavoro e vita privata.',
            'Qui aiuta raccogliere informazioni accurate e facili da ritrovare. NextSphere è pensato per questo: l’ospite accede tramite QR code e può chiedere chiarimenti sulle informazioni che l’host ha messo a disposizione. Non è un sistema di verifica dei documenti, gestione delle serrature o comunicazione dei dati alle autorità.',
          ],
        },
        {
          heading: 'L’autonomia funziona meglio quando resta un contatto umano',
          paragraphs: [
            'Anche le istruzioni più chiare non coprono ogni imprevisto. Un codice può non funzionare, un apparecchio può guastarsi, un ospite può avere bisogno di parlarti. Per questo il modo di contattare l’host deve essere facile da trovare.',
            'NextSphere non inventa una risposta quando non la conosce e, se l’ospite chiede i contatti dell’host, glieli fornisce. L’obiettivo non è togliere la persona dall’accoglienza: è aiutarla a essere disponibile per le situazioni in cui conta davvero.',
          ],
        },
      ],
      conclusion: [
        'Organizzare bene l’arrivo e aiutare gli ospiti durante il soggiorno sono due lavori complementari. Separarli non complica le cose: ti permette di capire cosa preparare prima, cosa rendere consultabile in casa e quando deve intervenire una persona.',
      ],
    },
  ],
  en: [
    {
      slug: 'ridurre-domande-ripetitive-ospiti',
      title: 'How to answer repeat guest questions without losing the human touch',
      description: 'Wi-Fi, arrival times and everyday questions: practical advice from a host on making answers easier to find while staying present for guests.',
      teaser: 'When the same question interrupts your day again, the guest is not the problem. It is how the information reaches them.',
      introduction: [
        'You are arranging an arrival, trying to finish a task or finally taking a break. Your phone lights up: “What’s the Wi-Fi password?” It is a simple question. The hard part is that you may have answered it five times this week.',
        'I run a short-term and holiday rental company too. I know that, for the guest, this is a new question: they have just arrived, do not know the property and want to feel at ease. I also know what it feels like to stop what you are doing every time, perhaps in another language or at a time when you cannot reply quickly.',
        'I do not think the answer is to become a less attentive host. It is to make everyday answers easier to find, so we can give people our attention when they truly need it.',
      ],
      sections: [
        {
          heading: 'Start with the questions your guests actually ask',
          paragraphs: [
            'Look back at your recent conversations before choosing a tool. Which questions keep coming up? Wi-Fi, parking, arrival and departure times, appliances, rubbish collection or local tips are possible examples; your list will differ from another host’s.',
            'Write a few down and check whether you have already provided those answers somewhere. Can guests find them when they need them? You do not need an encyclopaedic guide: begin with the information people ask for most. When a time or password changes, update whatever you have shared.',
          ],
        },
        {
          heading: 'Share each answer at the right moment',
          paragraphs: [
            'Directions matter before the journey. Heating instructions may only matter once a guest is inside. A message before arrival and an easy-to-access guide during the stay serve different purposes.',
            'Think about language, too. For someone arriving from abroad, deciphering a complicated explanation can turn a small need into another message. Clear, accessible answers make the stay easier for them and mean fewer interruptions for you.',
          ],
        },
        {
          heading: 'Keep your attention for the answers only you can give',
          paragraphs: [
            'A QR-code digital guide can help guests find practical information. NextSphere also lets them ask about what you have shared, rather than search through a document. That does not mean every situation belongs in a chat.',
            'A breakdown, complaint or unexpected problem needs a human response. And if the AI does not know an answer, it should not make one up: when a guest asks to contact the host, NextSphere provides the host’s contact details. To me, that boundary matters as much as reducing repeat questions.',
          ],
        },
      ],
      conclusion: [
        'The goal is not to make messages disappear. It is to stop an answer you have given many times from taking the attention you would rather give to a real problem, a new arrival or simply the rest of your day. Caring for guests should not mean always holding your phone.',
      ],
    },
    {
      slug: 'self-check-in-assistenza-ospiti',
      title: 'Self check-in and guest support are not the same thing',
      description: 'Independent arrival and help during a stay solve different needs. Learn how to distinguish them without expecting one tool to do everything.',
      teaser: 'Helping a guest get inside independently is one thing. Being there when they need an answer after arrival is another.',
      introduction: [
        'Imagine a guest arriving in the evening. They enter the property on their own, put down their bag and then wonder how to turn on the heating. Arrival went smoothly; their need for help did not end at the door.',
        'As a host, it can feel like one problem: “I have to be reachable all the time.” I know that feeling. But separating the moments in a stay helps us prepare better instructions and choose suitable tools, without expecting one solution to do a job it was never designed for.',
      ],
      sections: [
        {
          heading: 'Self check-in is about accessing the property',
          paragraphs: [
            'Self check-in generally means an arrival guests can manage independently, where suitable for the property: directions, entry instructions and someone to contact if something goes wrong. A useful test is to read those instructions as though you have never seen the entrance. Would you actually find the right door?',
            'Guest identification and the obligations that apply to your business are separate matters. Before adopting any arrival process, check the applicable requirements with the relevant authorities or a qualified professional. A digital guide is not a substitute for those checks.',
          ],
        },
        {
          heading: 'Support continues after guests enter',
          paragraphs: [
            'Once inside, questions may be about Wi-Fi, appliances, rubbish collection, parking, house rules or departure times. To the guest, these are small uncertainties in an unfamiliar place. To the host, they can be interruptions spread across work and personal time.',
            'This is where accurate, easy-to-find information helps. NextSphere is designed for this part of the stay: guests access it via a QR code and can ask about the information the host has provided. It does not verify identity documents, manage door locks or report guest data to the authorities.',
          ],
        },
        {
          heading: 'Independence works better when a person remains reachable',
          paragraphs: [
            'Even the clearest instructions cannot cover every surprise. An entry code might fail, an appliance could break, or a guest may need to speak to you. Make it easy to find out how to contact the host.',
            'NextSphere does not invent an answer it does not know; if guests ask for the host’s contact details, it provides them. The idea is not to remove a person from hospitality, but to help them be there when it matters.',
          ],
        },
      ],
      conclusion: [
        'Preparing for arrival and supporting guests during their stay are complementary jobs. Keeping them distinct helps you decide what to prepare beforehand, what to make available at the property and when a person should step in.',
      ],
    },
  ],
};
