import { readFileSync } from 'fs'
// FIXME: ExcelJS import error
import Excel from 'exceljs/lib/exceljs.nodejs'

export async function createExport(
  worksheetName: string,
  columns: { key: string; header: string }[],
  // TODO: find better type than any
  rows: { [k: string]: any }[]
) {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet(worksheetName)

  worksheet.columns = columns
  // TODO: column headers style: https://blog.tericcabrel.com/write-data-excel-file-nodejs-typescript/

  rows.forEach(row => worksheet.addRow(row))

  await workbook.xlsx.writeFile('/tmp/mss-test.xlsx')
  const stream = readFileSync('/tmp/mss-test.xlsx')

  // Forced to return base64 encoded version of the file in tRPC
  // Cf. https://github.com/trpc/trpc/discussions/658 & https://stackoverflow.com/questions/73715285/exceljs-download-xlsx-file-with-trpc-router
  return { data: stream.toString('base64') }
}
