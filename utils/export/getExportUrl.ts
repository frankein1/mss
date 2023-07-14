export function getExportUrl(data: string) {
  // TODO: find a way to define downloaded file filename
  const mediaType =
    'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
  return `${mediaType}${data}`
}
