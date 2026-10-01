import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import DemoVideo from './DemoVideo';
import { DemoWatchSession } from '../lib/demoWatchSession';
import { useTranslation } from '../hooks/useTranslation';
import { PLATFORM_URL } from '../lib/externalLinks';
import { trackCta } from '../lib/trackCta';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

export default function DemoOverlay({ open, onOpenChange, triggerRef }: Props) {
  const { t } = useTranslation();
  const session = useRef(new DemoWatchSession());
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    if (open) {
      session.current.restart();
      setShowTranscript(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        overlayClassName="z-[100] bg-black/85"
        data-testid="demo-dialog"
        onCloseAutoFocus={(e) => {
          const el = triggerRef.current;
          if (el && el.isConnected) {
            e.preventDefault();
            el.focus({ preventScroll: true });
          }
        }}
        className="demo-dialog z-[101] flex flex-col gap-0 p-0 w-full max-w-5xl sm:w-[calc(100vw-2rem)] h-[100dvh] max-h-[100dvh] sm:h-[calc(100dvh-2rem)] sm:max-h-[850px] sm:rounded-2xl border-primary/20 bg-[#0D0D0D] text-white overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] [&:fullscreen]:left-0 [&:fullscreen]:top-0 [&:fullscreen]:translate-x-0 [&:fullscreen]:translate-y-0 [&:fullscreen]:w-screen [&:fullscreen]:h-screen [&:fullscreen]:max-w-none [&:fullscreen]:max-h-none [&:fullscreen]:rounded-none"
      >
        <div className="flex items-center justify-between gap-3 pl-4 pr-1 shrink-0">
          <DialogTitle className="text-base font-semibold text-white leading-tight">{t('demo.title')}</DialogTitle>
          <DialogDescription className="sr-only">{t('demo.subtitle')}</DialogDescription>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            data-testid="demo-close"
            aria-label={t('demo.close')}
            className="inline-flex shrink-0 h-11 w-11 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={22} aria-hidden />
          </button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col px-3 sm:px-4">
          {open && <DemoVideo watchSession={session.current} />}
        </div>

        <div className="shrink-0 px-4 py-3 flex flex-col gap-2 border-t border-white/10">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              aria-expanded={showTranscript}
              aria-controls="demo-transcript"
              onClick={() => setShowTranscript((v) => !v)}
              className="inline-flex items-center gap-1 min-h-[44px] text-sm text-gray-300 hover:text-white"
            >
              {t('demo.transcript.title')}
              <ChevronDown size={16} aria-hidden className={`transition-transform ${showTranscript ? 'rotate-180' : ''}`} />
            </button>
            <a
              href={PLATFORM_URL}
              onClick={() => trackCta('demo')}
              data-testid="demo-cta"
              className="inline-flex items-center justify-center min-h-[44px] px-5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90"
            >
              {t('demo.cta')}
            </a>
          </div>
            <ol id="demo-transcript" className={showTranscript ? "max-h-28 overflow-y-auto list-decimal pl-5 text-sm text-gray-400 space-y-1" : "sr-only"}>
              <li>{t('demo.transcript.step1')}</li>
              <li>{t('demo.transcript.step2')}</li>
              <li>{t('demo.transcript.step3')}</li>
            </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
}
