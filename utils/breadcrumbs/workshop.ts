import { routes } from '~/utils/routes'
import { breadcrumbs as user } from './user'

const r = routes.workshop
type Routes = typeof r
type RouteName = keyof Routes

function getBread<T extends RouteName>(name: T) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path() }]
}

export const breadcrumbs = {
  AppWorkshopAdd: () => [
    ...user.AppOverview(),
    ...getBread('AppWorkshops'),
    ...getBread('AppWorkshopAdd')
  ],
  AppWorkshops: () => [...user.AppOverview(), ...getBread('AppWorkshops')]
}
