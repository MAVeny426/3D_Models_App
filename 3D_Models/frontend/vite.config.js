// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://threed-models-app.onrender.com",
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://threed-models-app.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});