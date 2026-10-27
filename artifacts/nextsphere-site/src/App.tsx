import { lazy, useLayoutEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

import Home from './pages/Home';
import { RouteContent } from './components/RouteContent';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import { scrollToPageTop } from './lib/navigation';

// Keep Home (including DemoOverlay/DemoVideo) eager: the opening tap must
// synchronously mount the player and request playback, without an import await.
const Pricing = lazy(() => import('./pages/Pricing'));
const Airbnb = lazy(() => import('./pages/Airbnb'));
const Booking = lazy(() => import('./pages/Booking'));
const GuidaDigitaleOspiti = lazy(() => import('./pages/GuidaDigitaleOspiti'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const LegalNotes = lazy(() => import('./pages/LegalNotes'));
const LegalHub = lazy(() => import('./pages/LegalHub'));
const LegalDocumentPage = lazy(() => import('./pages/LegalDocument'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Guides = lazy(() => import('./pages/Guides'));
const GuideArticle = lazy(() => import('./pages/GuideArticle'));
const NotFound = lazy(() => import('./pages/not-found'));

function ScrollToTop() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      return;
    }

    scrollToPageTop();
    const frame = window.requestAnimationFrame(scrollToPageTop);
    const timeout = window.setTimeout(scrollToPageTop, 0);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      {/* Analytics dashboard — standalone, no Navbar/Footer */}
      <Route path="/analytics">
        <RouteContent><Analytics /></RouteContent>
      </Route>

      {/* Public site routes */}
      <Route>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <RouteContent>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/pricing" component={Pricing} />
                <Route path="/contatti" component={Contact} />
                <Route path="/about" component={About} />
                <Route path="/blog" component={Guides} />
                <Route path="/blog/:slug" component={GuideArticle} />
                <Route path="/airbnb" component={Airbnb} />
                <Route path="/booking" component={Booking} />
                <Route path="/guida-digitale-ospiti" component={GuidaDigitaleOspiti} />
                <Route path="/privacy-policy" component={PrivacyPolicy} />
                <Route path="/cookie-policy" component={CookiePolicy} />
                <Route path="/note-legali" component={LegalNotes} />
                <Route path="/legale" component={LegalHub} />
                <Route path="/legale/:slug" component={LegalDocumentPage} />
                <Route component={NotFound} />
              </Switch>
            </RouteContent>
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </LanguageProvider>
  );
}

export default App;
