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
import { execSync } from 'node:child_process'

const sqlDumpSourceTableDataIntoCsv = (
  tableName: TableName,
  command = 'COPY'
) => {
  const columnNames = getFilteredColumnNames(tableName) // SECU: PII column deletion in data
  const values = (columnNames || []).map(escapeIdentifier).join(',')

  return `${command} ${escapeIdentifier(SOURCE_SCHEMA)}.${escapeIdentifier(tableName)} (${values}) TO ${getCsvFilename(tableName)} WITH (FORMAT CSV, HEADER, DELIMITER ",")`
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
  const tablesDataDumpQueries = TABLE_NAMES.map(t =>
    sqlDumpSourceTableDataIntoCsv(t)
  )

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

export async function dumpAnonymizedDataWithPsql(dburl: string) {
  const tablesDataDumpQueries = TABLE_NAMES.map(t =>
    sqlDumpSourceTableDataIntoCsv(t, '\\copy')
  )

  tablesDataDumpQueries.forEach(q => {
    const command = `psql "${dburl}" -c '${q}'`
    execSync(command)
  })
}
