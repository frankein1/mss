export function getExportUrl(data: string) {
  const mediaType =
    'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
  return `${mediaType}${data}`
}
