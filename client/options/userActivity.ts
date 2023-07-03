import { UserActivityType } from '@prisma/client'

export const userActivityTypeLabels: { [key in UserActivityType]: string } = {
  [UserActivityType.ARCHIVE]: 'Archivage',
  [UserActivityType.CREATE]: 'Création',
  [UserActivityType.DELETE]: 'Suppression',
  [UserActivityType.LOGIN]: 'Connexion',
  [UserActivityType.LOGOUT]: 'Déconnexion',
  [UserActivityType.UPDATE]: 'Mise à jour',
  [UserActivityType.VIEW]: 'Accès'
}
