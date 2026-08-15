import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Clock, Home, BookOpen, Car, Train, Utensils, ShoppingCart, Map, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';
import { trackCta } from '../lib/trackCta';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const includes = [
  { icon: Wifi },
  { icon: Clock },
  { icon: Home },
  { icon: BookOpen },
  { icon: Car },
  { icon: Train },
  { icon: Utensils },
  { icon: ShoppingCart },
  { icon: Map },
  { icon: Phone },
];

const guidaSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',                  item: 'https://nextsphere.it/' },
      { '@type': 'ListItem', position: 2, name: 'Guida Digitale Ospiti', item: 'https://nextsphere.it/guida-digitale-ospiti' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Guida Digitale per Ospiti — NextSphere',
    provider: { '@type': 'Organization', name: 'NextSphere', url: 'https://nextsphere.it' },
    serviceType: 'Guida digitale interattiva per ospiti di strutture ricettive',
    url: 'https://nextsphere.it/guida-digitale-ospiti',
    description: 'Crea una guida digitale per i tuoi ospiti in 10 minuti. QR code, risposte automatiche su Wi-Fi, check-in, ristoranti e molto altro.',
    areaServed: 'IT',
  },
];

export default function GuidaDigitaleOspiti() {
  const { t, lang } = useTranslation();

  const comparisonRows = [1, 2, 3, 4].map((i) => ({
    label:   t(`guideDigitale.vs.r${i}.label` as any),
    digital: t(`guideDigitale.vs.r${i}.digital` as any),
    paper:   t(`guideDigitale.vs.r${i}.paper` as any),
  }));

  const includeItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i, idx) => ({
    Icon: includes[idx].icon,
    text: t(`guideDigitale.includes.i${i}` as any),
  }));

  return (
    <div className="w-full">
      <SEO
        title={t('meta.guideDigitale.title')}
        description={t('meta.guideDigitale.description')}
        canonical="https://nextsphere.it/guida-digitale-ospiti"
        lang={lang}
        schema={guidaSchema}
      />

      {/* ── HERO ── */}
      <section className="relative bg-[#0D0D0D] pt-36 pb-28 overflow-hidden">
        <div
          className="absolute top-1/4 right-1/3 w-[600px] h-[500px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(222,182,125,0.2) 0%, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block py-1.5 px-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              ✨ {t('guideDigitale.hero.badge')}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 leading-tight">
              {t('guideDigitale.hero.title')}
            </h1>
            <p className="text-4xl md:text-6xl font-bold text-primary mb-8 leading-tight">
              {t('guideDigitale.hero.highlight')}
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('guideDigitale.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-[0_0_48px_rgba(222,182,125,0.35)]"
                onClick={() => trackCta('guida_hero')}
              >
                {t('hero.cta.primary')}
              </a>
              <a
                href="#cosa-contiene"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/10 text-base font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                {t('hero.cta.secondary')}
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      </section>

      {/* ── WHAT IS IT ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
          >
            {t('guideDigitale.what.title')}
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-5">
            <p className="text-gray-600 text-lg leading-relaxed">{t('guideDigitale.what.p1')}</p>
            <p className="text-gray-600 text-lg leading-relaxed">{t('guideDigitale.what.p2')}</p>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT IT COVERS ── */}
      <section id="cosa-contiene" className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14"
          >
            {t('guideDigitale.includes.title')}
          </motion.h2>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4"
          >
            {includeItems.map(({ Icon, text }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <span className="text-gray-700 font-medium">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
          >
            {t('guideDigitale.vs.title')}
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-3 bg-[#0D0D0D] text-white text-sm font-semibold">
                <div className="p-4 text-gray-400"></div>
                <div className="p-4 text-center text-primary">{t('guideDigitale.vs.digital')}</div>
                <div className="p-4 text-center text-gray-400">{t('guideDigitale.vs.paper')}</div>
              </div>
              {/* Rows */}
              {comparisonRows.map(({ label, digital, paper }, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div className="p-4 font-semibold text-gray-800 text-sm flex items-center">{label}</div>
                  <div className="p-4 text-sm text-green-700 font-medium text-center flex items-center justify-center">{digital}</div>
                  <div className="p-4 text-sm text-gray-400 text-center flex items-center justify-center">{paper}</div>
                </div>
              ))}
            </div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('guideDigitale.cta.title')}</h2>
            <p className="text-gray-400 text-lg mb-10">{t('guideDigitale.cta.subtitle')}</p>
            <a
              href="#"
              className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-[0_0_48px_rgba(222,182,125,0.3)]"
              onClick={() => trackCta('guida_cta')}
            >
              {t('hero.cta.primary')}
            </a>
            <p className="mt-5 text-sm text-gray-600">{t('pricing.badge')}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
