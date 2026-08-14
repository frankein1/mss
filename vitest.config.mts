import {
  // defineConfig,
  configDefaults,
  coverageConfigDefaults
} from 'vitest/config'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        overrides: {
          modules: ['./test/components/strip-plugins.module.ts']
        }
      }
    },
    exclude: [...configDefaults.exclude, 'e2e/**', 'scripts/**'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'e2e/**',
        '**/*{.,-}{story}.?(c|m)[jt]s?(x)',
        'pages/stories.vue'
      ]
    },
    // tests will run sequentially, but in the same global context
    // so you must provide isolation yourself
    maxWorkers: 1,
    isolate: false,
    setupFiles: 'test/server/setup.ts'
  }
})
