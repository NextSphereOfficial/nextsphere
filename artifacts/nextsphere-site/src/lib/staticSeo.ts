/**
 * Remove only the initial document's page metadata, before React owns the head.
 * Helmet 3 on React 19 uses native hoisting without the old data-rh markers;
 * deleting "unmarked" tags in a page effect would delete React-owned DOM nodes.
 */
export function removeStaticSeo(doc: Document) {
  doc.head.querySelectorAll(
    'title, meta[name="robots"][data-static-seo="true"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]',
  ).forEach((tag) => tag.remove());
  doc.head.querySelectorAll('script[type="application/ld+json"]').forEach((tag) => {
    const data = JSON.parse(tag.textContent || '{}');
    if (data['@type'] === 'FAQPage' || data['@type'] === 'VideoObject') tag.remove();
  });
}
