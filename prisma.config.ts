import 'dotenv/config'
import path from 'node:path'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'tsx prisma/seed.ts'
  },
  datasource: {
    // In the pnpm:install step of the CI, the DB_URL should not be needed
    // but the env utils of prisma checks for its existence which result in a CI job failure
    url: process.env.CI ? process.env.DATABASE_URL! : env('DATABASE_URL')
  }
})
