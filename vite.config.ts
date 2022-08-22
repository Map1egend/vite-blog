import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteEslint from 'vite-plugin-eslint'
import windi from 'vite-plugin-windicss'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteEslint(), windi()],
  resolve: {
    alias: {
      '@assets': path.join(__dirname, 'src/assets'),
      '@components': path.join(__dirname, 'src/components'),
      '@utils': path.join(__dirname, 'src/utils'),
      '@hooks': path.join(__dirname, 'src/hooks'),
      '@types': path.join(__dirname, 'src/types'),
      '@store': path.join(__dirname, 'src/store')
    }
  }
})
