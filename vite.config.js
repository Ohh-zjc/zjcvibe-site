import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Cloudflare Pages serves the app at the domain root, unlike GitHub Pages.
  base: process.env.CF_PAGES ? '/' : '/dongtinghu/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
