import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import logoLight from '@assets/logo_trasparenza_chiaro_1785754195220.png';
import logoDark from '@assets/logo_trasparenza_scuro_1785754195221.png';

export function Navbar() {
  const { t } = useTranslation();
  const { lang, setLang } = useLanguage();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Use dark logo only on non-home pages or when scrolled on home page (which has light background later)
  // Wait, the home page starts dark, then goes light. We'll use a glassmorphism navbar that adapts.
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location === '/';
  
  // If we are on home and not scrolled, the background is the dark hero.
  // Otherwise, if we have a light background behind the nav, we should use the dark logo.
  const isDarkHeroContext = isHome && !scrolled;
  const logoSrc = isDarkHeroContext ? logoLight : logoDark;
  
  const navClass = `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
    scrolled 
      ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 py-3 shadow-sm' 
      : 'bg-transparent py-5'
  }`;
  
  const textColor = isDarkHeroContext ? 'text-white' : 'text-gray-900';

  return (
    <nav className={navClass} data-testid="navbar">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50">
          <img src={logoSrc} alt="NextSphere" className="h-8 w-auto object-contain transition-opacity duration-300" />
        </Link>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
            className={`text-xs font-semibold tracking-wider transition-colors hover:opacity-70 ${textColor}`}
            data-testid="toggle-language"
          >
            <span className={lang === 'it' ? 'opacity-100' : 'opacity-50'}>IT</span>
            <span className="mx-2 opacity-30">|</span>
            <span className={lang === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
          </button>
          
          <a 
            href="#"
            className={`hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-all
              ${isDarkHeroContext 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-sm'
              }`}
            data-testid="btn-nav-cta"
          >
            {t('nav.startFreeTrial')}
          </a>
        </div>
      </div>
    </nav>
  );
}
