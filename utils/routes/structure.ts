import { AppRoute } from './utils'

const StructureRoute = `${AppRoute}/structure`

export const routes = {
  AppPartners: {
    name: 'AppPartners',
    title: 'Annuaire des partenaires',
    path: () => `${AppRoute}/partners`
  },
  AppStructure: {
    name: 'AppStructure',
    title: 'Configurer votre structure',
    path: () => StructureRoute
  },
  AppStructureUsers: {
    name: 'AppStructureUsers',
    title: 'Configurer votre structure',
    path: () => `${StructureRoute}/users`
  },
  AppStructureInfo: {
    name: 'AppStructureInfo',
    title: 'Configurer votre structure',
    path: () => `${StructureRoute}/info`
  },
  AppStructureSocialSupportSubjects: {
    name: 'AppStructureSocialSupportSubjects',
    title: 'Configurer votre structure',
    path: () => `${StructureRoute}/social-support-subjects`
  },
  AppStructureEdit: {
    name: 'AppStructureEdit',
    title: 'Modifier ma structure',
    path: () => `${StructureRoute}/edit`
  },
  AppStructureSocialSupportSubjectsEdit: {
    name: 'AppStructureSocialSupportSubjectsEdit',
    title: 'Ajouter un accompagnement',
    path: () => `${StructureRoute}/social-support-subjects/edit`
  },
  AppStructureUserEdit: {
    name: 'AppStructureUserEdit',
    title: (userName: string) => `Modifier le compte de ${userName}`,
    path: (userId: string) => `${StructureRoute}/users/${userId}/edit`
  },
  AppStructureUserDelete: {
    name: 'AppStructureUserDelete',
    title: (userName: string) => `Supprimer le compte de ${userName}`,
    path: (userId: string) => `${StructureRoute}/users/${userId}/delete`
  },
  AppStructureUserAdd: {
    name: 'AppStructureUserAdd',
    title: `Ajouter un nouvel utilisateur`,
    path: () => `${StructureRoute}/users/add`
  },
  AppStructureDora: {
    name: 'AppStructureDora',
    title: `Rechercher un acteur du territoire sur DORA`,
    path: () => `${StructureRoute}/dora`
  }
} as const
