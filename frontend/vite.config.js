import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Escuchar en todas las interfaces de red
    port: 5173,  // El puerto interno dentro del contenedor
  },
})

