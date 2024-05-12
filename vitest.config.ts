import path from 'path'
import { defineConfig, coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname)
    }
  },
  test: {
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        'e2e/**',
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
