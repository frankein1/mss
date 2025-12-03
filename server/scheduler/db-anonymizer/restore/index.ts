import type { Client } from 'pg'
import { ANONYMIZED_DATABASE_URL, isProductionEnvironment } from '../db'
import { createSQLQueriesForEnums } from './enum'
import { createSQLQueriesForTablesSchemas } from './table-schema'
import { restoreAnonymizedDataWithPsql } from './table-data'
import {
  createSQLQueriesForForeignKeys,
  createSQLQueriesForIndexes
} from './db-indexes'

export async function cleanTargetSchema(target: Client) {
  if (!isProductionEnvironment) {
    await target.query(
      'BEGIN;DROP SCHEMA IF EXISTS metabase CASCADE;CREATE SCHEMA metabase;COMMIT;'
    )
  }
}

export interface Queries {
  enums: string[]
  schema: string[]
  indexes: string[]
  foreignKeys: string[]
}

/**
 * SQL Queries to restore source database structure to anonymized target database.
 * 1. Create SQL queries for all enums
 * 2. Create SQL queries for table schemas
 * 3. Create SQL queries to read table data from anonymized csv dumps and restore it to target db
 * 4. CreateSQL queries for restoring indexes (only primary keys and foreign keys)
 */
export async function createQueriesForTargetDatabaseSchema(
  source: Client
): Promise<Queries> {
  const enums = await createSQLQueriesForEnums(source)

  const schema = await createSQLQueriesForTablesSchemas(source)

  const indexes = await createSQLQueriesForIndexes(source)

  const foreignKeys = await createSQLQueriesForForeignKeys(source)

  return {
    enums,
    schema,
    indexes,
    foreignKeys
  }
}

/**
 * Execute queries to restore database schema and anonymized data to target db.
 *
 * Data restored:
 * - enums
 * - table structure (columns with db types)
 * - table data
 * - primary keys and foreign keys for selected tables
 */
export async function createDatabaseSchemaAndRestoreDataToTarget(
  target: Client,
  q: Queries
) {
  await target.query(
    `BEGIN;${q.enums.join(';\n')};${q.schema.join(';\n')};COMMIT;`
  )

  await restoreAnonymizedDataWithPsql(ANONYMIZED_DATABASE_URL as string)

  await target.query(`BEGIN;${q.indexes.join(';\n')};COMMIT;`)

  // Foreign keys are useful for metabase syncs
  // See https://www.metabase.com/docs/latest/databases/sync-scan#how-database-syncs-work
  await target.query(`BEGIN;${q.foreignKeys.join(';\n')};COMMIT;`)
}
