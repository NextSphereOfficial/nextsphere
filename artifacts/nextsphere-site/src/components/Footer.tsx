import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from '../hooks/useTranslation';
import logoLight from '@assets/logo_trasparenza_chiaro_1785754195220.png';

function openCookieSettings() {
  window.dispatchEvent(new Event('ns:open-cookie-settings'));
}

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0D0D0D] border-t border-white/10 text-white pt-20 pb-10" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <Link href="/">
              <img src={logoLight} alt="NextSphere" className="h-8 w-auto mb-6" />
            </Link>
            <p className="text-gray-400 max-w-sm">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="md:col-span-8 flex flex-wrap gap-10 md:justify-end">
            {/* Prodotto */}
            <div>
              <h4 className="font-heading font-semibold text-white mb-6">{t('footer.nav.product')}</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href="/#how-it-works" className="hover:text-primary transition-colors">{t('footer.nav.howItWorks')}</a></li>
                <li><a href="/#features" className="hover:text-primary transition-colors">{t('footer.nav.features')}</a></li>
                <li>
                  <Link href="/pricing" className="hover:text-primary transition-colors">
                    {t('footer.nav.pricingPage')}
                  </Link>
                </li>
                <li><a href="/#faq" className="hover:text-primary transition-colors">{t('footer.nav.faq')}</a></li>
              </ul>
            </div>

            {/* Soluzioni */}
            <div>
              <h4 className="font-heading font-semibold text-white mb-6">{t('footer.nav.solutions')}</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <Link href="/airbnb" className="hover:text-primary transition-colors">
                    {t('footer.nav.airbnb')}
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="hover:text-primary transition-colors">
                    {t('footer.nav.booking')}
                  </Link>
                </li>
                <li>
                  <Link href="/guida-digitale-ospiti" className="hover:text-primary transition-colors">
                    {t('footer.nav.guestGuide')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legale */}
            <div>
              <h4 className="font-heading font-semibold text-white mb-6">{t('footer.nav.legal')}</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                    {t('footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="hover:text-primary transition-colors">
                    {t('footer.cookie')}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={openCookieSettings}
                    className="hover:text-primary transition-colors text-left"
                    data-testid="btn-cookie-settings"
                  >
                    {t('footer.cookieSettings')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
