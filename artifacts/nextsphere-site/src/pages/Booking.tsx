import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ScanLine, Clock, Globe2, Star, Zap } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';
import { trackCta } from '../lib/trackCta';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Booking() {
  const { t, lang } = useTranslation();

  const steps = [
    { icon: ShieldCheck, title: t('booking.how.step1.title'), desc: t('booking.how.step1.desc') },
    { icon: ScanLine,    title: t('booking.how.step2.title'), desc: t('booking.how.step2.desc') },
    { icon: Clock,       title: t('booking.how.step3.title'), desc: t('booking.how.step3.desc') },
  ];

  const benefits = [
    { icon: Globe2,      title: t('booking.benefits.b1.title'), desc: t('booking.benefits.b1.desc') },
    { icon: Clock,       title: t('booking.benefits.b2.title'), desc: t('booking.benefits.b2.desc') },
    { icon: Zap,         title: t('booking.benefits.b3.title'), desc: t('booking.benefits.b3.desc') },
    { icon: Star,        title: t('booking.benefits.b4.title'), desc: t('booking.benefits.b4.desc') },
  ];

  const problems = [1, 2, 3, 4].map((i) => t(`booking.problem.item${i}` as any));

  return (
    <div className="w-full">
      <SEO
        title={t('meta.booking.title')}
        description={t('meta.booking.description')}
        canonical="https://nextsphere.it/booking"
        lang={lang}
      />

      {/* ── HERO ── */}
      <section className="relative bg-[#0D0D0D] pt-36 pb-28 overflow-hidden">
        <div
          className="absolute top-1/3 left-1/4 w-[600px] h-[500px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(222,182,125,0.2) 0%, transparent 70%)' }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[350px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(180,120,60,0.15) 0%, transparent 70%)' }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block py-1.5 px-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              ✨ {t('booking.hero.badge')}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {t('booking.hero.title')}
            </h1>
            <p className="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
              {t('booking.hero.highlight')}
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('booking.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-[0_0_48px_rgba(222,182,125,0.35)]"
                onClick={() => trackCta('booking_hero')}
              >
                {t('hero.cta.primary')}
              </a>
              <a
                href="#how-booking"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/10 text-base font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                {t('hero.cta.secondary')}
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14"
          >
            {t('booking.problem.title')}
          </motion.h2>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 gap-4 mb-10"
          >
            {problems.map((text, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-700 text-lg font-medium"
              >
                {text}
              </motion.div>
            ))}
          </motion.div>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center text-gray-500 text-lg max-w-2xl mx-auto"
          >
            {t('booking.problem.caption')}
          </motion.p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-booking" className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16"
          >
            {t('booking.how.title')}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gray-200 -z-10" />
            {steps.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-8">
                  <Icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-12"
          >
            {t('booking.benefits.title')}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('booking.cta.title')}</h2>
            <p className="text-gray-400 text-lg mb-10">{t('booking.cta.subtitle')}</p>
            <a
              href="#"
              className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-[0_0_48px_rgba(222,182,125,0.3)]"
              onClick={() => trackCta('booking_cta')}
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
