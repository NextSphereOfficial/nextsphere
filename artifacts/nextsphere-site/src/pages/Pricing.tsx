import React from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, ScanLine, Globe2, Clock, PhoneOff, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SEO } from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';
import { PLATFORM_URL } from '../lib/externalLinks';
import { trackCta } from '../lib/trackCta';
import { PricingOfferIntro } from '../components/PricingOffer';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const pricingSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',   item: 'https://www.nextsphere.it/' },
      { '@type': 'ListItem', position: 2, name: 'Prezzi', item: 'https://www.nextsphere.it/pricing' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'NextSphere — Chatbot AI per affitti brevi',
    provider: { '@type': 'Organization', name: 'NextSphere', url: 'https://www.nextsphere.it' },
    serviceType: 'Chatbot AI per host turistici',
    url: 'https://www.nextsphere.it/pricing',
    offers: {
      '@type': 'Offer',
      price: '9.99',
      priceCurrency: 'EUR',
      url: 'https://www.nextsphere.it/pricing',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '9.99',
        priceCurrency: 'EUR',
        unitText: 'per property per month',
      },
    },
  },
];

export default function Pricing() {
  const { t, lang } = useTranslation();

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
        canonical="https://www.nextsphere.it/pricing"
        lang={lang}
        schema={pricingSchema}
      />

      <PricingOfferIntro />

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
              href={PLATFORM_URL}
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
