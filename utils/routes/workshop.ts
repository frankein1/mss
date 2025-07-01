import { Workshop, WorkshopName } from '@prisma/client'
import { WorkshopsRoute } from './utils'

export const routes = {
  AppWorkshopAdd: {
    name: 'AppWorkshopAdd',
    title: 'Créer un atelier',
    path: () => `${WorkshopsRoute}/add`
  },
  AppWorkshop: {
    name: 'AppWorkshop',
    title: (workshop: Workshop & { workshopName: WorkshopName }) =>
      workshop.workshopName.name,
    path: (id?: string) => `${WorkshopsRoute}/${id}`
  },
  AppWorkshops: {
    name: 'AppWorkshops',
    title: 'Ateliers collectifs, animations...',
    path: () => WorkshopsRoute
  }
}
