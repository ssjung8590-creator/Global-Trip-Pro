import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ mode }) => {
      const env = loadEnv(mode, '.', '');
      return {
              plugins: [react()],
              css: {
                        postcss: {
                                    plugins: [tailwindcss(), autoprefixer()],
                        },
              },
              define: {
                        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
              },
      }
})
