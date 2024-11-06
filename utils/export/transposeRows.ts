import { RowType } from '~/types/export'

export const transposeRows = (
  initialColums: {
    key: string
    header: string
  }[],
  initialRows: RowType[],
  columnName: string
) => {
  const headersMap = Object.fromEntries(
    initialColums.map(({ key, header }) => [key, header])
  )

  const rows = Object.keys(headersMap).map(key => ({
    [columnName]: headersMap[key],
    Number: initialRows[0][key] || '0',
    Percent: initialRows[1][key] || '0%'
  }))

  return rows.filter(row => row.Number !== '0')
}

export const getTransposedColumns = (key: string, name: string) => {
  return [
    { key: key, header: name },
    { key: 'Number', header: 'Nombre' },
    { key: 'Percent', header: 'Pourcentage' }
  ]
}
