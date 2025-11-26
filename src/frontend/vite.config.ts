import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  envDir: '../..',
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8787'
    }
  }
})