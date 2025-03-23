import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from external devices
    port: 5173, // Ensures correct port is used
    strictPort: true, // Prevents Vite from changing the port
    allowedHosts: ['.loca.lt'], // Allows LocalTunnel access
  },
})
