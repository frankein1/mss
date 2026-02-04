import { SCHEDULER_ENV } from '../env'

export const PGSQL_VERSION = '14'

export const SOURCE_SCHEMA = 'public'
export const SOURCE_DATABASE_URL = SCHEDULER_ENV.anonymizer.readonlyDatabaseUrl

const env = SCHEDULER_ENV.public.mssEnvironment
export const isProductionEnvironment = env === 'production'
export const isDeployedEnvironment = env && env !== 'local'

// Write in the public schema on production to keep the same metabases queries, otherwise use a specific schema
export const TARGET_SCHEMA = isProductionEnvironment ? 'public' : 'metabase'
export const ANONYMIZED_DATABASE_URL =
  SCHEDULER_ENV.anonymizer.anonymizedDatabaseUrl

// 1/4 of RAM to support large bulk vacuums
export const maintenanceWorkMem = '250MB'
export const maxParallelWorkersPerGather = 2
