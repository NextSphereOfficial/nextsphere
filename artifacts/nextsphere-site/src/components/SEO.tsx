import { Helmet } from 'react-helmet-async';

const BASE = 'https://nextsphere.it';

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  lang?: string;
  /** JSON-LD schema objects to inject alongside standard tags */
  schema?: object | object[];
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = `${BASE}/og-image.png`,
  lang = 'it',
  schema,
}: SEOProps) {
  const locale = lang === 'it' ? 'it_IT' : 'en_GB';
  const altLang = lang === 'it' ? 'en' : 'it';
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      {/* Canonical + hreflang for every inner page */}
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang={lang}      href={canonical} />
      <link rel="alternate" hrefLang={altLang}   href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={canonical} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:locale"      content={locale} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* Per-page JSON-LD schemas */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
