import { User, UserRole } from '@prisma/client'

export type SecurityRuleGrantee = Pick<
  User,
  'id' | 'role' | 'structureId' | 'status'
>

export type SecurityTargetWithStructure = {
  structureId: string | null
}

export type SecurityTargetWithReferents =
  | {
      referents: { id: string }[]
    }
  | { referents: string[] }

// Helper type to safely type an array with at least one UserRole
export type AllowedRoles =
  | [UserRole]
  | [UserRole, UserRole]
  | [UserRole, UserRole, UserRole]
  | [UserRole, UserRole, UserRole, UserRole]
  | [UserRole, UserRole, UserRole, UserRole, UserRole]
  | [UserRole, UserRole, UserRole, UserRole, UserRole, UserRole]

export type SecurityTargetWithCreator = {
  createdById: string | null
}
