import type { WorkshopTab } from '../constants/workshop'
import { WorkshopsRoute } from './utils'
import type { WorkshopDetails } from '~/types/workshop'

function createSuffixUrl(options?: WorkshopRouteOptions) {
  const hasDefinedOptions = options && Object.values(options).every(o => !!o)

  if (hasDefinedOptions) {
    const { tab, ...params } = options
    const tabHash = tab ? `#${tab}` : ''

    if (Object.keys(params).length) {
      const urlParams = new URLSearchParams(params)
      return `?${urlParams}${tabHash}`
    }

    return tabHash
  }

  return ''
}

const getWorkshopRoute = (options?: WorkshopRouteOptions) => {
  const suffix = createSuffixUrl(options)
  return `${WorkshopsRoute}${suffix}`
}

export const routes = {
  AppWorkshopAdd: {
    name: 'AppWorkshopAdd',
    title: 'Créer un atelier',
    path: () => `${WorkshopsRoute}/add`
  },
  AppWorkshop: {
    name: 'AppWorkshop',
    title: (workshop: WorkshopDetails | null) =>
      workshop ? workshop.workshopName.name : 'Atelier',
    path: (id?: string) => `${WorkshopsRoute}/${id}`
  },
  AppWorkshopEdit: {
    name: 'AppWorkshopEdit',
    title: (workshop: WorkshopDetails | null) =>
      workshop
        ? "Modifier l'atelier " + workshop.workshopName.name
        : "Modifier l'atelier",
    path: (id?: string) => `${WorkshopsRoute}/${id}/edit`
  },
  AppWorkshops: {
    name: 'AppWorkshops',
    title: 'Ateliers collectifs, animations...',
    path: getWorkshopRoute
  }
}

type WorkshopRouteOptions = {
  tab?: WorkshopTab
}
