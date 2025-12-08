import { Client } from 'pg'
import {
  TARGET_SCHEMA,
  SOURCE_DATABASE_URL,
  ANONYMIZED_DATABASE_URL,
  isDeployedEnvironment,
  PGSQL_VERSION
} from './db'
import { cleanDumps, dumpAnonymizedDataWithPsql } from './dump'
import {
  createQueriesForTargetDatabaseSchema,
  createDatabaseSchemaAndRestoreDataToTarget,
  type Queries
} from './restore'
import { performance } from 'node:perf_hooks'
import { execSync } from 'node:child_process'
import { cleanTargetSchema } from './clean/clean-target-schema'

let start: number
let end: number

/**
 * Use:
 * > ANONYMIZED_DATABASE_URL="postgresql://xx:yy@localhost:5432/mss" DATABASE_URL="postgresql://xx:yy@localhost:5432/mss" tsx server/scheduler/db-anonymizer/index.ts
 */
async function main() {
  if (!SOURCE_DATABASE_URL) {
    throw new Error('Missing source database url')
  }

  if (!ANONYMIZED_DATABASE_URL) {
    throw new Error('Missing target database url')
  }

  console.log('MSS environment', process.env.NUXT_PUBLIC_MSS_ENVIRONMENT)
  console.log('Target schema', TARGET_SCHEMA)

  if (isDeployedEnvironment) {
    execSync(`dbclient-fetcher postgresql ${PGSQL_VERSION}`)
  }

  // Execute dump
  start = performance.now()
  try {
    await dumpAnonymizedDataWithPsql(SOURCE_DATABASE_URL)
  } catch (err) {
    console.error(err)
    await cleanDumps()
    return 1
  } finally {
    end = performance.now()
    const duration = end - start
    console.log(
      `db-anonymized::dump-anonymized-data-from-source: [${new Date().toISOString()}]: duration: ${duration.toFixed(0)}ms`
    )
  }

  // Execute restore
  const source = new Client({ connectionString: SOURCE_DATABASE_URL })
  await source.connect()

  let queries: Queries | undefined
  start = performance.now()
  try {
    queries = await createQueriesForTargetDatabaseSchema(source)
  } catch (err) {
    console.error(err)
    await cleanDumps()
    return 1
  } finally {
    end = performance.now()
    const duration = end - start
    console.log(
      `db-anonymized::create-queries-for-target-database-schema: [${new Date().toISOString()}]: duration: ${duration.toFixed(0)}ms`
    )

    await source.end()
  }

  const target = new Client({ connectionString: ANONYMIZED_DATABASE_URL })
  await target.connect()

  start = performance.now()
  try {
    await cleanTargetSchema(target)
    await createDatabaseSchemaAndRestoreDataToTarget(target, queries)
  } catch (err) {
    console.error(err)
    return 1
  } finally {
    end = performance.now()
    const duration = end - start
    console.log(
      `db-anonymized::create-database-schema-and-restore-data-to-target: [${new Date().toISOString()}]: duration: ${duration.toFixed(0)}ms`
    )

    await cleanDumps()
    await target.end()
  }

  return 0
}

main()
