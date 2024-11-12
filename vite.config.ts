import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: { exclude: ["fsevents"] },
  plugins: [
    svelte(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir:'',
      injectManifest: {
        injectionPoint:undefined,
    },
      filename: 'service-worker.js',
    }),
  ],
})
