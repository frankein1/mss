import { StatsCardConfig } from '~/types/stat'
import domtoimage from 'dom-to-image-more'
import { StatFilterInput } from '~/server/schema'
import { getExportUrl } from '~/utils/export/getExportUrl'
import { getExportFilename } from '~/utils/export/getExportFilename'
import { FAILED_DOWNLOAD_ERROR_MESSAGE } from '~/utils/constants'

// Export Cards as image
const extractIds = (config: StatsCardConfig) => {
  return Object.values(config).map(item => item.id)
}
const extractNames = (config: StatsCardConfig) => {
  return Object.values(config).map(item => item.name)
}

type Filter = (node: HTMLElement | Node) => boolean

export const saveAsPngs = (
  statsCardConfig: StatsCardConfig,
  filter: Filter,
  finallyFn: () => void
) => {
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
  if (nodes.length && nodes.length > 0) {
    nodes.forEach(async (node, i) => {
      try {
        const scale = 1
        domtoimage
          .toPng(node, {
            quality: 0.9,
            filter: filter,
            width: node.clientWidth * scale,
            height: node.clientHeight * scale,
            style: {
              transform: 'scale(' + scale + ')',
              transformOrigin: 'top left'
            }
          })
          .then(function (dataUrl) {
            const link = document.createElement('a')
            link.download = configNames[i] + '.png'
            link.href = dataUrl
            link.click()
            document.body.removeChild(link)
          })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        useSnackbar().error("Les images n'ont pas pu être exportées.")
      } finally {
        finallyFn()
      }
    })
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
    // const exportedFile = isFollowUp
    //   ? await client.stat.exportFollowupStats.query(filters)
    //   : await client.stat.exportHelpRequestStats.query(filters)
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
