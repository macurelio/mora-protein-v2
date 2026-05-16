import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mora-protein-v2/',
  plugins: [react()],
})
