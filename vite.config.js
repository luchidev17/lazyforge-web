import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Base path para GitHub Pages: https://luchidev17.github.io/lazyforge-web/
  base: '/lazyforge-web/',
})
