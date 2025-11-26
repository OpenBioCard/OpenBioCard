import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isClientOnly = process.env.VITE_CLIENT_ONLY === 'true'
  const isWorkerOnly = process.env.VITE_WORKER_ONLY === 'true'

  const config = {
    plugins: [
      // Only use cloudflare plugin for worker build
      ...(isWorkerOnly ? [cloudflare()] : []),
      // Only use ssrPlugin for worker build
      ...(isWorkerOnly ? [ssrPlugin()] : []),
      vue()
    ] as any,
    publicDir: 'public',
    build: {
      // For client only build, build the frontend
      ...(isClientOnly ? {
        outDir: 'dist/client',
        rollupOptions: {
          input: path.resolve(__dirname, 'src/frontend/index.html')
        }
      } : {}),
      // For worker build, build the server
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

  return config as any
})
