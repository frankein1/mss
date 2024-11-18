import { StatsCardConfig } from '~/types/stat'
import domtoimage from 'dom-to-image-more'
import { StatFilterInput } from '~/server/schema'
import { getExportUrl } from '~/utils/export/getExportUrl'
import { getExportFilename } from '~/utils/export/getExportFilename'
import { FAILED_DOWNLOAD_ERROR_MESSAGE } from '~/utils/constants'
import { BlobWriter, BlobReader, ZipWriter } from '@zip.js/zip.js'

// Export Cards as image
const extractIds = (config: StatsCardConfig) => {
  return Object.values(config).map(item => item.id)
}
const extractNames = (config: StatsCardConfig) => {
  return Object.values(config).map(item => item.name)
}

type Filter = (node: HTMLElement | Node) => boolean

export const zipAndDownloadImages = async (
  zipname: string,
  statsCardConfig: StatsCardConfig,
  filter: Filter,
  finallyFn: () => void
) => {
  const scale = 1
  const configIds = extractIds(statsCardConfig)
  const configNames = extractNames(statsCardConfig)
  const nodes = configIds
    .map(id => {
      const node = document.getElementById(id)
      if (node) {
        return node
      }
    })
    .filter(node => node != null)

  const zipWriter = new ZipWriter(new BlobWriter('application/zip'))

  const promises = nodes.map(async (node, i) => {
    const expandButton = node?.getElementsByClassName(
      'btn-unexpanded'
    )[0] as HTMLElement
    if (expandButton) {
      expandButton.click()
    }
    const blob = await domtoimage.toBlob(node, {
      width: node.clientWidth * scale,
      height: node.clientHeight * scale,
      style: {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left'
      },
      quality: 0.9,
      filter: filter
    })
    return zipWriter.add(configNames[i] + '.png', new BlobReader(blob))
  })
  try {
    await Promise.all(promises)
    const finalBlob = await zipWriter.close()
    const link = document.createElement('a')
    link.download = zipname + '.zip'
    link.href = URL.createObjectURL(finalBlob)
    link.click()
    link.remove()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    useSnackbar().error("Les images n'ont pas pu être exportées.")
  } finally {
    finallyFn()
  }
}

type ExportType =
  | 'stats_entretiens'
  | 'stats_instructions_dossier'
  | 'stats_beneficiaires'

// export as Excel file
export const exportStats = async (
  filters: StatFilterInput,
  exportType: ExportType,
  client: any,
  isDownloading: (downloading: boolean) => void
) => {
  isDownloading(true)
  try {
    let exportedFile: { data: string } | null = null
    switch (exportType) {
      case 'stats_entretiens':
        exportedFile = await client.stat.exportFollowupStats.query(filters)
        break
      case 'stats_instructions_dossier':
        exportedFile = await client.stat.exportHelpRequestStats.query(filters)
        break
      case 'stats_beneficiaires':
        exportedFile = await client.stat.exportBeneficiaryStats.query(filters)
        break
    }
    if (!exportedFile?.data) {
      throw new Error('no data')
    }
    const downloadLink = document.createElement('a')
    downloadLink.href = getExportUrl(exportedFile.data)
    downloadLink.download = getExportFilename(exportType)
    downloadLink.click()
    downloadLink.remove()
  } catch {
    useSnackbar().error(FAILED_DOWNLOAD_ERROR_MESSAGE)
  } finally {
    isDownloading(false)
  }
}
