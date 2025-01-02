import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoImportPlugin from '@opentiny/unplugin-tiny-vue'
export default defineConfig({
  plugins: [
    vue(),
    autoImportPlugin('vite')
  ],
  define: {
    'process.env': { ...process.env }
  }
})