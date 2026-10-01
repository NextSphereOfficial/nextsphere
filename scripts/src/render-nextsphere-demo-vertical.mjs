/**
 * Dedicated 9:16 edit of the real recording; never writes to the home media.
 * Run from repository root: node scripts/src/render-nextsphere-demo-vertical.mjs
 * Requires FFmpeg and the existing @napi-rs/canvas workspace installation.
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
  const store = join(root, 'node_modules/.pnpm');
  const pkg = readdirSync(store).find(n => n.startsWith('@napi-rs+canvas@'));
  if (!pkg) throw new Error('Install @napi-rs/canvas to reproduce this render.');
  canvasPath = join(store, pkg, 'node_modules/@napi-rs/canvas/index.js');
}
const { createCanvas, loadImage, GlobalFonts } = await import(pathToFileURL(canvasPath).href);
const source = resolve(process.argv[2] || 'attached_assets/video_demo_1790850842499.mp4');
const output = resolve('exports');
const temporary = mkdtempSync(join(tmpdir(), 'nextsphere-vertical-'));
const W = 1080, H = 1920, FPS = 30, DURATION = 20;
const GOLD = '#DEB67D', PAPER = '#F8F3EB', MUTED = '#A7AFB5';
if (!existsSync(source)) throw new Error(`Source not found: ${source}`);
mkdirSync(output, { recursive: true });
for (const [name, file] of [['Montserrat', 'montserrat'], ['Inter', 'inter']]) {
  if (!GlobalFonts.registerFromPath(resolve(`artifacts/nextsphere-site/public/fonts/${file}-latin.woff2`), name))
    throw new Error(`Unable to load brand font ${name}`);
}
const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', source]));
const video = probe.streams.find(s => s.codec_type === 'video');
if (video?.width !== 2212 || video?.height !== 1246 || Number(probe.format.duration) < 149)
  throw new Error('This edit requires the supplied 2212 × 1246 recording, at least 149 seconds long.');

const ffmpeg = args => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-threads', '2', ...args], { maxBuffer: 2 * 1024 * 1024 });
async function still(time, name) {
  const p = join(temporary, `${name}.png`);
  ffmpeg(['-ss', String(time), '-i', source, '-frames:v', '1', '-y', p]);
  return loadImage(p);
}

try {
  const [modal, configuration, conversation, logo] = await Promise.all([
    still(20, 'modules'), still(42, 'configured'), still(148, 'chat'),
    loadImage(resolve('attached_assets/logo_trasparenza_chiaro_1785754195220.png')),
  ]);
  ffmpeg(['-ss', '33', '-t', '9', '-i', source, '-vf',
    'crop=620:110:778:748,setpts=PTS/2,fps=30', '-frames:v', '135',
    '-y', join(temporary, 'type-%03d.png')]);
  const typed = await Promise.all(Array.from({ length: 135 }, (_, i) =>
    loadImage(join(temporary, `type-${String(i + 1).padStart(3, '0')}.png`))));
  const canvas = createCanvas(W, H);
  const c = canvas.getContext('2d');
  const ease = x => 1 - (1 - Math.max(0, Math.min(1, x))) ** 3;
  const text = (copy, x, y, size = 62, color = PAPER, weight = 600, family = 'Montserrat', align = 'left') => {
    c.fillStyle = color; c.font = `${weight} ${size}px "${family}"`; c.textAlign = align;
    c.fillText(copy, x, y); c.textAlign = 'left';
  };
  const lines = (copies, y, size = 76, color = PAPER) =>
    copies.forEach((copy, i) => text(copy, 88, y + i * size * 1.22, size, color, 700));
  const label = (copy, y, color = GOLD) => text(copy, 88, y, 29, color, 600, 'Inter');
  const rect = (x, y, w, h, r, fill, stroke) => {
    c.beginPath(); c.roundRect(x, y, w, h, r);
    c.fillStyle = fill; c.fill();
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); }
  };
  const crop = (image, sx, sy, sw, sh, x, y, w, h, radius = 18) => {
    c.save(); c.beginPath(); c.roundRect(x, y, w, h, radius); c.clip();
    c.drawImage(image, sx, sy, sw, sh, x, y, w, h); c.restore();
  };
  const question = y => crop(conversation, 1948, 353, 254, 59, 88, y, 850, 850 * 59 / 254);
  const hours = (y, prefix) => {
    label(prefix, y);
    text('15:00 – 20:00', 88, y + 112, 100, GOLD, 700);
  };
  const base = (t, stage) => {
    c.fillStyle = '#0D1013'; c.fillRect(0, 0, W, H);
    const glow = c.createRadialGradient(900, 620, 0, 900, 620, 1200);
    glow.addColorStop(0, '#DEB67D20'); glow.addColorStop(1, '#DEB67D00');
    c.fillStyle = glow; c.fillRect(0, 0, W, H);
    c.drawImage(logo, 88, 215, 325, 325 * logo.height / logo.width);
    text('DEMO REALE', 88, 359, 26, MUTED, 600, 'Inter');
    c.fillStyle = '#FFFFFF18'; c.fillRect(88, 395, 850, 2);
    text(stage, 88, 1518, 29, MUTED, 500, 'Inter');
    c.fillStyle = '#DEB67D22'; c.fillRect(88, 1554, 850, 4);
    c.fillStyle = GOLD; c.fillRect(88, 1554, 850 * t / DURATION, 4);
  };
  function frame(t) {
    if (t < 2.5) {
      base(t, 'Una domanda quotidiana.');
      label('L’OSPITE CHIEDE', 478);
      lines(['Le solite', 'domande?'], 606, 94);
      c.globalAlpha = ease(t / 0.55);
      question(904 + 24 * (1 - ease(t / 0.55)));
      c.globalAlpha = 1;
      lines(['Non devi rispondere', 'ogni volta.'], 1270, 47, GOLD);
    } else if (t < 5) {
      base(t, '01 / Configura le informazioni');
      label('CONFIGURAZIONE GUIDATA', 475);
      lines(['Scegli cosa', 'deve sapere.'], 582, 73);
      c.globalAlpha = ease((t - 2.5) / 0.4);
      crop(modal, 567, 315, 798, 606, 88, 765, 850, 645);
      c.globalAlpha = 1;
    } else if (t < 9.5) {
      const s = t - 5;
      base(t, '02 / Inserisci i tuoi orari');
      label('LE INFORMAZIONI SONO LE TUE', 475);
      lines(['Scrivi gli orari', 'di check-in.'], 587, 72);
      rect(88, 815, 850, 350, 26, '#161D24', '#DEB67D55');
      text('ORARIO CHECK-IN', 122, 886, 29, GOLD, 600, 'Inter');
      const image = typed[Math.min(134, Math.floor(s * FPS))];
      // A tight, legible view of the actual field, not the whole desktop.
      crop(image, 0, 0, 390, 100, 118, 918, 790, 203, 10);
      if (s > 2.3) {
        c.globalAlpha = ease((s - 2.3) / 0.5);
        hours(1270, 'IL TUO CHECK-IN');
        c.globalAlpha = 1;
      }
    } else if (t < 11) {
      base(t, 'Informazione reale inserita dall’host');
      label('L’INFORMAZIONE È PRONTA', 475);
      lines(['Check-in'], 632, 94);
      hours(831, 'INSERITO DA TE');
      rect(88, 1030, 850, 185, 22, '#161D24', '#DEB67D55');
      crop(configuration, 782, 766, 380, 30, 118, 1070, 790, 62, 0);
      lines(['Ora vediamo', 'la risposta.'], 1320, 50);
    } else if (t < 17) {
      const s = t - 11;
      base(t, '03 / La risposta reale della chat');
      label('L’OSPITE CHIEDE', 475);
      question(515);
      if (s > 0.65) {
        c.globalAlpha = ease((s - 0.65) / 0.45);
        label('NEXTSPHERE RISPONDE', 805);
        // Full original reply remains visible, including its second sentence.
        crop(conversation, 16, 412, 550, 79, 88, 845, 850, 122);
        c.globalAlpha = 1;
      }
      if (s > 1.3) {
        c.globalAlpha = ease((s - 1.3) / 0.5);
        label('DETTAGLIO DELLA RISPOSTA', 1045, MUTED);
        // Enlarged pixels of the first sentence, NOT retyped chat content.
        crop(conversation, 25, 425, 337, 17, 88, 1090, 850, 43, 0);
        const trace = ease((s - 1.8) / 0.7);
        c.strokeStyle = GOLD; c.lineWidth = 4; c.lineCap = 'round';
        c.beginPath(); c.moveTo(637, 1144); c.lineTo(637 + 286 * trace, 1144); c.stroke();
        hours(1260, 'GLI STESSI ORARI INSERITI DA TE');
        c.globalAlpha = 1;
      }
    } else {
      const s = t - 17;
      base(t, 'L’assistente per i tuoi ospiti.');
      c.globalAlpha = ease(s / 0.45);
      lines(['Le tue', 'informazioni.'], 640, 84);
      lines(['Le sue', 'risposte.'], 946, 84, GOLD);
      c.globalAlpha = ease((s - 0.2) / 0.45);
      lines(['Meno domande ripetitive.', 'Più tempo per te.'], 1270, 42, MUTED);
      text('nextsphere.it', 88, 1438, 40, GOLD, 600, 'Inter');
      c.globalAlpha = 1;
    }
  }

  const movie = join(output, 'nextsphere-demo-vertical.mp4');
  const encoder = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS),
    '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-threads', '2', '-preset', 'fast',
    '-crf', '19', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', movie],
  { stdio: ['pipe', 'ignore', 'pipe'] });
  let errorLog = '';
  encoder.stderr.on('data', data => { errorLog += data.toString(); });
  const closed = once(encoder, 'close');
  encoder.stdin.on('error', () => { /* Encoder errors are reported below. */ });
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
  frame(15.5);
  writeFileSync(join(output, 'nextsphere-demo-vertical-poster.jpg'), canvas.toBuffer('image/jpeg', 90));
  console.log(`Saved ${movie}`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}