import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          mantine: ['@mantine/core', '@mantine/hooks', '@mantine/notifications'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
