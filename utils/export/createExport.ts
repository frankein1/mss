import { readFileSync } from 'fs'
// FIXME: ExcelJS type error (Cf. https://github.com/exceljs/exceljs/issues/960)
// eslint-disable-next-line import/default
import ExcelPkg, { Column, Cell } from 'exceljs'
import { EXPORT_DEFAULT_FONT } from '~/utils/constants/export'
import { RowType } from '~/types/export'

// eslint-disable-next-line import/no-named-as-default-member
const { Workbook } = ExcelPkg

export async function createExport(
  worksheetName: string,
  columns: Partial<Column>[],
  rows: RowType[],
  userId: string
) {
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet(worksheetName)

  worksheet.columns = columns

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
