import { Component, Suspense, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';

class RouteErrorBoundary extends Component<
  { children: ReactNode; message: string; retry: string },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div role="alert" className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p>{this.props.message}</p>
          <button type="button" className="underline min-h-11" onClick={() => window.location.reload()}>
            {this.props.retry}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Suspend only page content, keeping navigation and language controls usable. */
export function RouteContent({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { lang } = useLanguage();
  const english = lang === 'en';

  return (
    <RouteErrorBoundary
      key={location}
      message={english ? 'Unable to load this page. Check your connection and try again.' : 'Impossibile caricare la pagina. Controlla la connessione e riprova.'}
      retry={english ? 'Reload page' : 'Ricarica pagina'}
    >
      <Suspense fallback={
        <div role="status" className="min-h-[50vh] flex items-center justify-center px-6 text-center">
          {english ? 'Loading page…' : 'Caricamento pagina…'}
        </div>
      }>
        {children}
      </Suspense>
    </RouteErrorBoundary>
  );
}
