import { AppRoute } from './utils'

export const routes = {
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
  },
  AppStructureUserEdit: {
    name: 'AppStructureUserEdit',
    title: (userName: string) => `Modifier le compte de ${userName}`,
    path: (userId: string) => `${AppRoute}/structure/users/${userId}/edit`
  },
  AppStructureUserDelete: {
    name: 'AppStructureUserDelete',
    title: (userName: string) => `Supprimer le compte de ${userName}`,
    path: (userId: string) => `${AppRoute}/structure/users/${userId}/delete`
  },
  AppStructureUserAdd: {
    name: 'AppStructureUserAdd',
    title: `Ajouter un nouvel utilisateur`,
    path: () => `${AppRoute}/structure/users/add`
  }
} as const
