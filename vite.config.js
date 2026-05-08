import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],
  base: '/teachers-pet/',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-utils': ['jspdf', 'html2canvas', 'docx', 'file-saver', 'mermaid'],
          'vendor-math': ['katex', 'react-markdown', 'remark-math', 'rehype-katex'],
          'vendor-ai': ['@google/generative-ai'],
        }
      }
    }
  }
})
