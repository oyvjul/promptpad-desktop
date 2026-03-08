import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    plugins: [wasm(), react()]
  }
})
