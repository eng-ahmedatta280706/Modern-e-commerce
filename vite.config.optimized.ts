import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@components': resolve(rootDir, './src/components'),
      '@pages': resolve(rootDir, './src/pages'),
      '@utils': resolve(rootDir, './src/utils'),
      '@types': resolve(rootDir, './src/types'),
      '@hooks': resolve(rootDir, './src/hooks'),
      '@services': resolve(rootDir, './src/services'),
      '@store': resolve(rootDir, './src/store'),
      '@data': resolve(rootDir, './src/data'),
      '@contexts': resolve(rootDir, './src/contexts'),
    },
  },
});
