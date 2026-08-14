export const getColumns = (header: string) => {
  return [
    {
      key: 'label',
      header: header
    },
    {
      key: 'number',
      header: 'Nombre'
    },
    {
      key: 'percent',
      header: 'Pourcentage'
    }
  ]
}
