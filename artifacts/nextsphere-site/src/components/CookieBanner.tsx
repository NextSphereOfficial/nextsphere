import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Link } from 'wouter';

export function CookieBanner() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ns_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem('ns_cookie_consent', choice);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-4xl mx-auto bg-card border border-border shadow-xl rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {t('cookieBanner.text')}{' '}
          <Link href="/cookie-policy" className="underline hover:text-foreground transition-colors">
            {t('footer.cookie')}
          </Link>
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleConsent('rejected')}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
            data-testid="btn-cookie-reject"
          >
            {t('cookieBanner.reject')}
          </button>
          <button
            onClick={() => handleConsent('accepted')}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
            data-testid="btn-cookie-accept"
          >
            {t('cookieBanner.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
