import './_group.css';
import './offer.css';

export function HomeOffer() {
  return (
    <main className="ns-preview ns-offer-home min-h-screen bg-[#f7f5f1]">
      <section id="pricing" className="relative overflow-hidden px-5 py-12 sm:px-8 sm:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[.23em] text-[#8a7a63] sm:mb-10 sm:text-[11px]">
            <span className="h-px w-8 bg-[#c6a477]" />
            Un prezzo per tutte le tue strutture
            <span className="h-px w-8 bg-[#c6a477]" />
          </div>

          <div className="grid items-center gap-8 md:grid-cols-[.85fr_1.15fr] md:gap-12">
            <div className="mx-auto max-w-md text-center md:mx-0 md:text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-[#a8875c]">Più tempo per i tuoi ospiti</p>
              <h2 className="mb-4 text-[30px] font-bold leading-[1.14] tracking-[-.045em] text-[#171614] sm:text-[38px]">
                L’accoglienza, senza le stesse domande.
              </h2>
              <p className="mx-auto max-w-sm text-[15px] leading-7 text-[#65615b] md:mx-0">
                NextSphere risponde agli ospiti al posto tuo. Un solo prezzo per il tuo account, qualunque sia il numero delle tue strutture.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#e5dccd] bg-white/70 px-3.5 py-2 text-[12px] font-medium text-[#615d56]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#b89668]" />
                Un account · tutte le tue proprietà
              </div>
            </div>

            <article className="offer-panel relative overflow-hidden rounded-[27px] px-7 py-8 text-center text-white sm:rounded-[32px] sm:px-10 sm:py-9">
              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#deb67d]/30 bg-[#deb67d]/[.09] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#e4c18f] sm:text-[11px]">
                  Offerta limitata
                </div>
                <p className="mb-1 text-[13px] text-white/60">Un solo prezzo mensile per account</p>
                <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                  <span className="text-[16px] text-white/45 line-through decoration-[#deb67d]/75 decoration-1">€11,99</span>
                  <span className="font-['Montserrat'] text-[57px] font-bold leading-none tracking-[-.06em] text-[#f2d6ad] sm:text-[68px]">€9,99</span>
                  <span className="pb-1 text-[14px] text-white/60">/ mese</span>
                </div>
                <p className="mt-2 text-[13px] font-medium text-[#e5c493]">Prezzo bloccato per sempre*</p>
                <p className="mx-auto mt-3 max-w-md text-[12px] leading-5 text-white/55">
                  Indipendente dal numero di appartamenti o proprietà. Nessun piano per struttura.
                </p>

                <div className="mx-auto mt-6 max-w-sm border-t border-white/10 pt-5">
                  <p className="mb-4 text-[12px] font-medium text-[#d8bd97]">14 giorni di prova gratuita · Nessuna carta di credito</p>
                  <a href="#home-offer-conditions" className="offer-cta block w-full rounded-xl bg-[#deb67d] px-5 py-3.5 text-[14px] font-semibold text-[#171411]">
                    Inizia la prova gratuita
                  </a>
                </div>
                <p className="mt-4 text-[10px] text-white/40">La prova non riserva automaticamente il prezzo speciale.</p>
              </div>
            </article>
          </div>

          <div id="home-offer-conditions" className="offer-conditions mx-auto mt-6 max-w-3xl rounded-2xl border border-[#e7dfd3] bg-white/75 px-5 py-4 text-center sm:px-7">
            <p className="text-[12px] leading-5 text-[#625e57] sm:text-[13px] sm:leading-6">
              <span className="font-semibold text-[#26231f]">*Come mantenere il prezzo speciale:</span>{' '}
              Il prezzo di €9,99/mese resta bloccato per sempre se ti registri e completi il primo pagamento al termine dei 14 giorni di prova mentre l’offerta è ancora attiva.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
