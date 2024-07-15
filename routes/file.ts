import { FilesRoute } from './utils'

export const routes = {
  AppFile: {
    name: 'AppFile',
    title: 'Dossiers',
    path: (familyFileId: string) => `${FilesRoute}/${familyFileId}`
  }
} as const
