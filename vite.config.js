import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base:'/react-pages/',   // https://dev.to/shashannkbawa/deploying-vite-app-to-github-pages-3ane
  plugins: [
    react(),

    // PWA: check https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples/react-router
    VitePWA()             // TODO: use config from https://vite-pwa-org.netlify.app/examples/react.html
  ],
})


// TODO: sitemap with https://www.npmjs.com/package/vite-plugin-pages-sitemap
