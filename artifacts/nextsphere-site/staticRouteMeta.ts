import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';
import { translations } from './src/i18n/translations';

// The client and build-time metadata deliberately use the same translations.
const routes = [
  ['pricing', 'pricing'],
  ['airbnb', 'airbnb'],
  ['booking', 'booking'],
  ['guida-digitale-ospiti', 'guideDigitale'],
  ['about', 'about'],
] as const;
const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function staticRouteMeta(): Plugin {
  return {
    name: 'nextsphere-static-route-meta',
    apply: 'build',
    async writeBundle(options) {
      if (!options.dir) throw new Error('Static route metadata requires a build output directory.');
      const shell = await readFile(path.join(options.dir, 'index.html'), 'utf8');
      for (const [route, key] of routes) {
        const title = translations.it[`meta.${key}.title`];
        const description = translations.it[`meta.${key}.description`];
        const url = `https://www.nextsphere.it/${route}`;
        let html = shell.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`);
        const values: Record<string, string> = {
          description, 'og:title': title, 'og:description': description, 'og:url': url,
          'twitter:title': title, 'twitter:description': description,
        };
        for (const [name, value] of Object.entries(values)) {
          const pattern = new RegExp(`(<meta\\s+(?:name|property)="${name}"\\s+content=")[^"]*(")`);
          if (!pattern.test(html)) throw new Error(`Missing metadata template: ${name}`);
          html = html.replace(pattern, (_match, before, after) => `${before}${escape(value)}${after}`);
        }
        html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
        // Homepage FAQs and the demo's VideoObject do not describe these routes.
        html = html.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g, (tag, json) => {
          const type = JSON.parse(json)['@type'];
          return type === 'FAQPage' || type === 'VideoObject' ? '' : tag;
        });
        await writeFile(path.join(options.dir, `${route}.html`), html);
      }
    },
  };
}
