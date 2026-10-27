import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';
import { removeStaticSeo } from './lib/staticSeo';

import './index.css';

// Do this once before React can adopt or create any head nodes, not on routes.
removeStaticSeo(document);

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
