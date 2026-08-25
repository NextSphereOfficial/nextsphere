import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const COOKIEBOT_ID = '8e716c22-e3f3-49b6-b6ef-b91a5d3920c5';
const DECLARATION_TIMEOUT_MS = 15_000;

type DeclarationState = 'loading' | 'loaded' | 'error';

type CookieDeclarationController = {
  culture?: string;
  InjectCookieDeclaration?: (declarationContent: string) => void;
};

let previousDeclarationRun: Promise<void> = Promise.resolve();

declare global {
  interface Window {
    CookieDeclaration?: CookieDeclarationController;
  }
}

export function CookieDeclaration() {
  const { t, lang } = useTranslation();
  const declarationRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<DeclarationState>('loading');

  useEffect(() => {
    const container = declarationRef.current;
    if (!container) return;

    const culture = lang === 'it' ? 'it' : 'en';
    let active = true;
    let started = false;
    let settled = false;
    let declarationInjected = false;
    let controller: CookieDeclarationController | undefined;
    let declarationScript: HTMLScriptElement | undefined;
    let timeoutId: number | undefined;
    const existingReportScripts = new Set(
      Array.from(document.head.querySelectorAll<HTMLScriptElement>('script[src*="/cdreport.js"]')),
    );
    const reportScripts = new Set<HTMLScriptElement>();
    let releaseRun: () => void = () => {};
    const currentRun = new Promise<void>((resolve) => {
      releaseRun = resolve;
    });
    const runBeforeThisOne = previousDeclarationRun;
    previousDeclarationRun = currentRun;

    const completeRun = () => {
      if (settled) return;

      settled = true;
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      reportObserver.disconnect();
      reportScripts.forEach((reportScript) => reportScript.remove());
      releaseRun();
    };

    const failDeclaration = () => {
      if (active && !declarationInjected) {
        setState('error');
      }
      completeRun();
    };

    const trackReportScript = (node: HTMLScriptElement) => {
      if (existingReportScripts.has(node) || reportScripts.has(node)) return;

      reportScripts.add(node);
      node.addEventListener('error', failDeclaration, { once: true });
      node.addEventListener(
        'load',
        () => {
          if (!declarationInjected) {
            failDeclaration();
          }
        },
        { once: true },
      );
    };

    const reportObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLScriptElement && node.src.includes('/cdreport.js')) {
            trackReportScript(node);
          }
        }
      }
    });

    setState('loading');
    void runBeforeThisOne.then(() => {
      if (!active) {
        completeRun();
        return;
      }

      started = true;
      reportObserver.observe(document.head, { childList: true });

      declarationScript = document.createElement('script');
      declarationScript.id = 'CookieDeclaration';
      declarationScript.src = `https://consent.cookiebot.com/${COOKIEBOT_ID}/cd.js`;
      declarationScript.type = 'text/javascript';
      declarationScript.async = true;
      declarationScript.setAttribute('data-culture', culture);
      declarationScript.setAttribute('data-cookieconsent', 'ignore');
      timeoutId = window.setTimeout(failDeclaration, DECLARATION_TIMEOUT_MS);

      declarationScript.onload = () => {
        document.head
          .querySelectorAll<HTMLScriptElement>('script[src*="/cdreport.js"]')
          .forEach(trackReportScript);

        if (!active) {
          completeRun();
          return;
        }

        const loadedController = window.CookieDeclaration;
        controller = loadedController;
        const injectDeclaration = loadedController?.InjectCookieDeclaration;

        if (!loadedController || !injectDeclaration) {
          failDeclaration();
          return;
        }

        loadedController.InjectCookieDeclaration = (declarationContent) => {
          if (!active || window.CookieDeclaration !== loadedController || loadedController.culture !== culture) {
            return;
          }

          injectDeclaration.call(loadedController, declarationContent);
          declarationInjected = true;
          setState('loaded');
          completeRun();
        };
      };
      declarationScript.onerror = failDeclaration;

      container.appendChild(declarationScript);
    });

    return () => {
      active = false;

      if (window.CookieDeclaration === controller && controller) {
        controller.InjectCookieDeclaration = () => {};
      }

      declarationScript?.remove();
      container.replaceChildren();

      if (!started) {
        completeRun();
      }
    };
  }, [lang]);

  return (
    <section
      className="mt-12 border-t border-gray-200 pt-10"
      aria-labelledby="cookiebot-declaration-title"
    >
      <h2 id="cookiebot-declaration-title" className="text-2xl font-semibold text-gray-900">
        {t('legal.cookie.declaration.title')}
      </h2>
      <p className="mt-3 text-gray-600 leading-relaxed">
        {t('legal.cookie.declaration.intro')}
      </p>

      {state === 'loading' && (
        <p className="mt-6 rounded-xl bg-gray-50 px-5 py-4 text-sm text-gray-500" aria-live="polite">
          {t('legal.cookie.declaration.loading')}
        </p>
      )}
      {state === 'error' && (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800" role="alert">
          {t('legal.cookie.declaration.error')}
        </p>
      )}

      <div ref={declarationRef} className="mt-6 min-h-12" data-testid="cookiebot-declaration" />
    </section>
  );
}