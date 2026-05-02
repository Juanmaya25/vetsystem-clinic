import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// El base path debe coincidir con el nombre del repo para GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: '/vetsystem-clinic/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
