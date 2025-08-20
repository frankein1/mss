import { readFileSync, unlinkSync } from 'fs'
// FIXME: ExcelJS type error (Cf. https://github.com/exceljs/exceljs/issues/960)
import type { Column, Workbook } from 'exceljs'
import ExcelPkg from 'exceljs'
import { EXPORT_DEFAULT_FONT } from '~/utils/constants/export'
import type { RowType, WorksheetType } from '~/types/export'

const { Workbook: WorkbookConstructor } = ExcelPkg

function getFullColumns(
  columns: Partial<Column>[],
  rows: (string[] | RowType)[]
) {
  const fullColumns: Partial<Column>[] = []

  columns.forEach(column => {
    let isBlankColumn = true

    rows.forEach(row => {
      if (
        column.key &&
        !Array.isArray(row) &&
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

function createWorksheet(workbook: Workbook, worksheetData: WorksheetType) {
  const worksheet = workbook.addWorksheet(worksheetData.name)

  worksheet.columns = getFullColumns(worksheetData.columns, worksheetData.rows)

  // Export styles
  worksheet.columns.forEach(sheetColumn => {
    sheetColumn.font = EXPORT_DEFAULT_FONT
    sheetColumn.width = 30
  })
  worksheet.getRow(1).font = {
    ...EXPORT_DEFAULT_FONT,
    bold: true
  }

  worksheetData.rows.forEach(row => {
    const newRow = worksheet.addRow(row)
    if ((row as RowType).bold) {
      newRow.font = { bold: true }
    }
  })
}

export async function createExport(
  userId: string,
  worksheets: WorksheetType[]
) {
  const workbook = new WorkbookConstructor()

  worksheets.forEach(worksheet => createWorksheet(workbook, worksheet))

  const exportName = `/tmp/mss-export-${userId}.xlsx`

  await workbook.xlsx.writeFile(exportName)
  const stream = readFileSync(exportName)

  unlinkSync(exportName)

  return stream
}
