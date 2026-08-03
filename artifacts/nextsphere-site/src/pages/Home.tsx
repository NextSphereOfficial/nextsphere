import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Zap, Globe2, ScanLine, Clock, PhoneOff } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import decorativeSphere from '@assets/logo_ns_vector_1_1785754189944.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* 1. Hero Section (Dark Theme with Radial Glow) */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0D0D0D] overflow-hidden">
        {/* Abstract gradient orbs */}
        <div className="absolute inset-0 bg-radial-gradient opacity-60"></div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-amber-900/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-32 pb-20">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-4 mb-6">
              <img src={decorativeSphere} alt="" className="w-10 h-10 object-contain opacity-80" />
              <span className="inline-block py-1.5 px-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
                ✨ {t('hero.badge')}
              </span>
            </motion.div>
            
            <motion.h1 
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight"
            >
              {t('hero.title')}
            </motion.h1>
            
            <motion.p 
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a 
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(222,182,125,0.3)]"
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
        </div>
      </section>

      {/* 2. How it works */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t('howItWorks.title')}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gray-100 -z-10"></div>
            
            {[
              { icon: ShieldCheck, title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc') },
              { icon: ScanLine, title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc') },
              { icon: Clock, title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc') },
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 rounded-full border border-primary/20 scale-[1.15] opacity-0 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-500"></div>
                  <step.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features grid */}
      <section id="features" className="py-32 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl">{t('features.title')}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: t('features.f1.title'), desc: t('features.f1.desc') },
              { icon: Zap, title: t('features.f2.title'), desc: t('features.f2.desc') },
              { icon: ScanLine, title: t('features.f3.title'), desc: t('features.f3.desc') },
              { icon: PhoneOff, title: t('features.f4.title'), desc: t('features.f4.desc') },
              { icon: Globe2, title: t('features.f5.title'), desc: t('features.f5.desc') },
              { icon: ShieldCheck, title: t('features.f6.title'), desc: t('features.f6.desc') },
            ].map((feat, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 mb-6">
                  <feat.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-600">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pricing */}
      <section id="pricing" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-gray-50 to-white -z-10"></div>
        
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
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="space-y-6 relative z-10 mb-12">
                {[
                  { label: t('pricing.tier1'), price: "39" },
                  { label: t('pricing.tier2'), price: "34", per: true },
                  { label: t('pricing.tier3'), price: "29", per: true },
                  { label: t('pricing.tier4'), price: "24", per: true },
                  { label: t('pricing.tier5'), price: "19", per: true },
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

      {/* 5. FAQ */}
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

      {/* 6. Contact / CTA */}
      <section id="contact" className="py-32 bg-[#0D0D0D] relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-full h-full bg-radial-glow opacity-50 pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('contact.title')}</h2>
            <p className="text-xl text-gray-400">{t('contact.subtitle')}</p>
          </motion.div>

          <motion.form 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="glass-card p-8 md:p-10 rounded-3xl"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const subject = `Richiesta info NextSphere da ${fd.get('name')}`;
              const body = `Nome: ${fd.get('name')}%0AEmail: ${fd.get('email')}%0ATipo: ${fd.get('propertyType')}%0A%0AMessaggio:%0A${fd.get('message')}`;
              window.location.href = `mailto:info@nextsphere.it?subject=${subject}&body=${body}`;
            }}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{t('contact.name')}</label>
                <input required name="name" type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{t('contact.email')}</label>
                <input required name="email" type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium text-gray-300">{t('contact.propertyType')}</label>
              <select required name="propertyType" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none">
                <option value="B&B">{t('contact.pt.bb')}</option>
                <option value="Casa vacanze">{t('contact.pt.holiday')}</option>
                <option value="Hotel">{t('contact.pt.hotel')}</option>
                <option value="Altro">{t('contact.pt.other')}</option>
              </select>
            </div>
            
            <div className="space-y-2 mb-8">
              <label className="text-sm font-medium text-gray-300">{t('contact.message')}</label>
              <textarea required name="message" rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
            </div>
            
            <button type="submit" className="w-full py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02]">
              {t('contact.submit')}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
