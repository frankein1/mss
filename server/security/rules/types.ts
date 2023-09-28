import { User, UserRole } from '@prisma/client'

export type SecurityRuleGrantee = Pick<
  User,
  'id' | 'status' | 'role' | 'structureId'
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

export type SecurityTargetWithCreator =
  | {
      createdById: string | null
    }
  | { createdBy: { id: string } | null }

export type SecurityRule<
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Input = unknown
> = (grantee: Grantee, input: Input) => boolean | Promise<Boolean>

export const AllowSecurityCheck = <
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee
>(
  _grantee: Grantee,
  _input: any
) => {
  return true
}
