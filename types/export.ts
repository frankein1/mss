import { Column } from 'exceljs'

export type RowType = { [k: string]: string | boolean }

export type WorksheetType = {
  name: string
  columns: Partial<Column>[]
  rows: RowType[]
}
