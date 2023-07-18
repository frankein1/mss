export function getExportFilename(resource: string) {
  return `monsuivisocial_${formatDate(
    new Date(),
    'DD_MM_YYYY'
  )}_${resource}.xlsx`
}
