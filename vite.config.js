import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const base =
  process.env.GITHUB_PAGES === 'true'
    ? process.env.GITHUB_PAGES_BASE || '/life-effort-viz/'
    : '/'

export default defineConfig({
  base,
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4174,
    strictPort: true,
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '人生努力可视化',
        short_name: '努力可视化',
        description: '把日常努力变成经验值，可视化你的成长',
        theme_color: '#ccfbf1',
        background_color: '#f0fdf9',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'zh-CN',
        start_url: base,
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
})
