import { useTranslation } from '../hooks/useTranslation';
import { PLATFORM_URL } from '../lib/externalLinks';
import { trackCta } from '../lib/trackCta';
import './pricing-offer.css';

function Price({ centered = false }: { centered?: boolean }) {
  const { t, lang } = useTranslation();
  const format = (price: number) => `€${price.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return (
    <>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#deb67d]/30 bg-[#deb67d]/[.09] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#e4c18f]">
        {t('offer.limited')}
      </div>
      {centered && <p className="mb-1 text-[13px] text-white/60">{t('offer.allIncluded')}</p>}
      <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${centered ? 'justify-center' : ''}`}>
        <del className="text-[16px] text-white/45 decoration-[#deb67d]/75 decoration-1">{format(11.99)}</del>
        <span className="font-heading text-[57px] font-bold leading-none tracking-[-.06em] text-[#f2d6ad] sm:text-[68px]">{format(9.99)}</span>
        <span className="pb-1 text-[14px] text-white/60">{t('offer.perProperty')}</span>
      </div>
      <p className="mt-2 text-[13px] font-semibold text-[#e5c493]">{t('offer.locked')}*</p>
    </>
  );
}

function TrialAction({ centered = false }: { centered?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className={centered ? 'mx-auto mt-6 max-w-sm border-t border-white/10 pt-5' : 'rounded-2xl border border-white/10 bg-white/[.035] p-5 sm:p-6'}>
      {!centered && <p className="text-[12px] font-semibold uppercase tracking-[.12em] text-[#d7bc96]">{t('offer.startCalm')}</p>}
      <p className={centered ? 'mb-4 text-[12px] font-medium text-[#d8bd97]' : 'mt-2 text-[13px] leading-6 text-white/65'}>{t('pricing.badge')}</p>
      <a
        href={PLATFORM_URL}
        data-testid={centered ? 'home-pricing-cta' : 'pricing-offer-cta'}
        onClick={() => trackCta('pricing')}
        className={`offer-cta block w-full rounded-xl bg-[#deb67d] px-5 py-3.5 text-center text-[14px] font-semibold text-[#171411] ${centered ? '' : 'mt-5'}`}
      >
        {t('pricing.cta')}
      </a>
      {!centered && <p className="mt-3 text-center text-[12px] leading-5 text-white/70">{t('offer.flexible')}</p>}
    </div>
  );
}

export function HomePricingOffer() {
  const { t } = useTranslation();
  return (
    <section id="pricing" className="ns-pricing-offer relative overflow-hidden px-5 py-12 sm:px-8 sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[.23em] text-[#8a7a63] sm:mb-10 sm:text-[11px]">
          <span className="h-px w-8 bg-[#c6a477]" />{t('offer.home.eyebrow')}<span className="h-px w-8 bg-[#c6a477]" />
        </div>
        <div className="grid items-center gap-8 md:grid-cols-[.85fr_1.15fr] md:gap-12">
          <div className="mx-auto max-w-md text-center md:mx-0 md:text-left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-[#a8875c]">{t('offer.home.kicker')}</p>
            <h2 className="mb-4 text-[30px] font-bold leading-[1.14] tracking-[-.045em] text-[#171614] sm:text-[38px]">{t('offer.home.title')}</h2>
            <p className="mx-auto max-w-sm text-[15px] leading-7 text-[#65615b] md:mx-0">{t('offer.home.description')}</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#e5dccd] bg-white/70 px-3.5 py-2 text-[12px] font-medium text-[#615d56]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#b89668]" />{t('offer.home.available')}
            </div>
          </div>
          <article className="offer-panel relative overflow-hidden rounded-[27px] px-7 py-8 text-center text-white sm:rounded-[32px] sm:px-10 sm:py-9">
            <div className="relative z-10">
              <Price centered />
              <p className="mx-auto mt-3 max-w-md text-[12px] leading-5 text-white/55">{t('offer.home.replies')}</p>
              <TrialAction centered />
              <p className="mt-4 text-[12px] leading-5 text-white/70">{t('offer.flexible')}</p>
            </div>
          </article>
        </div>
        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[#e7dfd3] bg-white/75 px-5 py-4 text-center sm:px-7">
          <p className="text-[12px] leading-5 text-[#625e57] sm:text-[13px] sm:leading-6">
            <strong className="font-semibold text-[#26231f]">*{t('offer.foreverTitle')}</strong>{' '}{t('offer.activation')}
          </p>
        </div>
      </div>
    </section>
  );
}

export function PricingOfferIntro() {
  const { t } = useTranslation();
  return (
    <div className="ns-pricing-offer">
      <section className="relative overflow-hidden bg-[#0d0d0d] px-5 pb-14 pt-36 text-center text-white sm:px-8 sm:pb-16 sm:pt-36">
        <div aria-hidden="true" className="offer-hero-glow pointer-events-none absolute -right-20 -top-32 h-[390px] w-[390px] rounded-full blur-[80px] sm:right-[12%] sm:top-[-210px] sm:h-[560px] sm:w-[560px]" />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#deb67d]/30 bg-[#deb67d]/[.08] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[.17em] text-[#e2c08f] sm:mb-6 sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#deb67d]" />{t('pricing.page.hero.badge')}
          </span>
          <h1 className="mx-auto max-w-2xl text-[34px] font-bold leading-[1.12] tracking-[-.045em] sm:text-[48px] md:text-[54px]">
            {t('pricing.page.hero.title')}<br className="hidden sm:block" />{' '}{t('offer.page.titleSecond')}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-6 text-white/60 sm:mt-5 sm:text-[16px] sm:leading-7">{t('offer.page.description')}</p>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[.16em] text-[#c7b18f]">{t('offer.allIncluded')}</p>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#f7f5f1]" />
      </section>
      <section className="relative px-5 pb-12 pt-1 sm:px-8 sm:pb-16">
        <div className="mx-auto max-w-[880px]">
          <article className="offer-panel relative overflow-hidden rounded-[28px] px-6 py-7 text-white sm:rounded-[34px] sm:px-10 sm:py-9">
            <div className="relative z-10 grid gap-7 md:grid-cols-[1fr_.86fr] md:items-center md:gap-10">
              <div>
                <Price />
                <p className="mt-4 max-w-md text-[13px] leading-6 text-white/60">{t('offer.page.replies')}</p>
              </div>
              <TrialAction />
            </div>
          </article>
          <section className="mt-6 grid gap-4 sm:grid-cols-[.72fr_1.28fr]">
            <div className="rounded-2xl border border-[#e7dfd3] bg-white/80 p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#9b7d57]">{t('offer.how')}</p>
              <h2 className="mt-2 text-[18px] font-bold leading-snug tracking-[-.025em] text-[#201e1a]">{t('offer.lockTitle')}</h2>
              <p className="mt-2 text-[13px] leading-6 text-[#6d6962]">*{t('offer.activation')}</p>
            </div>
            <div className="rounded-2xl border border-[#e7dfd3] bg-[#f1ece4] p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#9b7d57]">{t('offer.freedom')}</p>
              <h2 className="mt-2 text-[18px] font-bold leading-snug tracking-[-.025em] text-[#201e1a]">{t('offer.freedomTitle')}</h2>
              <p className="mt-2 text-[13px] leading-6 text-[#514c44]">{t('offer.flexible')}</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
