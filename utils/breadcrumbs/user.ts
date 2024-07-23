import { routes } from '~/utils/routes'

const r = routes.user
type Routes = typeof r
type RouteName = keyof Routes

function getBread<T extends RouteName>(name: T) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path() }]
}

export const breadcrumbs = {
  AppOverview: () => getBread('AppOverview'),
  AppAccount: () => [...getBread('AppOverview'), ...getBread('AppAccount')]
}
