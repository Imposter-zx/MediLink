import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing'],
          mantine: ['@mantine/core', '@mantine/hooks', '@mantine/notifications'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
