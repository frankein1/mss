import { Workshop, WorkshopName } from '@prisma/client'
import { WorkshopsRoute } from './utils'
import { WorkshopDetails } from '~/types/workshop'

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
  AppWorkshops: {
    name: 'AppWorkshops',
    title: 'Ateliers collectifs, animations...',
    path: () => WorkshopsRoute
  }
}
