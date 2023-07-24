import { readFileSync, unlinkSync } from 'fs'
// FIXME: ExcelJS type error (Cf. https://github.com/exceljs/exceljs/issues/960)
// eslint-disable-next-line import/default
import ExcelPkg, { Column } from 'exceljs'
import { EXPORT_DEFAULT_FONT } from '~/utils/constants/export'
import { RowType } from '~/types/export'

// eslint-disable-next-line import/no-named-as-default-member
const { Workbook } = ExcelPkg

function getFullColumns(columns: Partial<Column>[], rows: RowType[]) {
  const fullColumns: Partial<Column>[] = []

  columns.forEach(column => {
    let isBlankColumn = true

    rows.forEach(row => {
      if (
        column.key &&
        row[column.key] &&
        row[column.key] !== null &&
        row[column.key] !== ''
      ) {
        isBlankColumn = false
      }
    })

    if (!isBlankColumn) {
      fullColumns.push(column)
    }
  })

  return fullColumns
}

export async function createExport(
  worksheetName: string,
  columns: Partial<Column>[],
  rows: RowType[],
  userId: string
) {
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet(worksheetName)

  worksheet.columns = getFullColumns(columns, rows)

  // Export styles
  worksheet.columns.forEach(sheetColumn => {
    sheetColumn.font = EXPORT_DEFAULT_FONT
    sheetColumn.width = 30
  })
  worksheet.getRow(1).font = {
    ...EXPORT_DEFAULT_FONT,
    bold: true
  }

  rows.forEach(row => worksheet.addRow(row))

  const exportName = `/tmp/mss-export-${userId}.xlsx`

  await workbook.xlsx.writeFile(exportName)
  const stream = readFileSync(exportName)

  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658 & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  const data = stream.toString('base64')

  unlinkSync(exportName)

  return { data }
}
