import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // A porta onde o Vite estará servindo o app
    open: true, // Abre automaticamente o navegador
  },
});
