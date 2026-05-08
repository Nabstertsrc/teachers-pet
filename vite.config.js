import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/teachers-pet/',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-utils': ['jspdf', 'html2canvas', 'docx', 'file-saver', 'mermaid'],
          'vendor-ai': ['@google/generative-ai'],
        }
      }
    }
  }
})
