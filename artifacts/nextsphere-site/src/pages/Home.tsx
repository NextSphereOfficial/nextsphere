import React, { useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, ShieldCheck, Zap, Globe2, ScanLine, Clock, PhoneOff } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// --- Animation variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

// Feature cards get a blur-fade for a more premium feel
const blurFade = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
  }
};

// Stagger container for feature grid
const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

export default function Home() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);

  // Parallax: hero background orbs drift upward as user scrolls
  const { scrollY } = useScroll();
  const orb1Y = useTransform(scrollY, [0, 600], [0, -120]);
  const orb2Y = useTransform(scrollY, [0, 600], [0, -80]);
  const heroContentY = useTransform(scrollY, [0, 600], [0, 60]);

  // Split headline: last word gets gold accent
  const heroTitle = t('hero.title');
  const lastSpace = heroTitle.lastIndexOf(' ');
  const titleMain = heroTitle.slice(0, lastSpace);
  const titleHighlight = heroTitle.slice(lastSpace + 1);

  return (
    <div className="w-full">

      {/* ─── 1. HERO ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] flex items-center bg-[#0D0D0D] overflow-hidden"
      >
        {/* Parallax background orbs */}
        <motion.div
          className="absolute inset-0 bg-radial-gradient opacity-60 pointer-events-none"
          style={{ y: orb1Y }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none"
          style={{ y: orb1Y, background: 'radial-gradient(circle, rgba(222,182,125,0.22) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-[700px] h-[450px] rounded-full blur-[110px] pointer-events-none"
          style={{ y: orb2Y, background: 'radial-gradient(circle, rgba(180,120,60,0.18) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Hero content with subtle scroll drift */}
        <motion.div
          className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-36 pb-24"
          style={{ y: heroContentY }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp}
              className="flex items-center justify-center mb-8"
            >
              <span className="inline-block py-1.5 px-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
                ✨ {t('hero.badge')}
              </span>
            </motion.div>

            {/* Headline with gold highlight on last word */}
            <motion.h1
              initial="hidden" animate="visible" variants={fadeUp}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.08] tracking-tight"
            >
              {titleMain}{' '}
              <span className="text-primary relative inline-block">
                {titleHighlight}
                {/* Subtle glow under the highlight word */}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-primary/40 blur-[4px]"
                />
              </span>
            </motion.h1>

            <motion.p
              initial="hidden" animate="visible" variants={fadeUp}
              className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-[0_0_48px_rgba(222,182,125,0.35)]"
                data-testid="hero-cta-primary"
              >
                {t('hero.cta.primary')}
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/10 text-base font-semibold rounded-xl hover:bg-white/10 transition-all"
                data-testid="hero-cta-secondary"
              >
                {t('hero.cta.secondary')}
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom fade into white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      </section>

      {/* ─── 2. HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t('howItWorks.title')}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gray-100 -z-10" />

            {[
              { icon: ShieldCheck, title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc') },
              { icon: ScanLine,    title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc') },
              { icon: Clock,       title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc') },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 rounded-full border border-primary/20 scale-[1.15] opacity-0 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-500" />
                  <step.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. FEATURES GRID ────────────────────────────────────── */}
      <section id="features" className="py-32 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl">{t('features.title')}</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerGrid}
          >
            {[
              { icon: Clock,      title: t('features.f1.title'), desc: t('features.f1.desc') },
              { icon: Zap,        title: t('features.f2.title'), desc: t('features.f2.desc') },
              { icon: ScanLine,   title: t('features.f3.title'), desc: t('features.f3.desc') },
              { icon: PhoneOff,   title: t('features.f4.title'), desc: t('features.f4.desc') },
              { icon: Globe2,     title: t('features.f5.title'), desc: t('features.f5.desc') },
              { icon: ShieldCheck,title: t('features.f6.title'), desc: t('features.f6.desc') },
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                variants={blurFade}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center text-primary mb-6">
                  <feat.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-600">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── 4. PRICING ──────────────────────────────────────────── */}
      <section id="pricing" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-gray-50 to-white -z-10" />

        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t('pricing.title')}</h2>
            <p className="text-xl text-gray-600">{t('pricing.subtitle')}</p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-[#0D0D0D] rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              {/* Animated pricing card glow */}
              <motion.div
                className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full blur-[90px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(222,182,125,0.25) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="space-y-6 relative z-10 mb-12">
                {[
                  { label: t('pricing.tier1'), price: '39' },
                  { label: t('pricing.tier2'), price: '34', per: true },
                  { label: t('pricing.tier3'), price: '29', per: true },
                  { label: t('pricing.tier4'), price: '24', per: true },
                  { label: t('pricing.tier5'), price: '19', per: true },
                ].map((tier, i) => (
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
                <p className="text-primary font-medium mb-6 text-sm">
                  ✓ {t('pricing.badge')}
                </p>
                <a
                  href="#"
                  className="block w-full py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02]"
                >
                  {t('pricing.cta')}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 5. FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="py-32 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900">{t('faq.title')}</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Accordion type="single" collapsible defaultValue="item-0" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((i, idx) => (
                <AccordionItem key={i} value={`item-${idx}`} className="px-6 border-b border-gray-100 last:border-0">
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-primary transition-colors py-6">
                    {t(`faq.q${i}` as any)}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                    {t(`faq.a${i}` as any)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ─── 6. FINAL CTA BANNER ─────────────────────────────────── */}
      <section className="py-28 bg-[#0D0D0D] relative overflow-hidden text-white">
        {/* Animated radial glow from bottom center */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 110%, rgba(222,182,125,0.22) 0%, transparent 65%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Subtle grid texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            {/* Stats row */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-10 mb-16"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {[
                { value: '24/7', label: t('cta.stat1') },
                { value: '30+', label: t('cta.stat2') },
                { value: '< 10 min', label: t('cta.stat3') },
              ].map((stat) => (
                <motion.div key={stat.value} variants={fadeUp} className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 tracking-wide">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {t('cta.final.title')}
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              {t('cta.final.subtitle')}
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-[0_0_48px_rgba(222,182,125,0.3)]"
            >
              {t('nav.startFreeTrial')}
            </a>
            <p className="mt-5 text-sm text-gray-600">{t('pricing.badge')}</p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
