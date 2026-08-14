import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, ScanLine, Globe2, Clock, PhoneOff, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SEO } from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';
import { trackCta } from '../lib/trackCta';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Pricing() {
  const { t, lang } = useTranslation();

  const tiers = [
    { label: t('pricing.tier1'), price: '39' },
    { label: t('pricing.tier2'), price: '34', per: true },
    { label: t('pricing.tier3'), price: '29', per: true },
    { label: t('pricing.tier4'), price: '24', per: true },
    { label: t('pricing.tier5'), price: '19', per: true },
  ];

  const includes = [
    { icon: Zap,        label: t('pricing.page.includes.f1') },
    { icon: ScanLine,   label: t('pricing.page.includes.f2') },
    { icon: Globe2,     label: t('pricing.page.includes.f3') },
    { icon: Clock,      label: t('pricing.page.includes.f4') },
    { icon: ShieldCheck,label: t('pricing.page.includes.f5') },
    { icon: PhoneOff,   label: t('pricing.page.includes.f6') },
  ];

  const faqs = [1, 2, 3, 4].map((i) => ({
    q: t(`pricing.page.faq.q${i}` as any),
    a: t(`pricing.page.faq.a${i}` as any),
  }));

  return (
    <div className="w-full">
      <SEO
        title={t('meta.pricing.title')}
        description={t('meta.pricing.description')}
        canonical="https://nextsphere.it/pricing"
        lang={lang}
      />

      {/* ── HERO ── */}
      <section className="relative bg-[#0D0D0D] pt-36 pb-24 overflow-hidden">
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(222,182,125,0.2) 0%, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block py-1.5 px-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              ✨ {t('pricing.page.hero.badge')}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('pricing.page.hero.title')}
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      </section>

      {/* ── PRICING TIERS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="bg-[#0D0D0D] rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <motion.div
                className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full blur-[90px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(222,182,125,0.25) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="space-y-6 relative z-10 mb-12">
                {tiers.map((tier, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                    <span className="text-lg font-medium text-gray-300">{tier.label}</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold">€{tier.price}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        {tier.per ? ` ${t('pricing.cad')} ` : ' '}{t('pricing.month')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center relative z-10">
                <p className="text-primary font-medium mb-6 text-sm">✓ {t('pricing.badge')}</p>
                <a
                  href="#"
                  className="block w-full py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02]"
                  onClick={() => trackCta('pricing')}
                >
                  {t('pricing.cta')}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16"
          >
            {t('pricing.page.includes.title')}
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {includes.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <span className="text-gray-700 font-medium leading-snug">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING FAQ ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
          >
            {t('pricing.page.faq.title')}
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Accordion type="single" collapsible className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {faqs.map(({ q, a }, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="px-6 border-b border-gray-100 last:border-0">
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-primary transition-colors py-6">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pb-6">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-[#0D0D0D] text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(222,182,125,0.2) 0%, transparent 65%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('pricing.page.cta.title')}</h2>
            <p className="text-gray-400 text-lg mb-10">{t('pricing.page.cta.subtitle')}</p>
            <a
              href="#"
              className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-[0_0_48px_rgba(222,182,125,0.3)]"
              onClick={() => trackCta('pricing')}
            >
              {t('pricing.cta')}
            </a>
            <p className="mt-5 text-sm text-gray-600">{t('pricing.badge')}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
