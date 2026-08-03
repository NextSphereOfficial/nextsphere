import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import logoLight from '@assets/logo_trasparenza_chiaro_1785754195220.png';
import logoDark from '@assets/logo_trasparenza_scuro_1785754195221.png';

export function Navbar() {
  const { t } = useTranslation();
  const { lang, setLang } = useLanguage();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location === '/';
  const isDarkContext = isHome && !scrolled;
  const logoSrc = isDarkContext ? logoLight : logoDark;

  const easing = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
          : 'bg-transparent'
      }`}
      animate={{ paddingTop: scrolled ? 10 : 20, paddingBottom: scrolled ? 10 : 20 }}
      transition={{ duration: 0.45, ease: easing }}
      data-testid="navbar"
    >
      <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-end min-h-[48px]">

        {/* Logo: centered + large at top, left + small after scroll */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-50"
          animate={{
            left: scrolled ? 24 : '50%',
            x: scrolled ? '0%' : '-50%',
          }}
          transition={{ duration: 0.45, ease: easing }}
        >
          <Link href="/">
            <motion.img
              src={logoSrc}
              alt="NextSphere"
              className="w-auto object-contain"
              animate={{ height: scrolled ? 32 : 58 }}
              transition={{ duration: 0.45, ease: easing }}
            />
          </Link>
        </motion.div>

        {/* Right controls */}
        <div className="flex items-center gap-6 relative z-10">
          <button
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            className={`text-xs font-semibold tracking-wider transition-colors hover:opacity-70 ${
              isDarkContext ? 'text-white' : 'text-gray-900'
            }`}
            data-testid="toggle-language"
          >
            <span className={lang === 'it' ? 'opacity-100' : 'opacity-50'}>IT</span>
            <span className="mx-2 opacity-30">|</span>
            <span className={lang === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
          </button>

          <a
            href="#"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-sm"
            data-testid="btn-nav-cta"
          >
            {t('nav.startFreeTrial')}
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
