import { breadcrumbs as user } from './user'
import { routes } from '~/routes'

const r = routes.stats
type Routes = typeof r
type RouteName = keyof Routes

function getBread<T extends RouteName>(name: T) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path() }]
}

export const breadcrumbs = {
  AppStats: () => [...user.AppOverview(), ...getBread('AppStats')]
}
