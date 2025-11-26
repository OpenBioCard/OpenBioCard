import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode, command }) => {
  const isClientOnly = process.env.VITE_CLIENT_ONLY === 'true'
  const isWorkerOnly = process.env.VITE_WORKER_ONLY === 'true'
  const isDev = command === 'serve'

  if (isDev) {
    // Dev config for frontend
    return {
      root: 'src/frontend',
      envDir: '../..', // From src/frontend, ../.. is root
      plugins: [vue()],
      server: {
        port: 5173,
        proxy: {
          '/api': 'http://localhost:8787'
        }
      }
    }
  }

  // Build config
  return {
    plugins: [
      ...(isWorkerOnly ? [cloudflare()] : []),
      ...(isWorkerOnly ? [ssrPlugin()] : []),
      vue()
    ] as any,
    publicDir: 'public',
    build: {
      ...(isClientOnly ? {
        outDir: 'dist/client',
        rollupOptions: {
          input: path.resolve(__dirname, 'src/frontend/index.html')
        }
      } : {}),
      ...(isWorkerOnly ? {
        outDir: 'dist/openbiocard',
        rollupOptions: {
          input: path.resolve(__dirname, 'src/server/index.tsx'),
          external: [
            /^cloudflare:.*/,
            /^node:.*/
          ]
        }
      } : {})
    }
  }
})
