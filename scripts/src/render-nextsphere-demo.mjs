/**
 * Reproducible edit of the supplied screen recording. No invented UI or replies.
 * Run from the repository root: node scripts/src/render-nextsphere-demo.mjs
 * Needs FFmpeg and @napi-rs/canvas (already available in this workspace).
 * Original is read-only. Intermediate frames live in an automatically removed tmp dir.
 */
import { spawn, execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { mkdtempSync, readdirSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const root = process.cwd();
const require = createRequire(import.meta.url);
let canvasPath;
try { canvasPath = require.resolve('@napi-rs/canvas'); }
catch {
  // Use the installed workspace copy without adding a duplicate package.
  const store = join(root, 'node_modules/.pnpm');
  const pkg = readdirSync(store).find(n => n.startsWith('@napi-rs+canvas@'));
  if (!pkg) throw new Error('Install @napi-rs/canvas to reproduce this render.');
  canvasPath = join(store, pkg, 'node_modules/@napi-rs/canvas/index.js');
}
const { createCanvas, loadImage, GlobalFonts } = await import(pathToFileURL(canvasPath).href);
const source = resolve(process.argv[2] || 'attached_assets/video_demo_1790850842499.mp4');
const output = resolve('artifacts/nextsphere-site/public/media');
const temporary = mkdtempSync(join(tmpdir(), 'nextsphere-demo-'));
const W = 1920, H = 1080, FPS = 24, DURATION = 20;
const GOLD = '#DEB67D', PAPER = '#F8F3EB', MUTED = '#9EA6AC';
if (!existsSync(source)) throw new Error(`Source not found: ${source}`);
mkdirSync(output, { recursive: true });
GlobalFonts.registerFromPath(resolve('artifacts/nextsphere-site/public/fonts/montserrat-latin.woff2'), 'Montserrat');
GlobalFonts.registerFromPath(resolve('artifacts/nextsphere-site/public/fonts/inter-latin.woff2'), 'Inter');
const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', source]));
const videoStream = probe.streams.find(s => s.codec_type === 'video');
if (videoStream.width !== 2212 || videoStream.height !== 1246 || Number(probe.format.duration) < 149)
  throw new Error('This edit requires the supplied 2212 × 1246 recording, at least 149 seconds long.');

const ffmpeg = args => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-threads', '2', ...args], { maxBuffer: 2 * 1024 * 1024 });
async function still(time, name) {
  const p = join(temporary, `${name}.png`);
  ffmpeg(['-ss', String(time), '-i', source, '-frames:v', '1', '-y', p]);
  return loadImage(p);
}

try {
  const modal = await still(20, 'modules');
  const configuration = await still(42, 'configured');
  const conversation = await still(148, 'chat');
  const logo = await loadImage(resolve('attached_assets/logo_trasparenza_chiaro_1785754195220.png'));
  // Real typing only, accelerated 2x. We crop before PNG export to avoid huge caches.
  ffmpeg(['-ss', '33', '-t', '9', '-i', source, '-vf',
    'crop=620:110:778:748,setpts=PTS/2,fps=24', '-frames:v', '108',
    '-y', join(temporary, 'type-%03d.png')]);
  const typed = await Promise.all(Array.from({ length: 108 }, (_, i) =>
    loadImage(join(temporary, `type-${String(i + 1).padStart(3, '0')}.png`))));
  const canvas = createCanvas(W, H);
  const c = canvas.getContext('2d');
  const ease = x => { x = Math.max(0, Math.min(1, x)); return 1 - (1 - x) ** 3; };
  const text = (content, x, y, size = 60, color = PAPER, weight = 600, family = 'Montserrat', align = 'left') => {
    c.fillStyle = color; c.font = `${weight} ${size}px "${family}"`; c.textAlign = align;
    c.fillText(content, x, y); c.textAlign = 'left';
  };
  const roundRect = (x, y, w, h, r, fill, stroke) => {
    c.beginPath(); c.roundRect(x, y, w, h, r);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); }
  };
  const crop = (image, sx, sy, sw, sh, x, y, w, h, radius = 18) => {
    c.save(); c.beginPath(); c.roundRect(x, y, w, h, radius); c.clip();
    c.drawImage(image, sx, sy, sw, sh, x, y, w, h); c.restore();
  };
  const label = (copy, x, y) => text(copy, x, y, 27, GOLD, 600, 'Inter');
  const badge = (copy, x, y, w = 380) => {
    roundRect(x, y, w, 58, 29, '#DEB67D14', '#DEB67D55');
    text(copy, x + w / 2, y + 38, 25, GOLD, 600, 'Inter', 'center');
  };
  const base = (t, stage, light = false) => {
    c.clearRect(0, 0, W, H);
    c.fillStyle = light ? '#F2EBE1' : '#0D1013'; c.fillRect(0, 0, W, H);
    const glow = c.createRadialGradient(1450, 280, 0, 1450, 280, 1200);
    glow.addColorStop(0, light ? '#DEB67D40' : '#DEB67D18');
    glow.addColorStop(1, '#DEB67D00');
    c.fillStyle = glow; c.fillRect(0, 0, W, H);
    c.globalAlpha = light ? 1 : 0.9;
    c.drawImage(logo, 82, 44, 285, 285 * logo.height / logo.width);
    c.globalAlpha = 1;
    label('DEMO REALE / 20 SECONDI', 1360, 91);
    c.fillStyle = light ? '#1C222622' : '#FFFFFF12'; c.fillRect(80, 130, 1760, 1);
    text(stage, 80, 1020, 27, light ? '#566169' : MUTED, 500, 'Inter');
    // Progress cue remains quiet and truthful to the 20-second film.
    c.fillStyle = '#DEB67D22'; c.fillRect(80, 1053, 1760, 3);
    c.fillStyle = GOLD; c.fillRect(80, 1053, 1760 * (t / DURATION), 3);
  };
  const actualQuestion = (x, y, w) => {
    crop(conversation, 1948, 353, 254, 59, x, y, w, w * 59 / 254);
  };
  const actualAnswer = (x, y, w) => {
    crop(conversation, 16, 412, 550, 79, x, y, w, w * 79 / 550);
  };

  function frame(t) {
    if (t < 2) {
      base(t, 'Una domanda quotidiana. Una risposta che conosce la tua struttura.');
      const e = ease(t / 0.7);
      text('Le solite domande?', 960, 288 - 24 * e, 96, PAPER, 700, 'Montserrat', 'center');
      label('L’OSPITE CHIEDE', 232, 394);
      c.globalAlpha = e;
      actualQuestion(230, 435 + (1 - e) * 35, 1460);
      c.globalAlpha = 1;
      text('Non devi rispondere ogni volta.', 960, 911, 55, GOLD, 600, 'Montserrat', 'center');
    } else if (t < 4.5) {
      const s = t - 2;
      base(t, '01 / Scegli le informazioni utili ai tuoi ospiti.');
      label('CONFIGURAZIONE GUIDATA', 100, 255);
      text('Scegli cosa', 100, 373, 82, PAPER, 700);
      text('deve sapere.', 100, 474, 82, GOLD, 700);
      text('Orari. Wi-Fi. Regole.', 100, 609, 38, MUTED, 500, 'Inter');
      text('Le informazioni sono le tue.', 100, 672, 34, MUTED, 500, 'Inter');
      const e = ease(s / 0.65), zoom = 1 + 0.015 * s;
      c.save(); c.translate(1290, 560); c.scale(zoom, zoom);
      c.globalAlpha = e;
      crop(modal, 567, 315, 798, 606, -510, -330 + (1 - e) * 35, 1020, 775);
      c.restore();
    } else if (t < 9) {
      const s = t - 4.5;
      base(t, '02 / Scrivi le informazioni della tua struttura.');
      label('BASTANO LE TUE INFORMAZIONI', 120, 245);
      text('Inserisci gli orari di check-in.', 120, 366, 78, PAPER, 700);
      roundRect(120, 464, 1680, 352, 28, '#161D24', '#DEB67D40');
      label('ORARIO CHECK-IN', 167, 535);
      const image = typed[Math.min(107, Math.floor(s * FPS))];
      c.save(); c.beginPath(); c.roundRect(160, 575, 1600, 217, 16); c.clip();
      c.drawImage(image, 0, 0, image.width, image.height, 160, 575, 1600, 284);
      c.restore();
      if (s > 2.2) {
        c.globalAlpha = ease((s - 2.2) / 0.7);
        badge('UN ESEMPIO CONCRETO', 120, 900, 400);
        c.globalAlpha = 1;
      }
    } else if (t < 10.75) {
      base(t, 'Informazione inserita dall’host / ripresa dalla registrazione originale.');
      label('L’INFORMAZIONE È PRONTA', 120, 243);
      text('Check-in', 120, 361, 85, PAPER, 700);
      text('15:00 — 20:00', 120, 536, 146, GOLD, 700);
      roundRect(120, 635, 1680, 175, 26, '#161D24', '#DEB67D55');
      crop(configuration, 782, 766, 380, 30, 155, 682, 1490, 118, 0);
      text('Ora vediamo cosa risponde.', 120, 930, 51, PAPER, 600);
    } else if (t < 12.25) {
      const s = t - 10.75;
      base(t, '03 / L’ospite fa la sua domanda.');
      label('NELLA CHAT', 120, 255);
      text('«Quando posso fare il check-in?»', 120, 371, 73, PAPER, 700);
      const e = ease(s / 0.45);
      c.globalAlpha = e;
      actualQuestion(290, 496 + (1 - e) * 30, 1340);
      c.globalAlpha = 1;
    } else if (t < 17) {
      const s = t - 12.25;
      base(t, 'Risposta reale della chat / basata sull’informazione inserita.');
      label('NEXTSPHERE RISPONDE', 120, 235);
      text('Proprio gli orari che hai inserito.', 120, 347, 73, PAPER, 700);
      const e = ease(s / 0.55);
      c.globalAlpha = e;
      actualAnswer(120, 428 + (1 - e) * 35, 1680);
      c.globalAlpha = 1;
      if (s > 0.85) {
        // Trace beneath the hours in the ORIGINAL reply, without replacing text.
        const trace = ease((s - 0.85) / 0.65);
        c.strokeStyle = GOLD; c.lineWidth = 5; c.lineCap = 'round';
        c.beginPath(); c.moveTo(842, 519); c.lineTo(842 + 346 * trace, 519); c.stroke();
      }
      // The caption reinforces existing information, not a reconstructed reply.
      if (s > 0.5) {
        c.globalAlpha = ease((s - 0.5) / 0.5);
        label('INSERITO DA TE', 120, 795);
        text('15:00 — 20:00', 120, 908, 91, GOLD, 700);
        const trace = ease((s - 0.5) / 0.8);
        c.strokeStyle = GOLD; c.lineWidth = 4; c.lineCap = 'round';
        c.beginPath(); c.moveTo(910, 872); c.lineTo(910 + 118 * trace, 872); c.stroke();
        if (trace > 0.95) {
          c.beginPath(); c.moveTo(1010, 854); c.lineTo(1028, 872); c.lineTo(1010, 890); c.stroke();
        }
        label('RIPRESO DALLA CHAT', 1090, 795);
        text('15:00 — 20:00', 1090, 908, 91, GOLD, 700);
        c.globalAlpha = 1;
      }
    } else {
      const s = t - 17;
      base(t, 'NextSphere / L’assistente per i tuoi ospiti.');
      const e = ease(s / 0.65);
      c.globalAlpha = e;
      text('Le tue informazioni.', 960, 414 + (1 - e) * 25, 114, PAPER, 700, 'Montserrat', 'center');
      text('Le sue risposte.', 960, 559 + (1 - e) * 25, 114, GOLD, 700, 'Montserrat', 'center');
      c.globalAlpha = ease((s - 0.35) / 0.55);
      text('Meno domande ripetitive. Più tempo per te.', 960, 732, 46, MUTED, 500, 'Inter', 'center');
      c.globalAlpha = 1;
    }
  }

  const movie = join(output, 'nextsphere-demo.mp4');
  const encoder = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS),
    '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-threads', '2', '-preset', 'fast',
    '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', movie],
  { stdio: ['pipe', 'ignore', 'pipe'] });
  let errorLog = '';
  encoder.stderr.on('data', data => { errorLog += data.toString(); });
  const closed = once(encoder, 'close');
  encoder.stdin.on('error', () => { /* Report encoder stderr below. */ });
  for (let i = 0; i < DURATION * FPS; i++) {
    frame(i / FPS);
    const pixels = c.getImageData(0, 0, W, H);
    if (!encoder.stdin.write(Buffer.from(pixels.data.buffer, pixels.data.byteOffset, pixels.data.byteLength)))
      await Promise.race([once(encoder.stdin, 'drain'), closed.then(() => { throw new Error(errorLog); })]);
    if (i % FPS === 0) console.log(`Rendered ${i / FPS}/${DURATION}s`);
  }
  encoder.stdin.end();
  const [exitCode] = await closed;
  if (exitCode !== 0) throw new Error(errorLog || `FFmpeg failed: ${exitCode}`);
  // Poster is an actual composed frame, not a placeholder.
  frame(15.5);
  writeFileSync(join(output, 'nextsphere-demo-poster.jpg'), canvas.toBuffer('image/jpeg', 90));
  console.log(`Saved ${movie}`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}