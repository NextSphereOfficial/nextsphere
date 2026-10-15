import { useState } from 'react';
import './_group.css';

// Extracted from Home.tsx pricing section and Pricing.tsx hero / tiers.
// Routing, analytics, translation provider and viewport animation are stubbed.
export function Current() {
  const [page, setPage] = useState<'home' | 'pricing'>('pricing');
  const tiers = [
    { label: '1 appartamento', price: '39', per: false },
    { label: '2–3 appartamenti', price: '34', per: true },
    { label: '4–6 appartamenti', price: '29', per: true },
    { label: '7–10 appartamenti', price: '24', per: true },
    { label: '10+ appartamenti', price: '', per: false },
  ];
  const glow = <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full blur-[90px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(222,182,125,0.25) 0%, transparent 70%)' }} />;
  const cta = <button type="button" className="block w-full py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-xl hover:opacity-90 transition-all">Inizia la prova gratuita</button>;
  return (
    <div className="ns-preview min-h-screen">
      <div className="flex justify-center gap-3 p-3 bg-gray-100 text-sm">
        <button onClick={() => setPage('home')} className={page === 'home' ? 'font-bold underline' : ''}>Attuale · Home</button>
        <button onClick={() => setPage('pricing')} className={page === 'pricing' ? 'font-bold underline' : ''}>Attuale · /pricing</button>
      </div>
      {page === 'home' ? (
        <section id="pricing" className="py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-gray-50 to-white -z-10" />
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Prezzi semplici, per ogni struttura.</h2>
              <p className="text-xl text-gray-600">Funzionalità premium incluse in ogni piano.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#0D0D0D] rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden text-center">
                {glow}
                <div className="relative z-10 mb-8">
                  <p className="text-gray-400 text-sm uppercase tracking-widest mb-3">A partire da</p>
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <span className="text-6xl md:text-7xl font-bold">€39<sup className="text-2xl align-super">*</sup></span>
                    <span className="text-gray-400 text-lg pb-2">/ mese</span>
                  </div>
                  <p className="text-gray-500 text-sm">Prezzi personalizzati per strutture con 10+ appartamenti.</p>
                </div>
                <div className="relative z-10">
                  <p className="text-primary font-medium mb-6 text-sm">✓ 14 giorni di prova gratuita · Nessuna carta di credito</p>
                  {cta}
                  <p className="mt-5 text-sm text-gray-600">Vedi tutti i dettagli nella pagina prezzi</p>
                </div>
                <p className="relative z-10 mt-8 text-xs text-gray-600 text-left">*Prezzi finali, nessun costo aggiuntivo.</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="relative bg-[#0D0D0D] pt-36 pb-24 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(222,182,125,0.2) 0%, transparent 70%)' }} />
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <span className="inline-block py-1.5 px-4 rounded-full border border-[#deb67d]/30 bg-[#deb67d]/10 text-primary text-sm font-medium mb-8">Prezzi semplici e trasparenti</span>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">Un piano. Tutto incluso.</h1>
              <p className="text-lg text-gray-400 max-w-xl mx-auto">Funzionalità premium incluse in ogni piano.</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none" />
          </section>
          <section className="py-24 bg-white">
            <div className="max-w-2xl mx-auto px-6">
              <div className="bg-[#0D0D0D] rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                {glow}
                <div className="space-y-6 relative z-10 mb-12">
                  {tiers.map((tier) => (
                    <div key={tier.label} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                      <span className="text-lg font-medium text-gray-300">{tier.label}</span>
                      {!tier.price ? <button className="px-4 py-2 text-sm font-semibold text-primary border border-[#deb67d]/50 rounded-lg">Richiedi un preventivo</button> : (
                        <div className="text-right">
                          <span className="text-2xl font-bold">€{tier.price}<sup className="text-sm align-super">*</sup></span>
                          <span className="text-sm text-gray-500 ml-1">{tier.per ? ' cad. ' : ' '}/ mese</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center relative z-10">
                  <p className="text-primary font-medium mb-6 text-sm">✓ 14 giorni di prova gratuita · Nessuna carta di credito</p>
                  {cta}
                </div>
                <p className="relative z-10 mt-8 text-xs text-gray-600 text-left">*Prezzi finali, nessun costo aggiuntivo.</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
