import path from 'path'
import {
  defineConfig,
  configDefaults,
  coverageConfigDefaults
} from 'vitest/config'
import { config as dotenvConfig } from '@dotenvx/dotenvx'

dotenvConfig(process.env.CI ? {} : { path: './.env.local.test' })

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname)
    }
  },
  test: {
    exclude: [...configDefaults.exclude, 'e2e/**'],
    coverage: {
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
