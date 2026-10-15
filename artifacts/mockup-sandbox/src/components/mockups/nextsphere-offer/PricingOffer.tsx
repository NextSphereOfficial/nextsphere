import './_group.css';
import './offer.css';

export function PricingOffer() {
  return (
    <main className="ns-preview ns-offer-pricing min-h-screen bg-[#f7f5f1]">
      <section className="relative overflow-hidden bg-[#0d0d0d] px-5 pb-14 pt-12 text-center text-white sm:px-8 sm:pb-16 sm:pt-14">
        <div aria-hidden="true" className="offer-hero-glow pointer-events-none absolute -right-20 -top-32 h-[390px] w-[390px] rounded-full blur-[80px] sm:right-[12%] sm:top-[-210px] sm:h-[560px] sm:w-[560px]" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#deb67d]/30 bg-[#deb67d]/[.08] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[.17em] text-[#e2c08f] sm:mb-6 sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#deb67d]" />
            Prezzi chiari, accoglienza migliore
          </span>
          <h1 className="mx-auto max-w-2xl text-[34px] font-bold leading-[1.12] tracking-[-.045em] sm:text-[48px] md:text-[54px]">
            Una tariffa semplice.<br className="hidden sm:block" /> Meno messaggi ripetitivi.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-white/60 sm:mt-5 sm:text-[16px] sm:leading-7">
            NextSphere è il concierge AI che aiuta i tuoi ospiti e lascia a te più tempo per ciò che conta.
          </p>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[.16em] text-[#c7b18f]">Il prezzo vale per l’intero account</p>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#f7f5f1]" />
      </section>

      <section className="relative px-5 pb-12 pt-1 sm:px-8 sm:pb-16">
        <div className="mx-auto max-w-[880px]">
          <article className="offer-panel relative overflow-hidden rounded-[28px] px-6 py-7 text-white sm:rounded-[34px] sm:px-10 sm:py-9">
            <div className="relative z-10 grid gap-7 md:grid-cols-[1fr_.86fr] md:items-center md:gap-10">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#deb67d]/30 bg-[#deb67d]/[.09] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#e4c18f]">
                  Offerta limitata
                </div>
                <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
                  <span className="text-[16px] text-white/45 line-through decoration-[#deb67d]/75 decoration-1">€11,99</span>
                  <span className="font-['Montserrat'] text-[58px] font-bold leading-none tracking-[-.065em] text-[#f2d6ad] sm:text-[70px]">€9,99</span>
                  <span className="pb-1 text-[14px] text-white/60">/ mese</span>
                </div>
                <p className="mt-2 text-[14px] font-semibold text-[#e5c493]">Bloccato per sempre*</p>
                <p className="mt-4 max-w-md text-[13px] leading-6 text-white/60">
                  Un unico prezzo mensile per account, indipendente dal numero di appartamenti o proprietà.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[.035] p-5 sm:p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[.12em] text-[#d7bc96]">Inizia con calma</p>
                <p className="mt-2 text-[13px] leading-6 text-white/65">14 giorni di prova gratuita<br />Nessuna carta di credito</p>
                <a href="#offer-eligibility" className="offer-cta mt-5 block rounded-xl bg-[#deb67d] px-5 py-3.5 text-center text-[14px] font-semibold text-[#171411]">
                  Inizia la prova gratuita
                </a>
                <p className="mt-3 text-center text-[11px] leading-4 text-white/60">Le condizioni dell’offerta sono riportate qui sotto.</p>
              </div>
            </div>
          </article>

          <section id="offer-eligibility" className="offer-conditions mt-6 grid gap-4 sm:grid-cols-[.72fr_1.28fr]">
            <div className="rounded-2xl border border-[#e7dfd3] bg-white/80 p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#9b7d57]">Come si ottiene</p>
              <h2 className="mt-2 text-[18px] font-bold leading-snug tracking-[-.025em] text-[#201e1a]">Come bloccare €9,99 per sempre.</h2>
              <p className="mt-2 text-[12px] leading-5 text-[#6d6962]">Per accedere alla tariffa speciale devono verificarsi entrambi i passaggi indicati.</p>
            </div>
            <div className="rounded-2xl border border-[#e7dfd3] bg-[#f1ece4] p-5 sm:p-6">
              <ol className="space-y-3 text-[12px] leading-5 text-[#514c44] sm:text-[13px] sm:leading-6">
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#171614] text-[10px] font-semibold text-[#e6c38f]">1</span>
                  <span>Ti registri per iniziare i 14 giorni di prova gratuita.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#171614] text-[10px] font-semibold text-[#e6c38f]">2</span>
                  <span>Completi il primo pagamento al termine della prova, mentre l’offerta è ancora attiva.</span>
                </li>
              </ol>
              <p className="mt-4 border-t border-[#dcd2c4] pt-4 text-[12px] font-medium leading-5 text-[#302c26]">
                *Il prezzo di €9,99/mese resta bloccato per sempre se ti registri e completi il primo pagamento al termine dei 14 giorni di prova mentre l’offerta è ancora attiva. La sola registrazione non riserva la tariffa.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
