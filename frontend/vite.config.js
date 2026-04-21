import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // 🌟 1. Increase the limit to 1000kb so the warning disappears
    chunkSizeWarningLimit: 1000,
    
    // 🌟 2. Split large libraries into separate files (Manual Chunking)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) return 'vendor-map';
            if (id.includes('recharts')) return 'vendor-charts';
            if (id.includes('lucide-react')) return 'vendor-icons';
            return 'vendor'; // Everything else goes here
          }
        },
      },
    },
  },
})