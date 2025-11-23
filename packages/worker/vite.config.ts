import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [cloudflare(), ssrPlugin(), vue()]
})
