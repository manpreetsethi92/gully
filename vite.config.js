import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mirrors the "@/*" -> "src/*" mapping in jsconfig.json, which exists for
    // editor resolution. Currently unused by the source, but kept in sync so
    // the two never disagree.
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    // Pinned: the backend's CORS allowlist in gully-backend/server.py names
    // http://localhost:3000 explicitly. strictPort makes a clash fail loudly
    // instead of silently moving to 3001 and breaking API calls.
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
