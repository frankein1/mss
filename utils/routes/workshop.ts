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
    path: () => WorkshopsRoute
  }
}
