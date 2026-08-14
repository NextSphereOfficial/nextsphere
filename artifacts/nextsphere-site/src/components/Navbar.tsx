import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { trackCta } from '../lib/trackCta';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import logoLight from '@assets/logo_trasparenza_chiaro_1785754195220.png';
import logoDark from '@assets/logo_trasparenza_scuro_1785754195221.png';

const NAV_LINKS = [
  { key: 'nav.howItWorks', href: '/#how-it-works' },
  { key: 'nav.features',   href: '/#features'     },
  { key: 'nav.faq',        href: '/#faq'           },
] as const;

const SOLUTIONS_LINKS = [
  { key: 'nav.airbnb',     href: '/airbnb'                },
  { key: 'nav.booking',    href: '/booking'               },
  { key: 'nav.guestGuide', href: '/guida-digitale-ospiti' },
] as const;

const easing = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const { t } = useTranslation();
  const { lang, setLang } = useLanguage();
  const [location] = useLocation();
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [solutionsOpen, setSolutions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdown on route change
  useEffect(() => { setMenuOpen(false); setSolutions(false); }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSolutions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isHome       = location === '/';
  const isDarkContext = isHome && !scrolled;
  const logoSrc      = isDarkContext ? logoLight : logoDark;
  const textColor    = isDarkContext ? 'text-white' : 'text-gray-800';

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-gray-200/50 shadow-sm'
            : 'bg-transparent'
        }`}
        animate={{ paddingTop: scrolled ? 10 : 20, paddingBottom: scrolled ? 10 : 20 }}
        transition={{ duration: 0.45, ease: easing }}
        data-testid="navbar"
      >
        <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-end min-h-[48px]">

          {/* ── Logo ── */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 z-10"
            animate={{ left: scrolled ? 24 : '50%', x: scrolled ? '0%' : '-50%' }}
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

          {/* ── Desktop nav links (fade in when scrolled) ── */}
          <motion.div
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8"
            animate={{
              opacity: scrolled ? 1 : 0,
              y: scrolled ? 0 : -6,
              pointerEvents: scrolled ? 'auto' : 'none',
            }}
            transition={{ duration: 0.3, ease: easing }}
          >
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {t(key as any)}
              </a>
            ))}

            {/* Soluzioni dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setSolutions((v) => !v)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {t('nav.solutions')}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    {SOLUTIONS_LINKS.map(({ key, href }) => (
                      <Link
                        key={key}
                        href={href}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                        onClick={() => setSolutions(false)}
                      >
                        {t(key as any)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pricing page link */}
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {t('nav.pricing')}
            </Link>
          </motion.div>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
              className={`text-xs font-semibold tracking-wider transition-colors hover:opacity-70 ${textColor}`}
              data-testid="toggle-language"
            >
              <span className={lang === 'it' ? 'opacity-100' : 'opacity-50'}>IT</span>
              <span className="mx-1.5 opacity-30">|</span>
              <span className={lang === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`md:hidden p-1.5 rounded-lg transition-colors ${
                isDarkContext ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100'
              }`}
              aria-label="Menu"
              data-testid="btn-mobile-menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <a
              href="#"
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-sm"
              data-testid="btn-nav-cta"
              onClick={() => trackCta('navbar_desktop')}
            >
              {t('nav.startFreeTrial')}
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile full-screen menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#0D0D0D] flex flex-col items-center justify-center gap-2 md:hidden overflow-y-auto py-20"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: easing }}
          >
            <nav className="flex flex-col items-center gap-5 mb-8">
              {NAV_LINKS.map(({ key, href }, i) => (
                <motion.a
                  key={key}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-semibold text-white hover:text-primary transition-colors"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: easing }}
                >
                  {t(key as any)}
                </motion.a>
              ))}

              {/* Soluzioni label */}
              <motion.p
                className="text-xs font-semibold tracking-widest text-gray-500 uppercase mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18 }}
              >
                {t('nav.solutions')}
              </motion.p>

              {SOLUTIONS_LINKS.map(({ key, href }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.3, ease: easing }}
                >
                  <Link
                    href={href}
                    className="text-xl font-medium text-gray-300 hover:text-primary transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(key as any)}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.3, ease: easing }}
              >
                <Link
                  href="/pricing"
                  className="text-2xl font-semibold text-white hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('nav.pricing')}
                </Link>
              </motion.div>
            </nav>

            <motion.a
              href="#"
              onClick={() => { setMenuOpen(false); trackCta('navbar_mobile'); }}
              className="px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_40px_rgba(222,182,125,0.3)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.3, ease: easing }}
            >
              {t('nav.startFreeTrial')}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
