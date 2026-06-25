import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [solid(), tailwindcss()],
  build: {
    outDir: 'dist-renderer',
  },
  server: {
    port: 5180,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@megon/sdk': fileURLToPath(new URL('../../packages/sdk/js/src', import.meta.url)),
      '@megon/plugin': fileURLToPath(new URL('../../packages/plugin/src', import.meta.url)),
      '@megon/server': fileURLToPath(new URL('../../packages/server/src', import.meta.url)),
      '@megon/ui/pierre': fileURLToPath(new URL('../../packages/ui/src/pierre', import.meta.url)),
      '@megon/ui/hooks': fileURLToPath(new URL('../../packages/ui/src/hooks/index.ts', import.meta.url)),
      '@megon/ui/i18n': fileURLToPath(new URL('../../packages/ui/src/i18n', import.meta.url)),
      '@megon/ui/context': fileURLToPath(new URL('../../packages/ui/src/context', import.meta.url)),
      '@megon/ui': fileURLToPath(new URL('../../packages/ui/src/components', import.meta.url)),
      '@megon/util': fileURLToPath(new URL('../../packages/util/src', import.meta.url)),
      '@solid-primitives/event-bus': fileURLToPath(new URL('./node_modules/@solid-primitives/event-bus', import.meta.url)),
    },
    dedupe: ['solid-js'],
    preserveSymlinks: false,
  },
  optimizeDeps: {
    include: ['zod'],
  },
})
