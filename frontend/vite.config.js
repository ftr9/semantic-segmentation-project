import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/logix/api/upload': 'http://localhost:8000',
      '/logix/api/?format=json': 'http://localhost:8000',
      '/media': 'http://localhost:8000',
    },
  },
});
