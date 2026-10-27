import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'wouter';
import { SEO } from '../components/SEO';
import { guideArticles } from '../blog/articles';
import { useTranslation } from '../hooks/useTranslation';

export default function Guides() {
  const { lang } = useTranslation();
  const articles = guideArticles[lang];
  const copy = lang === 'it'
    ? {
        eyebrow: 'Appunti per chi ospita',
        headline: <>Una buona accoglienza<br className="hidden sm:block" /> lascia spazio anche a te.</>,
        intro: 'Idee pratiche per accompagnare gli ospiti con cura, senza dover essere sempre con il telefono in mano.',
        byline: 'Dal punto di vista di Sam, host e fondatore di NextSphere.',
        read: 'Leggi la guida',
        minutes: 'Una lettura per volta',
        note: 'Pensieri nati tra un arrivo, una domanda e il resto della giornata.',
      }
    : {
        eyebrow: 'Notes for hosts',
        headline: <>Good hospitality<br className="hidden sm:block" /> leaves room for you, too.</>,
        intro: 'Practical ways to look after your guests without having to keep your phone in your hand all day.',
        byline: 'From Sam, host and founder of NextSphere.',
        read: 'Read the guide',
        minutes: 'One thoughtful read at a time',
        note: 'Ideas shaped between an arrival, a question and the rest of the day.',
      };

  return (
    <div className="w-full bg-[#fbfaf7] text-[#191815]">
      <SEO
        title={lang === 'it' ? 'Guide per host | NextSphere' : 'Guides for hosts | NextSphere'}
        description={lang === 'it'
          ? 'Consigli pratici per chi accoglie ospiti in B&B e case vacanza, scritti da un host.'
          : 'Practical advice for B&B and holiday rental hosts, written by a host.'}
        canonical="https://www.nextsphere.it/blog"
        lang={lang}
      />

      <section className="relative isolate overflow-hidden border-b border-[#e9e5dc]">
        <div aria-hidden="true" className="absolute -right-20 top-20 h-64 w-64 rounded-full border border-[#e9e5dc] sm:right-[8%] sm:top-24 sm:h-[27rem] sm:w-[27rem]" />
        <div aria-hidden="true" className="absolute -right-10 top-32 h-48 w-48 rounded-full border border-[#eeeae2] sm:right-[11%] sm:top-32 sm:h-[21rem] sm:w-[21rem]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-28 sm:px-10 sm:pb-24 sm:pt-36 lg:px-12 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <span className="mb-8 flex items-center gap-3 font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.17em] text-[#756d5f]">
              <span aria-hidden="true" className="h-px w-10 bg-[#c9a66b]" />
              {copy.eyebrow}
            </span>
            <h1 className="font-['Montserrat',sans-serif] text-[2.65rem] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-6xl">
              {copy.headline}
            </h1>
            <p className="mt-7 max-w-xl font-['Inter',sans-serif] text-lg leading-8 text-[#625f58] sm:text-xl sm:leading-9">
              {copy.intro}
            </p>
            <p className="mt-5 font-['Inter',sans-serif] text-sm leading-6 text-[#777168]">
              {copy.byline}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] px-6 py-16 sm:px-10 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 border-b border-[#ded8cb] pb-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-4 block h-px w-10 bg-[#c9a66b]" />
              <h2 className="font-['Montserrat',sans-serif] text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {lang === 'it' ? 'Guide dalla vita vera' : 'Guides from real hosting'}
              </h2>
            </div>
            <p className="flex items-center gap-2 font-['Inter',sans-serif] text-sm text-[#777168]">
              <BookOpen aria-hidden="true" size={16} strokeWidth={1.6} />
              {copy.minutes}
            </p>
          </div>

          <div className="divide-y divide-[#ded8cb]">
            {articles.map((article, index) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="grid gap-5 py-8 first:pt-0 last:pb-0 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:items-start md:gap-8 md:py-10"
              >
                <span className="font-['Inter',sans-serif] text-xs font-medium tracking-[0.16em] text-[#a08a64]">
                  0{index + 1}
                </span>
                <div className="max-w-3xl">
                  <p className="mb-3 font-['Inter',sans-serif] text-sm leading-6 text-[#777168]">
                    {article.teaser}
                  </p>
                  <h3 className="font-['Montserrat',sans-serif] text-xl font-semibold leading-snug tracking-[-0.025em] sm:text-2xl">
                    {article.title}
                  </h3>
                  <p className="mt-4 max-w-2xl font-['Inter',sans-serif] text-base leading-7 text-[#625f58]">
                    {article.description}
                  </p>
                  <Link
                    href={`/blog/${article.slug}`}
                    data-testid={`link-guide-${article.slug}`}
                    className="group mt-6 inline-flex min-h-11 items-center gap-2 font-['Inter',sans-serif] text-sm font-semibold text-[#28251f] transition-colors hover:text-[#8c7045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a66b] focus-visible:ring-offset-4"
                  >
                    {copy.read}
                    <ArrowRight aria-hidden="true" size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
                <ArrowDownRight aria-hidden="true" className="hidden text-[#b6a787] md:block" size={22} strokeWidth={1.4} />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <aside className="px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 border-l-2 border-[#c9a66b] pl-5 sm:flex-row sm:items-center sm:justify-between sm:pl-7">
          <p className="max-w-xl font-['Inter',sans-serif] text-base leading-7 text-[#625f58]">{copy.note}</p>
        </div>
      </aside>
    </div>
  );
}
