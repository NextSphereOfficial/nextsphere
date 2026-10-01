import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, Loader2, Clock, MessageCircle, SlidersHorizontal, Maximize, Minimize } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { PLATFORM_URL } from '../lib/externalLinks';
import { trackAnalyticsEvent, trackCta } from '../lib/trackCta';
import { DemoWatchSession, type DemoVideoEvent, type DemoVideoProperties } from '../lib/demoWatchSession';

const BASE = import.meta.env.BASE_URL;
const SRC = `${BASE}media/nextsphere-demo.mp4`.replace(/\/{2,}/g, '/');
const POSTER = `${BASE}media/nextsphere-demo-poster.jpg`.replace(/\/{2,}/g, '/');
declare const __NEXTSPHERE_DEMO_PORTRAIT__: null | {
  src: string; poster: string | null; width: number; height: number;
};
const PORTRAIT = typeof __NEXTSPHERE_DEMO_PORTRAIT__ === 'undefined' ? null : __NEXTSPHERE_DEMO_PORTRAIT__;
type IosVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

function trackVideo(event: DemoVideoEvent, properties: DemoVideoProperties) {
  return trackAnalyticsEvent(event, properties, `${event}_${properties.mode}_${properties.watch}`);
}

export default function DemoVideo() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [attached, setAttached] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const playerRef = useRef<HTMLDivElement>(null);
  const [portrait, setPortrait] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);
  const userPaused = useRef(false);
  const autoplayed = useRef(false);
  const autoStarted = useRef(false);
  const inView = useRef(false);
  const reduce = useRef(false);
  const pending = useRef<null | 'auto' | 'manual'>(null);
  const watchSession = useRef(new DemoWatchSession());
  const playMode = useRef<'auto' | 'manual'>('auto');
  const lastSource = useRef<string | null>(null);

  // Switch the actual source, not an enlarged/cropped landscape video.
  useEffect(() => {
    if (!PORTRAIT) return;
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => {
      const v = videoRef.current;
      if (v && !v.paused) v.pause();
      pending.current = null;
      setPortrait(mq.matches);
      setStatus('idle');
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const v = videoRef.current as IosVideo | null;
    setCanFullscreen(Boolean(document.fullscreenEnabled && playerRef.current?.requestFullscreen) || Boolean(v?.webkitEnterFullscreen));
    const update = () => setFullscreen(document.fullscreenElement === playerRef.current);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  const toggleFullscreen = async () => {
    setFullscreenError(false);
    try {
      if (document.fullscreenElement === playerRef.current) await document.exitFullscreen();
      else if (document.fullscreenEnabled && playerRef.current?.requestFullscreen) await playerRef.current.requestFullscreen();
      else {
        const v = videoRef.current as IosVideo | null;
        if (!v?.webkitEnterFullscreen) throw new Error('Fullscreen unavailable');
        v.webkitEnterFullscreen();
      }
    } catch {
      setFullscreenError(true);
    }
  };

  // In a client-rendered page the browser sees #demo before this section exists.
  useEffect(() => {
    if (window.location.hash !== '#demo') return;
    const frame = window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const safePlay = useCallback((mode: 'auto' | 'manual') => {
    const v = videoRef.current;
    if (!v) return;
    if (document.hidden || userPaused.current || (mode === 'auto' && (!inView.current || reduce.current))) {
      setStatus('paused');
      return;
    }
    autoStarted.current = mode === 'auto';
    playMode.current = mode;
    setStatus((s) => (s === 'playing' ? s : 'loading'));
    v.play().then(() => {
      if (document.hidden || userPaused.current || (mode === 'auto' && (!inView.current || reduce.current))) v.pause();
    }).catch((e: unknown) => {
      const name = e instanceof DOMException ? e.name : '';
      if (name === 'AbortError') return;
      if (name === 'NotAllowedError') setStatus('paused');
      else setStatus('error');
    });
  }, []);

  const requestPlay = useCallback((mode: 'auto' | 'manual') => {
    if (!videoRef.current?.getAttribute('src')) {
      pending.current = mode;
      setStatus('loading');
      setAttached(true);
      return;
    }
    pending.current = null;
    safePlay(mode);
  }, [safePlay]);

  // Lazy attach near viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) { setAttached(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAttached(true); io.disconnect(); }
    }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Run queued play once src is committed
  useEffect(() => {
    if (!attached || !pending.current) return;
    const mode = pending.current;
    pending.current = null;
    if (document.hidden || !inView.current || userPaused.current || (mode === 'auto' && reduce.current)) {
      setStatus('paused');
      return;
    }
    safePlay(mode);
  }, [attached, safePlay]);

  // Reduced-motion listener
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduce.current = mq.matches;
    const onChange = () => {
      reduce.current = mq.matches;
      if (mq.matches) {
        if (pending.current === 'auto') { pending.current = null; setStatus('idle'); }
        const v = videoRef.current;
        if (v && !v.paused && autoStarted.current) v.pause();
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Playback visibility on the frame itself
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => {
      const on = e.intersectionRatio >= 0.5;
      inView.current = on;
      const v = videoRef.current;
      if (on) {
        if (!reduce.current && !autoplayed.current && !userPaused.current && !document.hidden) {
          autoplayed.current = true;
          requestPlay('auto');
        }
      } else {
        if (pending.current) {
          if (pending.current === 'auto') autoplayed.current = false;
          pending.current = null;
          setStatus('paused');
        }
        // Native video fullscreen (iOS) can report the inline frame offscreen.
        if (v && !v.paused && !document.fullscreenElement && !(v as IosVideo & { webkitDisplayingFullscreen?: boolean }).webkitDisplayingFullscreen) v.pause();
      }
    }, { threshold: [0, 0.5, 1] });
    io.observe(el);
    const onVis = () => {
      if (!document.hidden) return;
      if (pending.current) {
        if (pending.current === 'auto') autoplayed.current = false;
        pending.current = null;
        setStatus('paused');
      }
      const v = videoRef.current;
      if (v && !v.paused) v.pause();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, [requestPlay]);

  const toggle = () => {
    const v = videoRef.current;
    if ((v && !v.paused && !v.ended) || pending.current) {
      userPaused.current = true;
      autoplayed.current = true;
      if (pending.current) { pending.current = null; setStatus('paused'); }
      if (v && !v.paused) v.pause();
      return;
    }
    userPaused.current = false;
    autoplayed.current = true;
    if (v && v.ended) {
      watchSession.current.restart();
      v.currentTime = 0;
    }
    requestPlay('manual');
  };
  const replay = () => {
    const v = videoRef.current;
    userPaused.current = false;
    autoplayed.current = true;
    watchSession.current.restart();
    if (v && v.getAttribute('src')) v.currentTime = 0;
    requestPlay('manual');
  };
  const retry = () => {
    const v = videoRef.current;
    if (!v) return;
    userPaused.current = false;
    autoplayed.current = true;
    setStatus('loading');
    watchSession.current.restart();
    v.load();
    safePlay('manual');
  };

  const playing = status === 'playing' || status === 'loading';
  const src = portrait && PORTRAIT ? `${BASE}${PORTRAIT.src}`.replace(/\/{2,}/g, '/') : SRC;
  // A remounted video has a different run even if the previous one was paused.
  useEffect(() => {
    if (lastSource.current !== src) {
      watchSession.current.restart();
      lastSource.current = src;
    }
  }, [src]);
  const poster = portrait && PORTRAIT?.poster ? `${BASE}${PORTRAIT.poster}`.replace(/\/{2,}/g, '/') : POSTER;
  const btn = 'inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]';

  return (
    <section id="demo" ref={sectionRef} aria-labelledby="demo-title" className="relative scroll-mt-24 bg-[#0D0D0D] text-white pb-24 pt-8 sm:pt-12 overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(222,182,125,0.14) 0%, transparent 70%)' }} />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            <span className="h-px w-8 bg-primary/50" />{t('demo.eyebrow')}<span className="h-px w-8 bg-primary/50" />
          </p>
          <h2 id="demo-title" className="text-3xl md:text-5xl font-bold leading-[1.1] mb-4">{t('demo.title')}</h2>
          <p className="text-gray-400 text-lg leading-relaxed">{t('demo.subtitle')}</p>
        </div>

        <div ref={playerRef} className={`demo-player rounded-[1.5rem] p-2 sm:p-3 border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_-20px_rgba(222,182,125,0.25)] [&:fullscreen]:flex [&:fullscreen]:flex-col [&:fullscreen]:w-screen [&:fullscreen]:h-screen [&:fullscreen]:max-w-none [&:fullscreen]:rounded-none [&:fullscreen]:bg-[#0D0D0D] ${portrait ? 'max-w-[420px] mx-auto' : ''}`}>
          <div ref={frameRef} className={`relative w-full rounded-2xl overflow-hidden bg-black/60 [.demo-player:fullscreen_&]:flex-1 [.demo-player:fullscreen_&]:min-h-0 [.demo-player:fullscreen_&]:aspect-auto ${portrait ? 'aspect-[9/16]' : 'aspect-video'}`} role="region" aria-label={t('demo.region')}>
            <video
              key={src}
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-contain"
              poster={poster}
              muted
              playsInline
              preload={attached ? 'metadata' : 'none'}
              src={attached ? src : undefined}
              data-format={portrait ? 'portrait' : 'landscape'}
              aria-describedby="demo-transcript"
              data-testid="demo-video"
              onWaiting={() => setStatus((s) => (s === 'idle' || s === 'error' ? s : 'loading'))}
              onPlaying={(event) => {
                setStatus('playing');
                const v = event.currentTarget;
                if (!v.paused && !v.ended && !document.hidden) {
                  watchSession.current.playing(playMode.current, portrait ? 'portrait' : 'landscape', trackVideo);
                }
              }}
              onPlay={() => setStatus((s) => (s === 'playing' ? s : 'loading'))}
              onSeeked={(event) => {
                // Restarting an already-playing video need not fire playing again.
                const v = event.currentTarget;
                if (!v.paused && !v.ended && !document.hidden) {
                  watchSession.current.playing(playMode.current, portrait ? 'portrait' : 'landscape', trackVideo);
                }
              }}
              onTimeUpdate={(event) => {
                // Some browsers neither seek nor re-fire playing for a restart at 0.
                const v = event.currentTarget;
                if (!v.paused && !v.ended && v.currentTime > 0 && !document.hidden) {
                  watchSession.current.playing(playMode.current, portrait ? 'portrait' : 'landscape', trackVideo);
                }
              }}
              onPause={() => { const v = videoRef.current; if (v && !v.ended) setStatus('paused'); }}
              onEnded={(event) => {
                setStatus('ended');
                if (event.currentTarget.ended) watchSession.current.ended(trackVideo);
              }}
              onError={() => setStatus('error')}
            />
            {status === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" role="status">
                <Loader2 className="animate-spin text-primary" size={36} aria-hidden />
                <span className="sr-only">{t('demo.loading')}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0D0D0D]/90 text-center p-6" role="alert">
                <AlertTriangle className="text-primary" size={32} aria-hidden />
                <p className="font-semibold">{t('demo.error.title')}</p>
                <p className="text-sm text-gray-400">{t('demo.error.desc')}</p>
                <button type="button" onClick={retry} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`} data-testid="demo-retry">
                  <RotateCcw size={16} aria-hidden />{t('demo.retry')}
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-3 sm:px-3">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={toggle} disabled={status === 'error'} aria-pressed={playing}
                className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40`} data-testid="demo-toggle">
                {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
                {playing ? t('demo.pause') : t('demo.play')}
              </button>
              <button type="button" onClick={replay} disabled={status === 'error'}
                className={`${btn} bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40`} data-testid="demo-replay">
                <RotateCcw size={16} aria-hidden />{t('demo.replay')}
              </button>
              {canFullscreen && (
                <button type="button" onClick={toggleFullscreen} aria-pressed={fullscreen}
                  className={`${btn} bg-white/5 border border-white/10 hover:bg-white/10`}
                  data-testid="demo-fullscreen">
                  {fullscreen ? <Minimize size={16} aria-hidden /> : <Maximize size={16} aria-hidden />}
                  {fullscreen ? t('demo.exitFullscreen') : t('demo.fullscreen')}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">{t('demo.langNote')}</p>
            {fullscreenError && <p role="status" className="text-xs text-gray-400 w-full">{t('demo.fullscreenError')}</p>}
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-[1fr_auto] gap-8 items-start">
          <div id="demo-transcript">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">{t('demo.transcript.title')}</h3>
            <ol className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: SlidersHorizontal, k: 'demo.transcript.step1' as const },
                { icon: MessageCircle, k: 'demo.transcript.step2' as const },
                { icon: Clock, k: 'demo.transcript.step3' as const },
              ].map((s, i) => (
                <li key={s.k} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-2 text-primary mb-3 text-sm font-semibold">
                    <s.icon size={18} strokeWidth={1.5} aria-hidden />0{i + 1}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{t(s.k)}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:text-right">
            <a href={PLATFORM_URL} onClick={() => trackCta('demo')} data-testid="demo-cta"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]">
              {t('demo.cta')}
            </a>
            <p className="mt-3 text-xs text-gray-500">{t('pricing.badge')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
