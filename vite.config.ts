import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'chitty-icon.svg', 'chitty-maskable.svg'],
      manifest: {
        name: 'Chitty — Lovable Finance',
        short_name: 'Chitty',
        description: 'A whimsical, offline-friendly chitty & finance companion.',
        theme_color: '#fdf2f8',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/chitty-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/chitty-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: '/chitty-maskable.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
