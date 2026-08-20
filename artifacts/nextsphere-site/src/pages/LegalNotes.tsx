import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { SEO } from '../components/SEO';

export default function LegalNotes() {
  const { t, lang } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <SEO
        title={`${t('legal.notes.title')} | NextSphere`}
        description={t('meta.legalNotes.description')}
        canonical="https://nextsphere.it/note-legali"
        lang={lang}
      />
      <div className="max-w-3xl mx-auto px-6 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('legal.notes.title')}</h1>
        <p className="text-gray-600 leading-relaxed mb-10">{t('legal.notes.intro')}</p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('legal.notes.h1')}</h2>
          <address className="not-italic space-y-4 text-gray-600 leading-relaxed">
            <div>
              <dt className="font-semibold text-gray-900">{t('legal.notes.name')}</dt>
              <dd>Samir Attar</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">{t('legal.notes.registeredOffice')}</dt>
              <dd>Via Guglielmo Ciardi 38<br />30174 Mestre (VE)</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">{t('legal.notes.vatNumber')}</dt>
              <dd>04990030274</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">{t('legal.notes.taxCode')}</dt>
              <dd>TTRSMR91E22L736W</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">{t('legal.notes.email')}</dt>
              <dd>
                <a href="mailto:info@nextsphere.it" className="text-primary hover:underline">
                  info@nextsphere.it
                </a>
              </dd>
            </div>
          </address>
        </section>
      </div>
    </div>
  );
}