import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const BASE = 'https://www.nextsphere.it';

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  lang?: string;
  robots?: string;
  /** JSON-LD schema objects to inject alongside standard tags */
  schema?: object | object[];
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = `${BASE}/og-image.png`,
  lang = 'it',
  robots = 'index, follow',
  schema,
}: SEOProps) {
  const locale = lang === 'it' ? 'it_IT' : 'en_GB';
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  useEffect(() => {
    const staticRobots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"][data-static-seo="true"]');
    staticRobots?.remove();
  }, [robots]);

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      {/* One canonical URL per route. Language selection does not change the URL. */}
      <link rel="canonical" href={canonical} />

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
