export const PGSQL_VERSION = '14'

export const SOURCE_SCHEMA = 'public'
export const SOURCE_DATABASE_URL = process.env.READONLY_DATABASE_URL

export const isProductionEnvironment =
  process.env.MSS_ENVIRONMENT === 'production'
export const isDeployedEnvironment =
  process.env.MSS_ENVIRONMENT && process.env.MSS_ENVIRONMENT !== 'local'

// Write in the public schema on production to keep the same metabases queries, otherwise use a specific schema
export const TARGET_SCHEMA = isProductionEnvironment ? 'public' : 'metabase'
export const ANONYMIZED_DATABASE_URL = process.env.ANONYMIZED_DATABASE_URL

// 1/4 of RAM to support large bulk vacuums
export const maintenanceWorkMem = '250MB'
export const maxParallelWorkersPerGather = 2
