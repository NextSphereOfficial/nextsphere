import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const helperUrl = pathToFileURL(path.join(rootDir, 'artifacts/nextsphere-site/demoMedia.ts'));
const { findPortraitDemo, mp4Dimensions } = await import(helperUrl.href);
const actualLandscape = path.join(rootDir, 'artifacts/nextsphere-site/public/media/nextsphere-demo.mp4');
const actualPortraitExport = path.join(rootDir, 'exports/nextsphere-demo-vertical.mp4');
const actualPortrait = path.join(rootDir, 'artifacts/nextsphere-site/public/media/nextsphere-demo-vertical.mp4');
const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), 'nextsphere-demo-media-test-'));

function sha256(filePath: string) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function makePortraitFixture(outputPath: string) {
  try {
    execFileSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error',
      '-f', 'lavfi', '-i', 'color=c=black:s=180x320:r=1:d=1',
      '-frames:v', '1', '-c:v', 'mpeg4', '-q:v', '5', '-movflags', '+faststart',
      '-y', outputPath,
    ], { stdio: 'pipe' });
  } catch (error) {
    throw new Error('FFmpeg is required to generate the small temporary portrait MP4 test fixture.', { cause: error });
  }
}

try {
  const landscapeDir = path.join(fixtureRoot, 'landscape-only');
  mkdirSync(landscapeDir);
  const landscapeCopy = path.join(landscapeDir, 'nextsphere-demo.mp4');
  copyFileSync(actualLandscape, landscapeCopy);
  const landscapeDimensions = mp4Dimensions(landscapeCopy);
  assert.ok(landscapeDimensions, 'real horizontal demo should have readable MP4 dimensions');
  assert.ok(landscapeDimensions.width > landscapeDimensions.height, 'real demo fixture should be horizontal');
  assert.equal(findPortraitDemo(landscapeDir), null, 'horizontal media alone must not enable portrait playback');

  const exportedPortraitDimensions = mp4Dimensions(actualPortraitExport);
  const publicPortraitDimensions = mp4Dimensions(actualPortrait);
  assert.ok(exportedPortraitDimensions, 'real exported vertical demo should have readable MP4 dimensions');
  assert.ok(publicPortraitDimensions, 'copied public vertical demo should have readable MP4 dimensions');
  assert.ok(exportedPortraitDimensions.width < exportedPortraitDimensions.height, 'real exported demo should be vertical');
  assert.deepEqual(publicPortraitDimensions, exportedPortraitDimensions, 'public vertical demo dimensions should match the export');
  assert.equal(sha256(actualPortrait), sha256(actualPortraitExport), 'public vertical demo must be an exact copy of the export');
  assert.deepEqual(findPortraitDemo(path.dirname(actualPortrait)), {
    src: 'media/nextsphere-demo-vertical.mp4',
    poster: 'media/nextsphere-demo-vertical-poster.jpg',
    ...exportedPortraitDimensions,
  }, 'the actual copied vertical demo should be selected by the build helper');

  const portraitDir = path.join(fixtureRoot, 'portrait-with-poster');
  mkdirSync(portraitDir);
  const portraitName = 'nextsphere-demo-portrait.mp4';
  const portraitPath = path.join(portraitDir, portraitName);
  makePortraitFixture(portraitPath);
  const posterName = 'nextsphere-demo-portrait-poster.jpg';
  execFileSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error',
    '-f', 'lavfi', '-i', 'color=c=black:s=180x320:r=1:d=1',
    '-frames:v', '1', '-q:v', '2', '-y', path.join(portraitDir, posterName),
  ], { stdio: 'pipe' });
  writeFileSync(path.join(portraitDir, 'nextsphere-vertical-corrupt.mp4'), Buffer.from('not an MP4'));

  const portrait = findPortraitDemo(portraitDir);
  assert.ok(portrait, 'a valid portrait MP4 should be selected after malformed media is skipped');
  assert.deepEqual(portrait, {
    src: `media/${portraitName}`,
    poster: `media/${posterName}`,
    width: 180,
    height: 320,
  });

  const withoutPosterDir = path.join(fixtureRoot, 'portrait-without-poster');
  mkdirSync(withoutPosterDir);
  copyFileSync(portraitPath, path.join(withoutPosterDir, 'nextsphere-vertical-fixture.mp4'));
  const withoutPoster = findPortraitDemo(withoutPosterDir);
  assert.ok(withoutPoster, 'portrait MP4 should remain selectable without a poster');
  assert.equal(withoutPoster.poster, null, 'do not invent or assume a missing portrait poster');
  assert.deepEqual(mp4Dimensions(portraitPath), { width: 180, height: 320 });
  assert.ok(readFileSync(path.join(portraitDir, posterName)).length > 0, 'poster fixture should exist');

  console.log('Demo media build-helper checks passed.');
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true });
}