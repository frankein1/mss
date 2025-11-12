import { escapeIdentifier } from 'pg'
import { TARGET_SCHEMA } from '../db'
import { getCsvFilename, getFilteredColumnNames } from '../utils'
import { TABLE_NAMES, type TableName } from '../config'

const sqlRestoreTargetTableDataFromCsv = (tableName: TableName) => {
  const columnNames = getFilteredColumnNames(tableName) // SECU: PII column deletion in data
  const values = (columnNames || []).map(escapeIdentifier).join(',')

  return `COPY ${escapeIdentifier(TARGET_SCHEMA)}.${escapeIdentifier(tableName)} (${values}) FROM '${getCsvFilename(tableName)}' WITH (FORMAT CSV, HEADER, DELIMITER ',')`
}

/**
 * Copy csv to target db: target.query("COPY table_name from '*.csv'")
 * */
export function createSQLQueriesForTableDataRestoreToTarget() {
  return TABLE_NAMES.map(sqlRestoreTargetTableDataFromCsv)
}
