import React from 'react';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import NotFound from './not-found';
import { LegalDocumentReader } from '../components/LegalDocumentReader';
import { SEO } from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';
import { getLegalDocument } from '../lib/legalDocuments';

export default function LegalDocumentPage() {
  const { t, lang } = useTranslation();
  const [location] = useLocation();
  const slug = location.split('/').filter(Boolean).pop() ?? '';
  const document = getLegalDocument(slug);

  if (!document) {
    return <NotFound />;
  }

  const title = t(document.titleKey);
  const description = t(document.descriptionKey);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <SEO
        title={`${title} | NextSphere`}
        description={description}
        canonical={`https://nextsphere.it/legale/${document.slug}`}
        lang={lang}
        robots="noindex, follow"
        includeAlternateLanguages={false}
      />

      <div className="mx-auto max-w-3xl px-6">
        <Link href="/legale" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-primary">
          <ArrowLeft size={16} />
          {t('legal.hub.backToIndex')}
        </Link>

        <article className="mt-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText size={27} />
          </div>
          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            {t('legal.hub.documentLabel')}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-gray-900">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">{description}</p>

          <section className="mt-10" aria-labelledby="legal-document-reader-title">
            <div className="flex items-center gap-3">
              <FileText className="text-primary" size={21} aria-hidden="true" />
              <h2 id="legal-document-reader-title" className="font-heading text-xl font-bold text-gray-900">
                {t('legal.hub.readDocumentTitle')}
              </h2>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
              <LegalDocumentReader
                title={title}
                pageCount={document.pageCount}
                pageImageBasePath={document.pageImageBasePath}
                pageLabel={t('legal.hub.pdfPageLabel')}
              />
            </div>
          </section>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <a
              href={document.pdfPath}
              download={document.downloadFileName}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              data-testid="btn-legal-pdf-download"
            >
              <Download size={18} />
              {t('legal.hub.downloadPdf')}
            </a>
            <p className="mt-3 text-sm text-gray-500">{t('legal.hub.downloadReadyHint')}</p>
          </div>
        </article>
      </div>
    </div>
  );
}