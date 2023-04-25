import { resolve } from 'path'
import { defineVitestConfig } from 'nuxt-vitest/config'
import vue from '@vitejs/plugin-vue'

const r = (p: string) => resolve(__dirname, p)

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom' // NOTE: For AtomInput test, happy-dom does not work as it does not update the validity state of inputs
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '~': r('.'),
      '~/': r('./'),
      '~~': r('.'),
      '~~/': r('./')
    }
  }
})
