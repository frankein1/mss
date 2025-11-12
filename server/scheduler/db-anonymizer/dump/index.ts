import { escapeIdentifier } from 'pg'
import type { Client } from 'pg'
import {
  maintenanceWorkMem,
  maxParallelWorkersPerGather,
  SOURCE_SCHEMA
} from '../db'
import { getCsvFilename, getFilteredColumnNames } from '../utils'
import { TABLE_NAMES, type TableName } from '../config'
import { rm } from 'node:fs/promises'

const sqlDumpSourceTableDataIntoCsv = (tableName: TableName) => {
  const columnNames = getFilteredColumnNames(tableName) // SECU: PII column deletion in data
  const values = (columnNames || []).map(escapeIdentifier).join(',')

  return `COPY ${escapeIdentifier(SOURCE_SCHEMA)}.${escapeIdentifier(tableName)} (${values}) TO '${getCsvFilename(tableName)}' WITH (FORMAT CSV, HEADER, DELIMITER ',')`
}

/** SQL Query to copy table data to csv for tables selected by the script configuration. */
function createSQLQueriesForTableDataDumpFromSource() {
  return TABLE_NAMES.map(sqlDumpSourceTableDataIntoCsv)
}

/** Execute query to dump anonymized data to csv
 *
 * Only columns that contain no PII are kept; others are discarded.
 * The result is dumped to file '/tmp/{table_name}.csv'
 *
 * The queries are encapsulated in a transaction with an isolation level comparable to
 * the one used in `pg_dump`.
 * See https://github.com/postgres/postgres/blob/REL_14_STABLE/src/bin/pg_dump/pg_dump.c#L1261
 *
 * This allows to maintain a coherent data dump even if the
 * database has active writes during the process.
 */
export async function dumpAnonymizedDataFromSource(source: Client) {
  const tablesDataDumpQueries = createSQLQueriesForTableDataDumpFromSource()

  const sqlDumpFromSource = `
SET maintenance_work_mem = '${maintenanceWorkMem}';
SET max_parallel_workers_per_gather = ${maxParallelWorkersPerGather};

BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ, READ ONLY;
${tablesDataDumpQueries.join(';\n')};
COMMIT;
`
  // console.log(sqlDumpFromSource)
  return await source.query(sqlDumpFromSource)
}

export async function cleanDumps() {
  await Promise.all(
    TABLE_NAMES.map(name => rm(getCsvFilename(name), { force: true }))
  )
}
