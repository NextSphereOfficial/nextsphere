import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { SEO } from '../components/SEO';
import { guideArticles } from '../blog/articles';
import { useLanguage } from '../contexts/LanguageContext';

export default function GuideArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const articles = guideArticles[lang];
  const article = articles.find((entry) => entry.slug === slug);
  const sibling = article ? articles.find((entry) => entry.slug !== article.slug) : undefined;

  const labels = lang === 'it'
    ? {
        back: 'Tutte le guide',
        author: 'Una nota di Sam, host e fondatore',
        start: 'Da dove cominciare',
        closing: 'In breve',
        next: 'Continua con un’altra guida',
        missingEyebrow: 'Pagina non trovata',
        missingTitle: 'Questa guida non è disponibile.',
        missingText: 'Il link potrebbe essere cambiato. Puoi tornare alle guide e scegliere da lì.',
        return: 'Torna alle guide',
      }
    : {
        back: 'All guides',
        author: 'A note from Sam, host and founder',
        start: 'Where to begin',
        closing: 'A final thought',
        next: 'Continue with another guide',
        missingEyebrow: 'Page not found',
        missingTitle: 'This guide is not available.',
        missingText: 'The link may have changed. Head back to the guides and choose one from there.',
        return: 'Back to the guides',
      };

  if (!article) {
    return (
      <div className="w-full bg-[#fbfaf7] text-[#191815]">
        <SEO
          title={labels.missingTitle}
          description={labels.missingText}
          canonical="https://www.nextsphere.it/blog"
          lang={lang}
          robots="noindex, follow"
        />
        <section className="mx-auto flex min-h-[65vh] max-w-6xl items-center px-6 py-24 sm:px-10 lg:px-12">
          <div className="max-w-2xl">
            <span className="mb-7 block h-px w-12 bg-[#c9a66b]" />
            <p className="mb-4 font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.17em] text-[#756d5f]">
              {labels.missingEyebrow}
            </p>
            <h1 className="font-['Montserrat',sans-serif] text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {labels.missingTitle}
            </h1>
            <p className="mt-6 max-w-lg font-['Inter',sans-serif] text-lg leading-8 text-[#625f58]">
              {labels.missingText}
            </p>
            <Link
              href="/blog"
              data-testid="link-guide-missing-return"
              className="mt-8 inline-flex min-h-11 items-center gap-2 font-['Inter',sans-serif] text-sm font-semibold text-[#28251f] transition-colors hover:text-[#8c7045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a66b] focus-visible:ring-offset-4"
            >
              <ArrowLeft aria-hidden="true" size={16} />
              {labels.return}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fbfaf7] text-[#191815]">
      <SEO
        title={`${article.title} | NextSphere`}
        description={article.description}
        canonical={`https://www.nextsphere.it/blog/${article.slug}`}
        lang={lang}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          url: `https://www.nextsphere.it/blog/${article.slug}`,
          author: { '@type': 'Person', name: 'Sam' },
          publisher: { '@type': 'Organization', name: 'NextSphere' },
        }}
      />

      <header className="relative isolate overflow-hidden border-b border-[#e9e5dc]">
        <div aria-hidden="true" className="absolute -right-24 top-20 h-64 w-64 rounded-full border border-[#e9e5dc] sm:right-[7%] sm:top-14 sm:h-[30rem] sm:w-[30rem]" />
        <div aria-hidden="true" className="absolute -right-12 top-32 h-48 w-48 rounded-full border border-[#eeeae2] sm:right-[10%] sm:top-24 sm:h-[24rem] sm:w-[24rem]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-28 sm:px-10 sm:pb-20 sm:pt-36 lg:px-12 lg:pb-24">
          <Link
            href="/blog"
            data-testid="link-guide-back"
            className="group mb-10 inline-flex min-h-10 items-center gap-2 font-['Inter',sans-serif] text-sm font-medium text-[#625f58] transition-colors hover:text-[#8c7045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a66b] focus-visible:ring-offset-4"
          >
            <ArrowLeft aria-hidden="true" size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
            {labels.back}
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <span className="mb-7 block h-px w-12 bg-[#c9a66b]" />
            <p className="mb-4 font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.17em] text-[#756d5f]">
              {labels.author}
            </p>
            <h1 className="max-w-4xl font-['Montserrat',sans-serif] text-[2.35rem] font-semibold leading-[1.13] tracking-[-0.045em] sm:text-5xl md:text-[3.5rem]">
              {article.title}
            </h1>
            <p className="mt-7 max-w-2xl border-l-2 border-[#c9a66b] pl-5 font-['Inter',sans-serif] text-lg leading-8 text-[#625f58] sm:pl-7 sm:text-xl sm:leading-9">
              {article.teaser}
            </p>
          </motion.div>
        </div>
      </header>

      <div className="px-6 py-14 sm:px-10 sm:py-20 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] md:gap-16 lg:gap-24">
          <aside className="md:sticky md:top-28 md:self-start">
            <p className="mb-4 font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.15em] text-[#a08a64]">
              {labels.start}
            </p>
            <p className="max-w-xs font-['Montserrat',sans-serif] text-lg font-medium leading-7 tracking-[-0.02em] text-[#4f4c46]">
              {article.description}
            </p>
            <Link
              href="/blog"
              data-testid="link-guide-index-aside"
              className="mt-7 inline-flex min-h-10 items-center gap-2 font-['Inter',sans-serif] text-sm font-semibold text-[#625f58] transition-colors hover:text-[#8c7045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a66b] focus-visible:ring-offset-4"
            >
              <ArrowLeft aria-hidden="true" size={15} />
              {labels.back}
            </Link>
          </aside>

          <article className="max-w-[44rem]">
            <div className="space-y-6 font-['Inter',sans-serif] text-base leading-8 text-[#4f4c46] sm:text-[17px] sm:leading-[1.9]">
              {article.introduction.map((paragraph, index) => (
                <motion.p
                  key={`intro-${index}`}
                  data-testid={`text-guide-introduction-${index + 1}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.12) }}
                  className={index === 0 ? 'text-[#28251f]' : undefined}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <div className="my-12 h-px w-full bg-[#e9e5dc] sm:my-16" />

            <div className="space-y-12 sm:space-y-16">
              {article.sections.map((section, sectionIndex) => (
                <section key={section.heading} aria-labelledby={`guide-section-${sectionIndex}`}>
                  <div className="mb-5 flex items-baseline gap-4">
                    <span aria-hidden="true" className="font-['Inter',sans-serif] text-xs font-semibold tracking-[0.14em] text-[#a08a64]">
                      0{sectionIndex + 1}
                    </span>
                    <h2 id={`guide-section-${sectionIndex}`} className="font-['Montserrat',sans-serif] text-xl font-semibold leading-snug tracking-[-0.03em] text-[#28251f] sm:text-2xl">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="space-y-5 font-['Inter',sans-serif] text-base leading-8 text-[#4f4c46] sm:text-[17px] sm:leading-[1.9]">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={`${sectionIndex}-${paragraphIndex}`} data-testid={`text-guide-section-${sectionIndex + 1}-${paragraphIndex + 1}`}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-14 border-t border-[#ded8cb] pt-8 sm:mt-20 sm:pt-10" aria-label={labels.closing}>
              {article.conclusion.map((paragraph, index) => (
                <p
                  key={`conclusion-${index}`}
                  data-testid={`text-guide-conclusion-${index + 1}`}
                  className="font-['Montserrat',sans-serif] text-lg font-medium leading-8 tracking-[-0.015em] text-[#35312a] sm:text-xl sm:leading-9"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          </article>
        </div>
      </div>

      {sibling && (
        <footer className="bg-[#f5f2eb] px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-6xl border-t border-[#ded8cb] pt-8 sm:pt-10">
            <p className="mb-5 font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.15em] text-[#a08a64]">
              {labels.next}
            </p>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="max-w-3xl font-['Montserrat',sans-serif] text-2xl font-semibold leading-snug tracking-[-0.03em] sm:text-3xl">
                {sibling.title}
              </h2>
              <Link
                href={`/blog/${sibling.slug}`}
                data-testid={`link-guide-sibling-${sibling.slug}`}
                className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-['Inter',sans-serif] text-sm font-semibold text-[#28251f] transition-colors hover:text-[#8c7045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a66b] focus-visible:ring-offset-4"
              >
                {lang === 'it' ? 'Leggi la guida' : 'Read the guide'}
                <ArrowRight aria-hidden="true" size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
            <Link
              href="/blog"
              data-testid="link-guide-footer-index"
              className="mt-9 inline-flex min-h-10 items-center gap-2 font-['Inter',sans-serif] text-sm font-medium text-[#625f58] transition-colors hover:text-[#8c7045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a66b] focus-visible:ring-offset-4"
            >
              <ArrowLeft aria-hidden="true" size={15} />
              {labels.back}
            </Link>
          </div>
        </footer>
      )}
    </div>
  );
}
