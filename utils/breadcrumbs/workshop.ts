import { routes } from '~/utils/routes'
import { breadcrumbs as user } from './user'
import type { WorkshopDetails } from '~/types/workshop'

const r = routes.workshop
type Routes = typeof r
type RouteName = keyof Routes

function getBread<T extends RouteName>(name: T) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path() }]
}

const getAppWorkshopBread = (workshop: WorkshopDetails) => {
  const title = r.AppWorkshop.title(workshop)
  return [{ text: title, to: r.AppWorkshop.path(workshop.id) }]
}

export const breadcrumbs = {
  AppWorkshopAdd: () => [
    ...user.AppOverview(),
    ...getBread('AppWorkshops'),
    ...getBread('AppWorkshopAdd')
  ],
  AppWorkshopEdit: (workshop: WorkshopDetails) => [
    ...user.AppOverview(),
    ...getBread('AppWorkshops'),
    ...getAppWorkshopBread(workshop)
  ],
  AppWorkshop: (workshop: WorkshopDetails) => [
    ...user.AppOverview(),
    ...getBread('AppWorkshops'),
    ...getAppWorkshopBread(workshop)
  ],
  AppWorkshops: () => [...user.AppOverview(), ...getBread('AppWorkshops')]
}
