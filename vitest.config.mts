import path from 'path'
import {
  // defineConfig,
  configDefaults,
  coverageConfigDefaults
} from 'vitest/config'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname)
    }
  },
  test: {
    environment: 'nuxt',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    coverage: {
      reporter: 'lcov',
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/*{.,-}{story}.?(c|m)[jt]s?(x)',
        'pages/stories.vue'
      ]
    },
    // tests will run sequentially, but in the same global context
    // so you must provide isolation yourself
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  }
})
