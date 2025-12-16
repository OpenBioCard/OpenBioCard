import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { cloudflare } from '@cloudflare/vite-plugin'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      vueDevTools(),
      cloudflare({
        configPath: '../../wrangler.jsonc',
        persistState: {
          path: '../backend/.wrangler/state/v3'
        }
      })
    ],
    server: {
      port: 8787
    },
    build: {
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[ext]'
        }
      },
      minify: true,
      sourcemap: true
    },
    publicDir: 'public',
    assetsInclude: ['**/*.svg']
  }
})
