import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages ではサブパス配信、ローカル（dev/preview）ではルート配信。
// 本番: https://kouseikatou.github.io/sea-culture-map/
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/sea-culture-map/' : '/',
  plugins: [react()],
}))
