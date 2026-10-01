import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { findPortraitDemo } from './demoMedia';

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;

const basePath = process.env.BASE_PATH ?? '/';
const mediaDir = path.resolve(import.meta.dirname, 'public/media');
const portraitDemo = findPortraitDemo(mediaDir);

export default defineConfig({
  base: basePath,
  define: {
    __NEXTSPHERE_DEMO_PORTRAIT__: JSON.stringify(portraitDemo),
  },
  plugins: [
    {
      name: 'nextsphere-demo-formats',
      configureServer(server) {
        // Isolated video work can merge after the website is already running.
        // Refresh metadata only when a complete export/poster actually changes it.
        let snapshot = JSON.stringify(portraitDemo);
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onMedia = (file: string) => {
          if (path.dirname(file) !== mediaDir || !/^nextsphere.*\.(mp4|jpg|png|webp)$/i.test(path.basename(file))) return;
          clearTimeout(timer);
          timer = setTimeout(() => {
            const next = JSON.stringify(findPortraitDemo(mediaDir));
            if (next === snapshot) return;
            snapshot = next;
            void server.restart();
          }, 750);
        };
        server.watcher.add(mediaDir);
        for (const event of ['add', 'change', 'unlink'] as const) server.watcher.on(event, onMedia);
        server.httpServer?.once('close', () => {
          clearTimeout(timer);
          for (const event of ['add', 'change', 'unlink'] as const) server.watcher.off(event, onMedia);
        });
      },
    },
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
