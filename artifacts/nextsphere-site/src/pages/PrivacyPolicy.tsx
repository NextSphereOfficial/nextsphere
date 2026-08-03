import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { SEO } from '../components/SEO';

export default function PrivacyPolicy() {
  const { t, lang } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <SEO
        title={`${t('legal.privacy.title')} | NextSphere`}
        description={t('meta.privacy.description')}
        canonical="https://nextsphere.it/privacy-policy"
        lang={lang}
      />
      <div className="max-w-3xl mx-auto px-6 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('legal.privacy.title')}</h1>
        <p className="text-sm text-gray-500 mb-10">{t('legal.privacy.lastUpdated')}</p>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed mb-8">
            {t('legal.privacy.p1')}
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t('legal.privacy.h1')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('legal.privacy.h1.text')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t('legal.privacy.h2')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('legal.privacy.h2.text')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t('legal.privacy.h3')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('legal.privacy.h3.text')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t('legal.privacy.h4')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('legal.privacy.h4.text')}</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">{t('legal.privacy.h5')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('legal.privacy.h5.text')}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
