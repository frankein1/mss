import { AppRoute } from './utils'

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
