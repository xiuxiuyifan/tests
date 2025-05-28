import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// import { importMap } from './src/danymicImport';
// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: false,
    host: '0.0.0.0',
  },
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties'],
        },
      },
    }),
    tailwindcss(),
  ],
});
