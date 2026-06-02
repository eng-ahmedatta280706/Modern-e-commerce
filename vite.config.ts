import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Modern-e-commerce/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});