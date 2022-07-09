import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS({
      scan: {
        dirs: ['.'],
        fileExtensions: ['vue', 'js', 'ts'],
      },
    }),
  ],
  root: './src/client',
  build: {
    outDir: '../../build/public',
    emptyOutDir: false,
  },
  clearScreen: false,
});
