import { motion } from 'framer-motion';
import type { TranslationKey } from '../i18n/translations';
import { SEO } from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';

const paragraphs = Array.from({ length: 14 }, (_, index) =>
  `about.p${index + 1}` as TranslationKey
);

export default function About() {
  const { t, lang } = useTranslation();

  return (
    <div className="w-full bg-[#fbfaf7] text-[#191815]">
      <SEO
        title={t('meta.about.title')}
        description={t('meta.about.description')}
        canonical="https://www.nextsphere.it/about"
        lang={lang}
      />

      <section className="relative isolate overflow-hidden border-b border-[#e9e5dc] bg-[#fbfaf7]">
        <div
          aria-hidden="true"
          className="absolute -right-24 top-12 h-72 w-72 rounded-full border border-[#e9e5dc] md:right-[7%] md:top-16 md:h-[30rem] md:w-[30rem]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-12 top-28 h-56 w-56 rounded-full border border-[#eeeae2] md:right-[10%] md:top-28 md:h-[24rem] md:w-[24rem]"
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-28 sm:px-10 sm:pb-24 sm:pt-36 lg:px-12 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <span aria-hidden="true" className="mb-8 block h-px w-14 bg-[#c9a66b]" />
            <h1 className="max-w-3xl font-['Montserrat',sans-serif] text-4xl font-semibold leading-[1.12] tracking-[-0.04em] sm:text-5xl md:text-6xl">
              {t('about.title')}
            </h1>
            <div className="mt-9 max-w-2xl border-l-2 border-[#c9a66b] pl-5 sm:pl-7">
              <p className="font-['Inter',sans-serif] text-lg leading-8 text-[#625f58] sm:text-xl sm:leading-9">
                {t(paragraphs[0])}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f5f2eb] px-6 py-16 sm:px-10 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:gap-16 lg:gap-24">
          <div className="md:sticky md:top-28 md:self-start">
            <span aria-hidden="true" className="mb-6 block h-px w-10 bg-[#c9a66b]" />
            <h2 className="max-w-sm font-['Montserrat',sans-serif] text-2xl font-semibold leading-snug tracking-[-0.03em] sm:text-3xl">
              {t('about.storyTitle')}
            </h2>
          </div>

          <div className="space-y-6 font-['Inter',sans-serif] text-base leading-8 text-[#4f4c46] sm:space-y-7 sm:text-[17px] sm:leading-[1.9]">
            {paragraphs.slice(1).map((key, index) => (
              <motion.p
                key={key}
                data-testid={`text-about-paragraph-${index + 2}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.15) }}
                className={index === paragraphs.length - 2
                  ? 'border-t border-[#ded8cb] pt-7 text-lg font-medium leading-8 text-[#28251f] sm:text-xl sm:leading-9'
                  : undefined}
              >
                {t(key)}
              </motion.p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
