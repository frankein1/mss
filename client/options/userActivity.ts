import { UserActivityType } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const userActivityTypeKeys = buildKeys({
  [UserActivityType.ARCHIVE]: 'Archivage',
  [UserActivityType.CREATE]: 'Création',
  [UserActivityType.DELETE]: 'Suppression',
  [UserActivityType.LOGIN]: 'Connexion',
  [UserActivityType.LOGOUT]: 'Déconnexion',
  [UserActivityType.UPDATE]: 'Mise à jour',
  [UserActivityType.VIEW]: 'Accès'
})
