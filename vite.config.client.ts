import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: { port: 3000 },
  root: './src/client',
  build: {
    outDir: '../../build/public',
    emptyOutDir: false,
  },
  clearScreen: false,
});
