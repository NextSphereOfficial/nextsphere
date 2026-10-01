import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, Loader2, Maximize, Minimize } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { trackAnalyticsEvent } from '../lib/trackCta';
import { DemoWatchSession, type DemoVideoEvent, type DemoVideoProperties } from '../lib/demoWatchSession';

const BASE = import.meta.env.BASE_URL;
const SRC = `${BASE}media/nextsphere-demo.mp4`.replace(/\/{2,}/g, '/');
const POSTER = `${BASE}media/nextsphere-demo-poster.jpg`.replace(/\/{2,}/g, '/');
declare const __NEXTSPHERE_DEMO_PORTRAIT__: null | {
  src: string; poster: string | null; width: number; height: number;
};
const PORTRAIT = typeof __NEXTSPHERE_DEMO_PORTRAIT__ === 'undefined' ? null : __NEXTSPHERE_DEMO_PORTRAIT__;
type IosVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void; webkitExitFullscreen?: () => void };
type Status = 'loading' | 'playing' | 'paused' | 'ended' | 'error';

function trackVideo(event: DemoVideoEvent, properties: DemoVideoProperties) {
  return trackAnalyticsEvent(event, properties, `${event}_${properties.mode}_${properties.watch}`);
}

/** Mounted only after an explicit demo-open request; never preloads on the home. */
export default function DemoVideo({ watchSession }: { watchSession: DemoWatchSession }) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  // Freeze the source for this opening, including across orientation changes.
  const [portrait] = useState(() => Boolean(PORTRAIT && window.matchMedia('(max-width: 639px)').matches));
  const [status, setStatus] = useState<Status>('loading');
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);
  const attempt = useRef(0);
  const src = portrait && PORTRAIT ? `${BASE}${PORTRAIT.src}`.replace(/\/{2,}/g, '/') : SRC;
  const poster = portrait ? (PORTRAIT?.poster ? `${BASE}${PORTRAIT.poster}`.replace(/\/{2,}/g, '/') : undefined) : POSTER;
  // Fullscreen the entire Radix focus scope, not a subtree with invisible siblings.
  const fullscreenTarget = useCallback(() =>
    (playerRef.current?.closest?.('[role="dialog"]') as HTMLElement | null) ?? playerRef.current, []);

  const pause = useCallback(() => {
    attempt.current++;
    videoRef.current?.pause();
    setStatus('paused');
  }, []);

  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.hidden) { pause(); return; }
    const current = ++attempt.current;
    setStatus('loading');
    v.play().then(() => {
      if (current !== attempt.current) return;
      if (document.hidden) pause();
    }).catch((error: unknown) => {
      if (current !== attempt.current) return;
      const name = error instanceof DOMException ? error.name : '';
      if (name === 'AbortError') return;
      setStatus(name === 'NotAllowedError' ? 'paused' : 'error');
    });
  }, [pause]);

  useEffect(() => {
    const v = videoRef.current;
    // Also restore the source for React's development StrictMode effect replay.
    if (v && !v.getAttribute('src')) { v.setAttribute('src', src); v.load(); }
    play();
    const onVisibility = () => { if (document.hidden) pause(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      attempt.current++;
      document.removeEventListener('visibilitychange', onVisibility);
      // Stop playback and release network/decoder resources on every close.
      v?.pause();
      v?.removeAttribute('src');
      v?.load();
    };
  }, [src, play, pause]);

  useEffect(() => {
    const v = videoRef.current as IosVideo | null;
    setCanFullscreen(Boolean(document.fullscreenEnabled && fullscreenTarget()?.requestFullscreen) || Boolean(v?.webkitEnterFullscreen));
    const update = () => setFullscreen(document.fullscreenElement === fullscreenTarget());
    const nativeEnter = () => setFullscreen(true);
    const nativeExit = () => setFullscreen(false);
    document.addEventListener('fullscreenchange', update);
    v?.addEventListener('webkitbeginfullscreen', nativeEnter);
    v?.addEventListener('webkitendfullscreen', nativeExit);
    return () => {
      document.removeEventListener('fullscreenchange', update);
      v?.removeEventListener('webkitbeginfullscreen', nativeEnter);
      v?.removeEventListener('webkitendfullscreen', nativeExit);
    };
  }, [fullscreenTarget]);

  const toggleFullscreen = async () => {
    setFullscreenError(false);
    try {
      if (document.fullscreenElement === fullscreenTarget()) await document.exitFullscreen();
      else if (document.fullscreenEnabled && fullscreenTarget()?.requestFullscreen) await fullscreenTarget()!.requestFullscreen();
      else {
        const v = videoRef.current as IosVideo | null;
        if (fullscreen && v?.webkitExitFullscreen) v.webkitExitFullscreen();
        else if (v?.webkitEnterFullscreen) v.webkitEnterFullscreen();
        else throw new Error('Fullscreen unavailable');
      }
    } catch { setFullscreenError(true); }
  };

  const replay = () => {
    watchSession.restart();
    if (videoRef.current) videoRef.current.currentTime = 0;
    play();
  };
  const toggle = () => {
    const v = videoRef.current;
    if (status === 'loading' || (v && !v.paused && !v.ended)) pause();
    else if (v?.ended) replay();
    else play();
  };
  const retry = () => {
    watchSession.restart();
    videoRef.current?.load();
    play();
  };
  const recordPlaying = (v: HTMLVideoElement) => {
    if (!v.paused && !v.ended && !document.hidden) {
      watchSession.playing('manual', portrait ? 'portrait' : 'landscape', trackVideo);
    }
  };
  const playing = status === 'playing' || status === 'loading';
  const btn = 'inline-flex shrink-0 items-center justify-center gap-2 min-h-11 min-w-11 px-3 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-40';

  return (
    <div ref={playerRef} className="demo-player flex flex-1 min-h-0 flex-col gap-2 [&:fullscreen]:h-screen [&:fullscreen]:w-screen [&:fullscreen]:bg-[#0D0D0D] [&:fullscreen]:p-3">
      <div className="relative flex-1 min-h-0 overflow-hidden rounded-xl bg-black" role="region" aria-label={t('demo.region')}>
        <video ref={videoRef} className="absolute inset-0 h-full w-full object-contain" src={src} poster={poster}
          muted playsInline preload="metadata" data-format={portrait ? 'portrait' : 'landscape'}
          aria-describedby="demo-transcript" data-testid="demo-video"
          onWaiting={() => setStatus(s => s === 'error' || s === 'paused' ? s : 'loading')}
          onPlay={() => setStatus('loading')}
          onPlaying={event => { setStatus('playing'); recordPlaying(event.currentTarget); }}
          onSeeked={event => recordPlaying(event.currentTarget)}
          onTimeUpdate={event => { if (event.currentTarget.currentTime > 0) recordPlaying(event.currentTarget); }}
          onPause={() => { if (!videoRef.current?.ended) setStatus('paused'); }}
          onEnded={event => { setStatus('ended'); if (event.currentTarget.ended) watchSession.ended(trackVideo); }}
          onError={() => setStatus('error')}
        />
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" role="status">
            <Loader2 className="animate-spin text-primary" size={32} aria-hidden /><span className="sr-only">{t('demo.loading')}</span>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0D0D0D]/95 p-4 text-center" role="alert">
            <AlertTriangle className="text-primary" size={28} aria-hidden />
            <p className="font-semibold text-sm">{t('demo.error.title')}</p>
            <p className="text-sm text-gray-400">{t('demo.error.desc')}</p>
            <button type="button" onClick={retry} className={`${btn} bg-primary text-primary-foreground`} data-testid="demo-retry">
              <RotateCcw size={16} aria-hidden />{t('demo.retry')}
            </button>
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggle} disabled={status === 'error'} aria-pressed={playing}
            aria-label={playing ? t('demo.pause') : t('demo.play')} title={playing ? t('demo.pause') : t('demo.play')}
            className={`${btn} bg-primary text-primary-foreground`} data-testid="demo-toggle">
            {playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
            <span className="hidden sm:inline">{playing ? t('demo.pause') : t('demo.play')}</span>
          </button>
          <button type="button" onClick={replay} disabled={status === 'error'} aria-label={t('demo.replay')} title={t('demo.replay')}
            className={`${btn} border border-white/10 bg-white/5 hover:bg-white/10`} data-testid="demo-replay">
            <RotateCcw size={18} aria-hidden /><span className="hidden sm:inline">{t('demo.replay')}</span>
          </button>
          {canFullscreen && <button type="button" onClick={toggleFullscreen} aria-pressed={fullscreen}
            aria-label={fullscreen ? t('demo.exitFullscreen') : t('demo.fullscreen')} title={fullscreen ? t('demo.exitFullscreen') : t('demo.fullscreen')}
            className={`${btn} border border-white/10 bg-white/5 hover:bg-white/10`} data-testid="demo-fullscreen">
            {fullscreen ? <Minimize size={18} aria-hidden /> : <Maximize size={18} aria-hidden />}
          </button>}
        </div>
        <p className="text-right text-[11px] text-gray-400">{t('demo.langNote')}</p>
      </div>
      {fullscreenError && <p role="status" className="shrink-0 text-xs text-gray-400">{t('demo.fullscreenError')}</p>}
    </div>
  );
}