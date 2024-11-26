import { StatsCardConfig } from '~/types/stat'
import { toBlob } from 'html-to-image'
import { StatFilterInput } from '~/server/schema'
import { getExportUrl } from '~/utils/export/getExportUrl'
import { getExportFilename } from '~/utils/export/getExportFilename'
import { FAILED_DOWNLOAD_ERROR_MESSAGE } from '~/utils/constants'
import { BlobWriter, BlobReader, ZipWriter } from '@zip.js/zip.js'

// Export Cards as image
const extractIds = (config: StatsCardConfig) => {
  return Object.values(config).map(item => item.id)
}

type Filter = (node: HTMLElement | Node) => boolean

const createBlob = async (
  node: HTMLElement,
  size: {
    width: number
    height: number
  },
  filter: Filter
) => {
  const scale = 1
  const blob = await toBlob(node, {
    width: size.width * scale,
    height: size.height * scale,
    style: {
      transform: 'scale(' + scale + ')',
      transformOrigin: 'top left'
    },
    quality: 0.9,
    filter: filter
  })
  return blob
}

const findImageName = (statsCardConfig: StatsCardConfig, node: HTMLElement) => {
  return (
    Object.values(statsCardConfig).find(el => el.id === node.id)?.name ||
    'image'
  )
}

export const zipAndDownloadImages = async (
  zipname: string,
  statsCardConfig: StatsCardConfig,
  filter: Filter,
  finallyFn: () => void
) => {
  const configIds = extractIds(statsCardConfig)
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
      setTimeout(async () => {
        const width = node.clientWidth
        const height = node.clientHeight
        try {
          const blob = await createBlob(node, { width, height }, filter)
          if (blob == null) {
            console.error("L'image n'a pas pu être exporté", node.id)
            return
          }
          return zipWriter.add(
            findImageName(statsCardConfig, node) + '.png',
            new BlobReader(blob)
          )
        } catch (error) {
          useSnackbar().error("Les images n'ont pas pu être exportées.")
        }
      }, 300)
    } else {
      const width = node.clientWidth
      const height = node.clientHeight
      try {
        const blob = await createBlob(node, { width, height }, filter)
        if (blob == null) {
          console.error("L'image n'a pas pu être exporté", node.id)
          return
        }
        return zipWriter.add(
          findImageName(statsCardConfig, node) + '.png',
          new BlobReader(blob)
        )
      } catch (error) {
        useSnackbar().error("Les images n'ont pas pu être exportées.")
      }
    }
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
