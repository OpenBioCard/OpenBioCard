import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  // @ts-ignore
  plugins: [cloudflare(), ssrPlugin(), vue()],
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'src/server/index.tsx'),
      external: [
        /^cloudflare:.*/,
        /^node:.*/
      ]
    }
  }
})
