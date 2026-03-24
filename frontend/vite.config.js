import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project URL: https://<user>.github.io/<repo>/ — needs non-root base.
// Vercel / local: leave unset (defaults to '/').
const base = process.env.VITE_BASE_PATH || '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
})
