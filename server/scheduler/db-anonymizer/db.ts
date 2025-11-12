export const SOURCE_SCHEMA = 'public'
export const SOURCE_DATABASE_URL = process.env.DATABASE_URL

// Write in the public schema on production to keep the same metabases queries, otherwise use a specific schema
export const TARGET_SCHEMA =
  process.env.MSS_ENVIRONMENT === 'production' ? 'public' : 'metabase'
export const ANONYMIZED_DATABASE_URL = process.env.ANONYMIZED_DATABASE_URL

// 1/4 of RAM to support large bulk vacuums
export const maintenanceWorkMem = '250MB'
export const maxParallelWorkersPerGather = 2
