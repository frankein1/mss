function download(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)

  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

function open(blob: Blob) {
  const url = window.URL.createObjectURL(blob)
  window.open(url, '_blank')
  window.URL.revokeObjectURL(url)
}

export const useDownload = () => {
  return { download, open }
}
