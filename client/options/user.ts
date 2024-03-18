import { UserRole, UserStatus } from '@prisma/client'
import { buildKeys } from '~/utils/keys/keyBuilder'

export const nonAdminUserRoleKeys = buildKeys({
  [UserRole.ReceptionAgent]: "Agent d'accueil/CNFS",
  [UserRole.Instructor]: 'Instructeur',
  [UserRole.SocialWorker]: 'Travailleur social',
  [UserRole.Referent]: 'Référent',
  [UserRole.StructureManager]: 'Responsable de structure'
})

export const userRoleKeys = buildKeys({
  ...nonAdminUserRoleKeys.byKey,
  [UserRole.Administrator]: 'Administrateur'
})

export const userStatusKeys = buildKeys({
  [UserStatus.Active]: 'Activé',
  [UserStatus.Disabled]: 'Désactivé'
})
