import React from 'react';
import { ArrowRight, Building2, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { SEO } from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';
import { legalDocuments } from '../lib/legalDocuments';

export default function LegalHub() {
  const { t, lang } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t('meta.legalHub.title')}
        description={t('meta.legalHub.description')}
        canonical="https://nextsphere.it/legale"
        lang={lang}
        robots="noindex, follow"
        includeAlternateLanguages={false}
      />

      <section className="relative overflow-hidden bg-[#0D0D0D] pb-24 pt-36">
        <div
          className="pointer-events-none absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(222,182,125,0.23) 0%, transparent 68%)' }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <ShieldCheck size={16} />
            {t('legal.hub.eyebrow')}
          </span>
          <h1 className="font-heading text-4xl font-bold leading-tight text-white md:text-6xl">
            {t('legal.hub.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            {t('legal.hub.subtitle')}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.74fr_1.26fr] lg:py-24">
        <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-7 shadow-sm lg:sticky lg:top-28">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 size={23} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gray-900">{t('legal.hub.companyTitle')}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{t('legal.hub.companyIntro')}</p>
          <dl className="mt-7 space-y-4 border-t border-gray-100 pt-6 text-sm leading-relaxed">
            <div>
              <dt className="font-semibold text-gray-900">{t('legal.notes.name')}</dt>
              <dd className="text-gray-600">Samir Attar</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">{t('legal.notes.registeredOffice')}</dt>
              <dd className="text-gray-600">Via Guglielmo Ciardi 38<br />30174 Mestre (VE)</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">{t('legal.notes.vatNumber')}</dt>
              <dd className="text-gray-600">04990030274</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">{t('legal.notes.taxCode')}</dt>
              <dd className="text-gray-600">TTRSMR91E22L736W</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">{t('legal.notes.email')}</dt>
              <dd>
                <a href="mailto:info@nextsphere.it" className="text-primary hover:underline">
                  info@nextsphere.it
                </a>
              </dd>
            </div>
          </dl>
        </aside>

        <div>
          <div className="mb-7">
            <h2 className="font-heading text-3xl font-bold text-gray-900">{t('legal.hub.documentsTitle')}</h2>
            <p className="mt-2 text-gray-600">{t('legal.hub.documentsIntro')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {legalDocuments.map((document) => (
              <Link
                key={document.slug}
                href={`/legale/${document.slug}`}
                className="group flex min-h-52 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText size={21} />
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                    {t('legal.hub.pdfPending')}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold leading-snug text-gray-900">
                  {t(document.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{t(document.descriptionKey)}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary">
                  {t('legal.hub.viewDocument')} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}