import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Airbnb from './pages/Airbnb';
import Booking from './pages/Booking';
import GuidaDigitaleOspiti from './pages/GuidaDigitaleOspiti';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import LegalNotes from './pages/LegalNotes';
import Analytics from './pages/Analytics';
import Contact from './pages/Contact';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';

function Router() {
  return (
    <Switch>
      {/* Analytics dashboard — standalone, no Navbar/Footer */}
      <Route path="/analytics" component={Analytics} />

      {/* Public site routes */}
      <Route>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/contatti" component={Contact} />
              <Route path="/airbnb" component={Airbnb} />
              <Route path="/booking" component={Booking} />
              <Route path="/guida-digitale-ospiti" component={GuidaDigitaleOspiti} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/cookie-policy" component={CookiePolicy} />
              <Route path="/note-legali" component={LegalNotes} />
              <Route component={NotFound} />
            </Switch>
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
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </LanguageProvider>
  );
}

export default App;
