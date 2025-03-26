import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '4874-5-225-237-18.ngrok-free.app' // Modificar segun el tunel que corresponda
    ]
  }
});
