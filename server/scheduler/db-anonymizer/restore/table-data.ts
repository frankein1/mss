import { escapeIdentifier } from 'pg'
import { TARGET_SCHEMA } from '../db'
import { getCsvFilename, getFilteredColumnNames } from '../utils'
import { TABLE_NAMES, type TableName } from '../config'
import { execSync } from 'node:child_process'

const sqlRestoreTargetTableDataFromCsv = (
  tableName: TableName,
  command = 'COPY'
) => {
  const columnNames = getFilteredColumnNames(tableName) // SECU: PII column deletion in data
  const values = (columnNames || []).map(escapeIdentifier).join(',')

  return `${command} ${escapeIdentifier(TARGET_SCHEMA)}.${escapeIdentifier(tableName)} (${values}) FROM ${getCsvFilename(tableName)} WITH (FORMAT CSV, HEADER, DELIMITER ",")`
}

export async function restoreAnonymizedDataWithPsql(dburl: string) {
  const tablesDataDumpQueries = TABLE_NAMES.map(t =>
    sqlRestoreTargetTableDataFromCsv(t, '\\copy')
  )

  tablesDataDumpQueries.forEach(q => {
    const command = `psql "${dburl}" -c '${q}'`
    execSync(command)
  })
}
