import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/flagler/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Flagler - Space Shooter',
        short_name: 'Flagler',
        description: 'A space shooter inspired by Space Invaders, Galaga, and Defender',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'fullscreen',
        orientation: 'any',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
