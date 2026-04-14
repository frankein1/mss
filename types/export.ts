import type { AddWorksheetOptions, Column } from 'exceljs'

export type RowType = {
  [k: string]: string | boolean | Date | null | undefined
}

export type WorksheetType = {
  name: string
  columns: Partial<Column>[]
  rows: (string[] | RowType)[]
  options?: AddWorksheetOptions
}
