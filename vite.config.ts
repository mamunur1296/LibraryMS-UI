/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const resolvePath = (relativePath: string): string =>
  fileURLToPath(new URL(relativePath, import.meta.url));

const API_TARGET = process.env['VITE_DEV_API_TARGET'] ?? 'https://localhost:44353';
const toBackend = { target: API_TARGET, changeOrigin: true, secure: false };

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@app': resolvePath('./src/app'),
      '@core': resolvePath('./src/core'),
      '@shared': resolvePath('./src/shared'),
      '@features': resolvePath('./src/features'),
      '@testing': resolvePath('./src/testing'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': toBackend,
      '/connect': toBackend,
      '/.well-known': toBackend,
      '/health': toBackend,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string): string | undefined => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('@tanstack')) return 'query';
          if (id.includes('recharts') || id.includes('d3')) return 'charts';
          if (id.includes('motion') || id.includes('framer')) return 'motion';
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return 'react';
          }
          return undefined;
        },
      },
    },
  },
  test: {
    globals: false,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
