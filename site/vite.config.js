import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allow importing from ../data/ relative to site/
      '@data': new URL('../data', import.meta.url).pathname,
    },
  },
});
