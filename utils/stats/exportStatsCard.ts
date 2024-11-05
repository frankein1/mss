import { StatsCardConfig } from '~/types/stat'
import domtoimage from 'dom-to-image-more'

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
