import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

export const defaultDist = fileURLToPath(new URL('../dist/', import.meta.url));

/** Count the entire startup graph, not just the now-smaller entry chunk. */
export async function measureInitialJs(dist = defaultDist) {
  const manifest = JSON.parse(await readFile(resolve(dist, '.vite/manifest.json'), 'utf8'));
  const entry = Object.keys(manifest).find((key) => manifest[key].isEntry);
  if (!entry) throw new Error('No entry found in the production manifest. Run the site build first.');
  const initialKeys = new Set();
  function visit(key) {
    if (initialKeys.has(key)) return;
    initialKeys.add(key);
    for (const dependency of manifest[key].imports ?? []) visit(dependency);
  }
  visit(entry);
  const files = await Promise.all(
    [...initialKeys].filter((key) => manifest[key].file.endsWith('.js')).map(async (key) => {
      const file = manifest[key].file;
      const bytes = await readFile(resolve(dist, file));
      return { file, bytes: bytes.length, gzipBytes: gzipSync(bytes, { level: 9 }).length };
    }),
  );
  return {
    method: 'Vite production manifest: entry + recursive static imports; bytes and gzipSync(level 9) per file; excludes dynamic imports, CSS, media, fonts and third-party scripts',
    files,
    totalBytes: files.reduce((total, file) => total + file.bytes, 0),
    totalGzipBytes: files.reduce((total, file) => total + file.gzipBytes, 0),
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await measureInitialJs(process.argv[2]), null, 2));
}
