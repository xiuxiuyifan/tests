import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// import { importMap } from './src/danymicImport';
// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: false,
  },
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties'],
        },
      },
    }),
    viteIgnoreStaticImport(['vue', 'element-plus']),
    tailwindcss(),
  ],
});

function viteIgnoreStaticImport(importKeys) {
  return {
    name: 'vite-plugin-importmap',
    enforce: 'pre',
    // 1. insert to optimizeDeps.exclude to prevent pre-transform
    config(config) {
      config.optimizeDeps = {
        ...(config.optimizeDeps ?? {}),
        exclude: [...(config.optimizeDeps?.exclude ?? []), ...importKeys],
      };
    },
    // 2. push a plugin to rewrite the 'vite:import-analysis' prefix
    configResolved(resolvedConfig) {
      const VALID_ID_PREFIX = `/@id/`;
      const reg = new RegExp(`${VALID_ID_PREFIX}(${importKeys.join('|')})`, 'g');
      resolvedConfig.plugins.push({
        name: 'vite-plugin-importmap-replace-idprefix',
        transform: (code) => (reg.test(code) ? code.replace(reg, (m, s1) => s1) : code),
      });
    },
    // 3. rewrite the id before 'vite:resolve' plugin transform to 'node_modules/...'
    resolveId: (id) => {
      if (importKeys.includes(id)) {
        return { id, external: true };
      }
    },
  };
}
