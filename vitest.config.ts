import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname)
    }
  },
  test: {
    // tests will run sequentially, but in the same global context
    // so you must provide isolation yourself
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  }
})
