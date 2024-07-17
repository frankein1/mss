import { AppRoute } from './utils'
import { breadcrumbs as user } from './user'

export const routes = {
  AppUsers: {
    name: 'AppUsers',
    title: 'Gérer les utilisateurs',
    path: () => `${AppRoute}/users`
  },
  AppPartners: {
    name: 'AppPartners',
    title: 'Annuaire des partenaires',
    path: () => `${AppRoute}/partners`
  },
  AppStructure: {
    name: 'AppStructure',
    title: 'Configurer votre structure',
    path: () => `${AppRoute}/structure`
  },
  AppStructureEdit: {
    name: 'AppStructureEdit',
    title: 'Modifier ma structure',
    path: () => `${AppRoute}/structure/edit`
  },
  AppStructureSubjects: {
    name: 'AppStructureSubjects',
    title: 'Ajouter un accompagnement',
    path: () => `${AppRoute}/structure/subjects`
  }
} as const

type Routes = typeof routes
type RouteName = keyof Routes

function getBread<T extends RouteName>(name: T) {
  const title = routes[name].title as Routes[T]['title']
  return [{ text: title, to: routes[name].path() }]
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
