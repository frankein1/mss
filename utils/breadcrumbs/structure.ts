import { breadcrumbs as user } from './user'
import { routes } from '~/utils/routes'

const r = routes.structure
type Routes = typeof r
type RouteName = keyof Routes

function getBread<T extends RouteName>(name: T) {
  const title = r[name].title as Routes[T]['title']
  return [{ text: title, to: r[name].path() }]
}

export const breadcrumbs = {
  AppUsers: () => [...user.AppOverview(), ...getBread('AppUsers')],
  AppPartners: () => [...user.AppOverview(), ...getBread('AppPartners')],
  AppStructure: () => [...user.AppOverview(), ...getBread('AppStructure')],
  AppStructureEdit: () => [
    ...user.AppOverview(),
    ...getBread('AppStructureEdit')
  ],
  AppStructureSubjects: () => [
    ...user.AppOverview(),
    ...getBread('AppStructureSubjects')
  ]
}
