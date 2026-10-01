import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function DemoTeaser({ onOpen }: { onOpen: (e: React.MouseEvent<HTMLElement>) => void }) {
  const { t } = useTranslation();
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const scrollToDemo = () => {
      if (window.location.hash !== '#demo') return;
      frame = window.requestAnimationFrame(() => section.current?.scrollIntoView({ block: 'start', behavior: 'instant' }));
    };
    scrollToDemo();
    window.addEventListener('hashchange', scrollToDemo);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', scrollToDemo);
    };
  }, []);
  return (
    <section id="demo" ref={section} className="bg-[#0D0D0D] text-white px-6 pb-20 pt-4 scroll-mt-24">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-8 rounded-2xl border border-primary/20 bg-white/[0.03] p-6 sm:p-8">
        <div className="flex-1 text-center sm:text-left">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">{t('demo.eyebrow')}</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t('demo.title')}</h2>
          <p className="text-gray-400 text-sm sm:text-base">{t('demo.subtitle')}</p>
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpen}
            data-testid="demo-teaser-open"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all"
          >
            <Play size={18} aria-hidden /> {t('demo.open')}
          </button>
          <span className="text-xs text-gray-500">{t('demo.teaser.meta')}</span>
        </div>
      </div>
    </section>
  );
}
