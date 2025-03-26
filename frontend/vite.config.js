import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite conexiones desde fuera del contenedor
    watch: {
      usePolling: true, // Habilita polling para detectar cambios en Docker
    }
  },
  // server: {
  //   allowedHosts: [
  //     '4874-5-225-237-18.ngrok-free.app' // Modificar segun el tunel que corresponda
  //   ]
  // }
  hmr: {
    protocol: 'ws', // Asegúrate de que el protocolo sea 'ws' o 'wss' para HTTPS
    host: 'localhost', // Asegúrate de que este sea tu host, puede ser el nombre del contenedor Docker
    port: 5173, // Asegúrate de que el puerto coincida con el que usa Vite (5173 por defecto)
  },
});
