import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/react-pages/',   // https://dev.to/shashannkbawa/deploying-vite-app-to-github-pages-3ane
  plugins: [react()],
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
      }
    }
})
