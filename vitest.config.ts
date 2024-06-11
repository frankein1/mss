import path from 'path'
import {
  defineConfig,
  configDefaults,
  coverageConfigDefaults
} from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export const nuxtAutoimports = {
  from: '#imports',
  imports: ['useRuntimeConfig']
}

export default defineConfig({
  plugins: [
    /** Make nuxt auto-imports available for tests */
    AutoImport({
      imports: [nuxtAutoimports],
      dts: './test/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './test/.eslintrc-auto-import.json',
        globalsPropValue: true
      },
      dirs: ['server/utils']
    })
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname),
      '#imports': path.resolve(__dirname, './.nuxt/imports.d.ts')
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
