function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)

  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

function openBlob(blob: Blob) {
  const url = window.URL.createObjectURL(blob)
  window.open(url, '_blank')
  window.URL.revokeObjectURL(url)
}

function download(url: string, filename: string, type: string) {
  const link = document.createElement('a')
  link.type = type
  link.href = url
  link.download = filename
  link.click()
  link.remove()
}

function open(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')?.focus()
}

export const useDownload = () => {
  return {
    legacyBlob: { download: downloadBlob, open: openBlob },
    download,
    open
  }
}
