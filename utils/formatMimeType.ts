export function formatMimeType(mimeType: string) {
  if (mimeType !== 'image/svg+xml' && mimeType.match(/^image\//)) {
    return mimeType.replace('image/', '').toUpperCase()
  }

  switch (mimeType) {
    case 'application/pdf':
      return 'PDF'
    case 'image/svg+xml':
      return 'SVG'
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'XLSX'
    case 'application/vnd.ms-excel':
      return 'XLS'
    case 'application/vnd.oasis.opendocument.spreadsheet':
      return 'ODS'
    case 'application/msword':
      return 'DOC'
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'DOCX'
    case 'application/vnd.oasis.opendocument.text':
      return 'ODT'
    default:
      return mimeType
  }
}
