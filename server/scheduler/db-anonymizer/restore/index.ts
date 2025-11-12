import type { Client } from 'pg'
import { maintenanceWorkMem, maxParallelWorkersPerGather } from '../db'
import { createSQLQueriesForEnums } from './enum'
import { createSQLQueriesForTablesSchemas } from './table-schema'
import { createSQLQueriesForTableDataRestoreToTarget } from './table-data'
import {
  createSQLQueriesForForeignKeys,
  createSQLQueriesForIndexes
} from './db-indexes'

export async function cleanTargetSchema(target: Client) {
  await target.query(
    'BEGIN;DROP SCHEMA IF EXISTS metabase CASCADE;CREATE SCHEMA metabase;COMMIT;'
  )
}

export interface Queries {
  enums: string[]
  schema: string[]
  tableData: string[]
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

  const tableData = createSQLQueriesForTableDataRestoreToTarget()

  const indexes = await createSQLQueriesForIndexes(source)

  const foreignKeys = await createSQLQueriesForForeignKeys(source)

  return {
    enums,
    schema,
    tableData,
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
 *
 * The queries are encapsulated in a transaction.
 */
export async function createDatabaseSchemaAndRestoreDataToTarget(
  target: Client,
  q: Queries
) {
  const sqlRestoreToTarget = `
SET maintenance_work_mem = '${maintenanceWorkMem}';
SET max_parallel_workers_per_gather = ${maxParallelWorkersPerGather};

BEGIN;
${q.enums.join(';\n')};
${q.schema.join(';\n')};
${q.tableData.join(';\n')};
${q.indexes.join(';\n')};
${q.foreignKeys.join(';\n')};
COMMIT;
`
  // console.log(sqlRestoreToTarget)
  await target.query(sqlRestoreToTarget)
}
