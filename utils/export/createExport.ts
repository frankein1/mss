import { readFileSync } from 'fs'
// FIXME: ExcelJS import error
import Excel from 'exceljs/lib/exceljs.nodejs'
import { Column, Cell } from 'exceljs'
import { EXPORT_DEFAULT_FONT } from '../constants'
import { RowType } from '~/types/export'

export async function createExport(
  worksheetName: string,
  columns: { key: string; header: string }[],
  rows: RowType[],
  userId: string
) {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet(worksheetName)

  worksheet.columns = columns

  // Export styles
  worksheet.columns.forEach((sheetColumn: Column) => {
    sheetColumn.font = EXPORT_DEFAULT_FONT
    sheetColumn.width = 30
  })
  worksheet.getRow(1).font = {
    ...EXPORT_DEFAULT_FONT,
    bold: true
  }

  rows.forEach(row => worksheet.addRow(row))

  // Remove empty columns
  const lastColumnIndex = worksheet.columns.length
  for (let columnIndex = lastColumnIndex; columnIndex >= 1; columnIndex--) {
    const column: Column = worksheet.getColumn(columnIndex)

    let isBlankColumn = true
    column.eachCell((cell: Cell) => {
      if (
        cell.value !== null &&
        cell.value !== '' &&
        parseInt(cell.row) !== 1
      ) {
        isBlankColumn = false
      }
    })

    if (isBlankColumn) {
      worksheet.spliceColumns(columnIndex, 1)
    }
  }

  const exportName = `/tmp/mss-export-${userId}.xlsx`

  await workbook.xlsx.writeFile(exportName)
  const stream = readFileSync(exportName)

  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658 & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  return { data: stream.toString('base64') }
}
