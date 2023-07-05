import { UserRole, UserStatus } from '@prisma/client'
import { labelsToOptions } from '~/utils/options'

const { Administrator: _, ...otherRoles } = UserRole
export const NonAdminUserRole = otherRoles

export type NonAdminUserRole = keyof typeof NonAdminUserRole

export const NonAdminUserRoleLabels: { [key in NonAdminUserRole]: string } = {
  [UserRole.ReceptionAgent]: "Agent d'accueil/CNFS",
  [UserRole.Instructor]: 'Instructeur',
  [UserRole.SocialWorker]: 'Travailleur social',
  [UserRole.Referent]: 'Référent',
  [UserRole.StructureManager]: 'Responsable de structure'
}

export const nonAdminUserRoleOptions = labelsToOptions(NonAdminUserRoleLabels)

export const UserRoleLabels: { [key in UserRole]: string } = {
  ...NonAdminUserRoleLabels,
  [UserRole.Administrator]: 'Administrateur'
}

export const userRoleOptions = labelsToOptions(UserRoleLabels)

export const UserStatusLabels: { [key in UserStatus]: string } = {
  [UserStatus.Active]: 'Activé',
  [UserStatus.Disabled]: 'Désactivé'
}

export const userStatusOptions = labelsToOptions(UserStatusLabels)
