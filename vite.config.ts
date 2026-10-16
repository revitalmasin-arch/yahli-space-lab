import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// RELEASE_ID is set by ops/candidate.mjs. A plain dev server gets "dev".
const releaseId = process.env.RELEASE_ID ?? 'dev';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __RELEASE_ID__: JSON.stringify(releaseId),
    // "dev" for the dev server, "prod" for every built release (candidate or active).
    __APP_ENV__: JSON.stringify(command === 'serve' ? 'dev' : 'prod'),
  },
  build: {
    outDir: process.env.BUILD_OUT_DIR ?? 'dist',
    emptyOutDir: true,
    // One bundle: an open tab never needs to lazy-load a chunk that a newer release removed.
    rollupOptions: { output: { inlineDynamicImports: true } },
    assetsInlineLimit: 0,
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
}));
