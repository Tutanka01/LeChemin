/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// SPA configuration
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
