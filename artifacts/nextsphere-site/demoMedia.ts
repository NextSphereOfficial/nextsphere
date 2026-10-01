import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

/** MP4 display dimensions without requiring FFmpeg on the build host (Vercel). */
export function mp4Dimensions(file: string): { width: number; height: number } | null {
  const data = readFileSync(file);
  function visit(start: number, end: number): { width: number; height: number } | null {
    let offset = start;
    while (offset + 8 <= end) {
      let size = data.readUInt32BE(offset);
      const kind = data.toString('ascii', offset + 4, offset + 8);
      let header = 8;
      if (size === 1) {
        if (offset + 16 > end) return null;
        const extended = data.readBigUInt64BE(offset + 8);
        if (extended > BigInt(Number.MAX_SAFE_INTEGER)) return null;
        size = Number(extended);
        header = 16;
      } else if (size === 0) size = end - offset;
      if (size < header || offset + size > end) return null;
      if (kind === 'tkhd' && size >= header + 84) {
        const width = data.readUInt32BE(offset + size - 8) / 65536;
        const height = data.readUInt32BE(offset + size - 4) / 65536;
        if (width > 0 && height > 0) return { width, height };
      }
      if (kind === 'moov' || kind === 'trak') {
        const result = visit(offset + header, offset + size);
        if (result) return result;
      }
      offset += size;
    }
    return null;
  }
  return visit(0, data.length);
}

/** Only enable portrait playback after a real, complete portrait export is present. */
export function findPortraitDemo(mediaDir: string) {
  if (!existsSync(mediaDir)) return null;
  const movies = readdirSync(mediaDir).filter(name =>
    /^nextsphere.*(?:demo|vertical).*\.mp4$/i.test(name) && !/(?:^|[-_.])en(?:[-_.]|$)/i.test(name),
  ).sort((a, b) => Number(b.includes('vertical')) - Number(a.includes('vertical')) || a.localeCompare(b));
  for (const name of movies) {
    const dimensions = mp4Dimensions(path.join(mediaDir, name));
    if (!dimensions || dimensions.height <= dimensions.width) continue;
    const stem = name.replace(/\.mp4$/i, '');
    const poster = [`${stem}-poster.jpg`, `${stem}-poster.png`, `${stem}-poster.webp`]
      .find(candidate => existsSync(path.join(mediaDir, candidate)));
    return {
      src: `media/${name}`,
      poster: poster ? `media/${poster}` : null,
      width: dimensions.width,
      height: dimensions.height,
    };
  }
  return null;
}